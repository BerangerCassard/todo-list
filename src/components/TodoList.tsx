import { useState, useEffect } from 'react';
import { supabase, type Todo } from '../lib/supabase';
import { Plus, Trash2, Check, LogOut, Circle } from 'lucide-react';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    // Au montage: on charge les todos de l’utilisateur connecté
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      // Récupère l’utilisateur courant
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Charge les todos de l’utilisateur, plus récentes en premier
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setAdding(true);
    try {
      // Vérifie l’utilisateur et insère une nouvelle tâche liée à son id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('todos')
        .insert([{ title: newTodo.trim(), user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        // Ajoute la nouvelle tâche au début de la liste
        setTodos([data, ...todos]);
        setNewTodo('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setAdding(false);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      // Inverse l’état d’achèvement et met à jour "updated_at"
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      // Met à jour la liste localement pour garder l’UI réactive
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      // Supprime côté base puis côté état local
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleSignOut = async () => {
    // Déconnecte l’utilisateur courant
    await supabase.auth.signOut();
  };

  const activeTodos = todos.filter(t => !t.completed).length;
  const completedTodos = todos.filter(t => t.completed).length;

  if (loading) {
    return (
      // Écran de chargement centré
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Chargement...</div>
      </div>
    );
  }

  return (
    // Conteneur principal avec padding global
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Carte Todo */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête: dégradé, titre, actions, stats */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Mes Tâches</h1>
              {/* Bouton déconnexion */}
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-white/20 rounded-lg transition"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            {/* Statistiques rapides */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4" />
                <span>{activeTodos} actives</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{completedTodos} terminées</span>
              </div>
            </div>
          </div>

          {/* Corps: saisie + liste */}
          <div className="p-6">
            {/* Saisie nouvelle tâche */}
            <form onSubmit={addTodo} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Ajouter une nouvelle tâche..."
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={adding}
                />
                {/* Bouton ajouter */}
                <button
                  type="submit"
                  disabled={adding || !newTodo.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter
                </button>
              </div>
            </form>

            {/* Liste des tâches */}
            <div className="space-y-2">
              {todos.length === 0 ? (
                // État vide
                <div className="text-center py-12 text-slate-400">
                  <p className="text-lg">Aucune tâche pour le moment</p>
                  <p className="text-sm mt-2">Commencez par en ajouter une ci-dessus</p>
                </div>
              ) : (
                todos.map((todo) => (
                  // Item: conteneur hover, actions à droite
                  <div
                    key={todo.id}
                    className="group flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                  >
                    {/* Bouton bascule terminé/en cours */}
                    <button
                      onClick={() => toggleTodo(todo.id, todo.completed)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                        todo.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-slate-300 hover:border-blue-500'
                      }`}
                    >
                      {todo.completed && <Check className="w-4 h-4 text-white" />}
                    </button>

                    {/* Titre de la tâche (line-through si terminée) */}
                    <span
                      className={`flex-1 text-slate-800 transition ${
                        todo.completed ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {todo.title}
                    </span>

                    {/* Bouton suppression (visible au survol) */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
