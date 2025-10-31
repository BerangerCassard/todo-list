// Importation des hooks React nécessaires
import { useEffect, useState } from "react";
// Importation des composants pour l'authentification et la liste de tâches
import Auth from "./components/Auth";
import TodoList from "./components/TodoList";
// Importation du client Supabase configuré
import { supabase } from "./lib/supabase";

function App() {
	// État pour stocker la session utilisateur (connecté ou non)
	const [session, setSession] = useState<any>(null);
	// État pour gérer l'affichage du chargement initial
	const [loading, setLoading] = useState(true);

	// Effect hook exécuté au montage du composant
	useEffect(() => {
		// ════════════════════════════════════════════════════════════
		// PARTIE 1 : Vérification initiale de la session
		// ════════════════════════════════════════════════════════════
		supabase.auth
			.getSession() // Demande à Supabase : "Quelqu'un est connecté ?"
			.then(({ data: { session } }) => {
				// Récupère la réponse
				setSession(session); // Stocke la session (ou null)
				setLoading(false); // Arrête le spinner de chargement
			});

		// ════════════════════════════════════════════════════════════
		// PARTIE 2 : Abonnement aux changements d'auth
		// ════════════════════════════════════════════════════════════
		const {
			data: { subscription }, // Récupère l'objet subscription
		} = supabase.auth.onAuthStateChange(
			// S'abonne aux événements
			(_event, session) => {
				// Callback appelé à chaque changement
				// _event peut être :
				// - 'SIGNED_IN' : Connexion réussie
				// - 'SIGNED_OUT' : Déconnexion
				// - 'TOKEN_REFRESHED' : Token renouvelé
				// - 'USER_UPDATED' : Profil modifié

				setSession(session); // Met à jour l'état à chaque changement
			},
		);

		// ════════════════════════════════════════════════════════════
		// PARTIE 3 : Nettoyage
		// ════════════════════════════════════════════════════════════
		return () => subscription.unsubscribe(); // Se désabonne quand le composant disparaît
	}, []); // Tableau vide = exécuté UNE SEULE FOIS au montage

	// Affichage de l'écran de chargement pendant la vérification de la session
	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
				<div className="text-slate-600">Chargement...</div>
			</div>
		);
	}

	// Affichage conditionnel : TodoList si connecté, Auth sinon
	return session ? <TodoList /> : <Auth />;
}

export default App;
