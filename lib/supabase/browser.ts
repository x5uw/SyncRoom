/**
 * lib/supabase/browser.ts
 *
 * Initializes and returns a Supabase client for **Client Components** (browser-side).
 *
 * - Use this only inside React components that run in the browser.
 * - It allows you to fetch data, subscribe to realtime updates, etc., directly from React.
 * - It SHOULD NOT be used in API routes or Server Components.
 */

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../types/supabase";

export const supabaseBrowser = () =>
	createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,			// Ensure this is defined in your .env file
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!		// Ensure this is defined in your .env file
	);
