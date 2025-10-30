# Documentation du projet

Ce dossier contient la documentation fonctionnelle et technique de l’application.

## Structure
- `docs/README.md`: page d’accueil de la documentation
- `docs/assets/`: images et médias utilisés dans la doc

## Ajouter des images
1. Placez vos fichiers image (PNG/JPG/SVG/GIF) dans `docs/assets/`.
2. Référencez-les dans la doc avec un chemin relatif.

Exemples:

Image en markdown simple:
```markdown
![Aperçu de l’application](./assets/apercu-app.png)
```

Image avec balise HTML (contrôle de la taille):
```html
<img src="./assets/apercu-app.png" alt="Aperçu de l’application" width="720" />
```

## Captures et diagrammes
- Vous pouvez déposer ici vos captures d’écran.
- Pour des diagrammes Mermaid, gardez aussi les sources `.md` afin de pouvoir les regénérer.

## Bonnes pratiques
- Nommez vos fichiers de manière descriptive (ex: `flow-auth.png`, `schema-tables.png`).
- Évitez les espaces dans les noms de fichiers.
- Versionnez uniquement ce qui est utile et non sensible.

## Liens utiles
- Guide Tailwind: `https://tailwindcss.com/docs`
- Vite: `https://vitejs.dev/`
- Supabase: `https://supabase.com/docs`
