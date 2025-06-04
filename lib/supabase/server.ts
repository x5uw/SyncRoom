/**
 * lib/supabase/server.ts
 *
 * Initializes and returns a Supabase client for **Server Components, Route Handlers, 
 * and Server Actions** (all server-side). 
 *
 * - This uses `createServerActionClient` from `@supabase/ssr`, which automatically 
 *   binds to Next.js’s `cookies` API so that:
 *     • Supabase can read the existing "supabase-auth-token" cookie.
 *     • After an OAuth flow, Supabase can set the session cookie on the response.
 * - Use this in any file that runs on the server (e.g., Route Handlers under app/api/…,
 *   or Server Components/Actions). 
 */


/*
"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../types/supabase";

export const supabaseServer = () => {
	const cookieStore = cookies();

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,				// Ensure this is defined in your .env file
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,			// Ensure this is defined in your .env file
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
			},
		}
	);
};

*/


import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from "../types/supabase";

export const supabaseServer = () => {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}