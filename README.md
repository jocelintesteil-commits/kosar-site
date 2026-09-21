# Kosár — mise en ligne

Ce dossier contient un vrai site web : n'importe qui peut le visiter, créer son
compte, et avoir son propre planning de courses. Il faut 3 comptes gratuits
(sauf l'API Anthropic, payante à l'usage mais très peu chère pour cet usage).

## 1. Créer le projet Supabase (comptes + base de données)

1. Va sur https://supabase.com, crée un compte gratuit, puis "New project".
2. Une fois créé, va dans **SQL Editor** → **New query**, colle tout le
   contenu du fichier `supabase-schema.sql` de ce dossier, et clique **Run**.
3. Va dans **Project Settings → API**. Note :
   - **Project URL** (ex: `https://xxxx.supabase.co`)
   - **anon public key** (une longue chaîne de caractères)
4. Ouvre `public/index.html`, tout en haut du `<script>`, remplace :
   ```js
   const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
   const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";
   ```
   par tes vraies valeurs.
5. (Optionnel mais conseillé) Dans **Authentication → Providers → Email**,
   désactive "Confirm email" si tu veux que les gens puissent utiliser le site
   immédiatement après inscription, sans cliquer un lien de confirmation.

## 2. Créer une clé API Anthropic (pour la génération IA)

1. Va sur https://console.anthropic.com, crée un compte, ajoute un moyen de
   paiement (facturation à l'usage — quelques centimes par génération de
   semaine avec ce projet).
2. Crée une clé API dans **API Keys**. Garde-la précieusement, tu vas la
   mettre dans Vercel (jamais dans le code, jamais publique).

## 3. Déployer sur Vercel (hébergement)

1. Va sur https://vercel.com, crée un compte gratuit (tu peux te connecter
   avec GitHub).
2. Le plus simple : mets ce dossier dans un dépôt GitHub, puis sur Vercel
   clique **Add New → Project** et importe ce dépôt.
   (Alternative en ligne de commande : installe `npm i -g vercel`, puis lance
   `vercel` depuis ce dossier et suis les instructions.)
3. Dans les réglages du projet Vercel, va dans **Environment Variables** et
   ajoute :
   - `ANTHROPIC_API_KEY` = ta clé Anthropic de l'étape 2
4. Clique **Deploy**. Après quelques secondes, Vercel te donne une adresse du
   type `https://kosar-site.vercel.app` — c'est ton site, en ligne, que
   n'importe qui peut visiter.

## 4. (Optionnel) Un vrai nom de domaine

Dans le projet Vercel → **Settings → Domains**, tu peux relier un domaine
acheté ailleurs (Namecheap, OVH, etc., quelques euros par an) ou en acheter
un directement depuis Vercel.

## Comment ça marche

- Chaque visiteur crée son compte (email + mot de passe) et a ses propres
  préférences + son propre historique, grâce à Supabase.
- La génération IA passe par une petite fonction serveur (`api/generate.js`)
  qui utilise ta clé Anthropic — elle n'est jamais visible depuis le
  navigateur des visiteurs.
- Le design "ticket de caisse" est le même que la version que tu utilisais
  dans Claude.

## Pour continuer à l'améliorer

Tu peux revenir dans une conversation Claude (avec **Claude Code** de
préférence, pour pouvoir tester et redéployer directement) et lui donner ce
dossier pour continuer à ajouter des fonctionnalités.
