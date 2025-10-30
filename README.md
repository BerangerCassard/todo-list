todo-list

Documentation

- La documentation détaillée est disponible dans `docs/README.md`.
- Les images associées doivent être placées dans `docs/assets/` et référencées avec des chemins relatifs depuis la doc.

Configuration

1. Créez un fichier `.env.local` à la racine du projet avec:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

2. Redémarrez le serveur de développement:

```
npm run dev
```
