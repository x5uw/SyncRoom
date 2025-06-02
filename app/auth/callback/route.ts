/**
 * auth/callback/route.ts
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	// if "next" is in param, use it as the redirect URL
	const next = searchParams.get("next") ?? "/";

	if (code) {
		const cookieStore = cookies();
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					get(name: string) {
						return cookieStore.get(name)?.value;
					},
					set(name: string, value: string, options: CookieOptions) {
						cookieStore.set({ name, value, ...options });
					},
					remove(name: string, options: CookieOptions) {
						cookieStore.delete({ name, ...options });
					},
				},
			}
		);

		//FIXME: This may be leading to error page when using auth code flow for linking spotify
		// May need to replace with:
		/**
		 * 
			// it redirected to this route. We just need to verify there’s a session now:
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error || !session) {
				// No valid session → go to your error page
				return NextResponse.redirect(`${origin}/auth/auth-code-error`);
			}

			// Session is valid → send the user “home” (or to whatever “next” was)
			return NextResponse.redirect(`${origin}${next}`);
		 */

		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			return NextResponse.redirect(`${origin}${next}`);
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
