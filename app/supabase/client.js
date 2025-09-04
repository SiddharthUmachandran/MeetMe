import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getUserID = async () =>{
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if(userError){
      console.error(userError);
      return null;
    }
    return user?.id;
  }
