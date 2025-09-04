'use server';

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';

export async function createNewTimeline() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("Authentication error:", userError);
        return { error: "Authentication failed. Please log in." };
    }

    try {
        const { data, error } = await supabase
            .from("Workflow")
            .insert([
                {
                    user_id: user.id,
                    created_at: new Date().toISOString(),
                    name: "hello"
                }
            ])
            .select(); // Select the newly created row to get its ID

        if (error) {
            console.error("Supabase insert error:", error);
            return { error: error.message };
        }

        // Revalidate the dashboard page to show the new timeline immediately
        revalidatePath('/dashboard');

        return { data: data[0] }; // Return the created row data
    } catch (err) {
        console.error("Unexpected error:", err);
        return { error: "An unexpected error occurred." };
    }
}

export async function getProjects() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        console.error("Authentication error:", userError);
        return { error: "Authentication failed. Please log in." };
    }

    try {
        const { data, error } = await supabase
            .from("Workflow")
            .select('id, name, status')
            .eq('user_id', user.id)
        if(error){
            console.error("Supabase select error:", error);
            return { error: error.message };
        }
        else{
            return data;
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        return { error: "An unexpected error occurred." };
    }
}