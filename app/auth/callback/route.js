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
    const encryptedToken = encrypt(providerRefreshToken);
    const {data2, error2} = await supabase
      .from('user_tokens')
      .insert([
        { user_id : userId, token: encryptedToken}
      ]) 
    if(error2){
      console.log("Something went wrong twin:\n");
      console.error(error2);
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