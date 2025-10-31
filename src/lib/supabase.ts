import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
	| string
	| undefined;

if (!supabaseUrl) {
	throw new Error(
		"VITE_SUPABASE_URL manquant. Ajoutez-le dans votre fichier .env.local",
	);
}

if (!supabaseAnonKey) {
	throw new Error(
		"VITE_SUPABASE_ANON_KEY manquant. Ajoutez-le dans votre fichier .env.local",
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Todo = {
	id: string;
	user_id: string;
	title: string;
	completed: boolean;
	created_at: string;
	updated_at: string;
};
