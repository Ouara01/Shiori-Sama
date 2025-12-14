# ⚡ GUIDE ALTERNATIVE - VERCEL DEPLOYMENT (Recommandé!)

**Pourquoi Vercel plutôt que GitHub Pages?**

| Critère | GitHub Pages | Vercel |
|---------|-------------|--------|
| **Déploiement** | Manuel | Auto-magique |
| **Vitesse** | Bon | Excellent |
| **Support Next.js** | Limité | Optimisé (créateurs) |
| **SSR** | Non | Oui |
| **SEO** | Bon | Excellent |
| **Preview Branches** | Non | Oui |
| **Analytics** | Non | Gratuit |
| **Coût** | Gratuit | Gratuit (plan hobby) |
| **Setup** | 15 min | 2 min |

---

## 🚀 SETUP VERCEL EN 5 MIN

### **1. Va sur Vercel**

```
https://vercel.com/signup
```

Clique "Continue with GitHub" et autorise Vercel.

### **2. Import ton Repo**

1. Clique "Add New..." → "Project"
2. Sélectionne `shiori-sama-public` dans la liste
3. Clique "Import"

### **3. Configuration (Important!)**

Vercel détecte Next.js automatiquement. Tu dois juste vérifier:

```
Build Command:      npm run build  ← Default ✅
Output Directory:   .next          ← Vercel gère ça
Install Command:    npm ci         ← Default ✅
```

**IMPORTANT:** Modifie `next.config.ts` pour Vercel:

```typescript
const nextConfig = {
  output: 'export',  // ← Pour Vercel, c'est OK (recommandé même)
  // Pas besoin de basePath pour Vercel!
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
};
```

### **4. Deploy**

Clique "Deploy" et attends 60 secondes!

### **5. Site Live**

```
https://shiori-sama-public.vercel.app
```

✅ **C'est tout!**

---

## 🔄 WORKFLOW VERCEL

Maintenant:
1. Tu codes localement
2. Tu fais `git push`
3. Vercel détecte la push
4. Vercel build & deploy auto
5. Site mis à jour en 60 secondes

**Plus besoin de faire npm build + git push out/ !**

---

## 📈 ANALYTICS VERCEL

Vercel te donne gratuitement:
- Page views
- Response time
- Core Web Vitals
- Traffic sources

Regarde sur le dashboard Vercel!

---

## ✅ DECISION: GitHub Pages vs Vercel

**GitHub Pages:**
- Utile si: Tu veux héberger le code ET le site au même endroit
- Pros: Totalement gratuit, intégré GitHub
- Cons: Setup plus compliqué, statique seulement

**Vercel (Recommandé):**
- Utile si: Tu veux la meilleure expérience Next.js
- Pros: Auto-deploy, analytics, extremely fast
- Cons: Domaine Vercel (mais c'est gratuit)

**RECOMMENDATION FINALE:** Va avec **Vercel** pour ce projet. C'est fait pour Next.js et c'est plus simple! 🚀

