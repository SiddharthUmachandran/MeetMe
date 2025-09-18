// app/auth/callback/route.js
import { NextResponse } from "next/server";
import { createClient } from "../../supabase/server";
import { encrypt } from "../../../utils/crypto";
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    console.log("supabase client: ", supabase);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    // Access and store the tokens from the session data
    const providerToken = data.session?.provider_token;
    const providerRefreshToken = data.session?.provider_refresh_token;
    const userId = data.session?.user.id;
    const email = data.session?.user.email;
    const name = data.session?.user.user_metadata.full_name;
    const encryptedToken = Buffer.from(encrypt(providerRefreshToken).encrypted).toString("base64");
    console.log("encrypted token: ", encryptedToken);
    const { data: upserted, error: upsertError } = await supabase
      .from('user_tokens')
      .upsert(
        { user_id: userId, token: encryptedToken }, 
        { onConflict: 'user_id'} // tells Postgres which column to check
     );
    if (upsertError) {
      console.error("Upsert failed:", upsertError);
    } else {
      console.log("Upsert success:", upserted);
    }

    const {data: data2, error: error2} = await supabase
      .from('users')
      .upsert(
        { id: userId, email: email, name: name },
        { onConflit: 'id'}
      )
    if(error2){
      console.error("Upsert user failed:", error2);
    }
    // TODO: Use your SQL client (e.g., from your Python backend) to
    // securely store the userId and providerRefreshToken in your database.
    // Ensure you handle the case where these tokens might not exist.
    
    // Example: A simple database call
    // await yourDatabaseClient.from('users').update({
    //   google_refresh_token: providerRefreshToken
    // }).eq('id', userId);

    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}