import type { NextConfig } from "next";

// Configuration conditionnelle: basePath uniquement pour production (export)
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /**
   * Configuration Next.js - Production Ready
   * Compatible GitHub Pages avec output: 'export'
   * Développement local: basePath désactivé (fonctionne normalement)
   * Production/Export: basePath activé (pour GitHub Pages)
   */
  output: 'export',  // CRUCIAL: Génère site statique HTML
  
  // ⚠️ IMPORTANT: basePath seulement en production (export/build)
  // En développement (npm run dev), basePath = undefined = localhost:3000 fonctionne
  ...(isProduction && {
    basePath: '/shiori-sama-public',  // ← À adapter au nom de ton repo GitHub
    assetPrefix: '/shiori-sama-public',  // ← Assets path pour Pages
  }),
  
  trailingSlash: true,  // Important pour routing statique
  
  reactCompiler: true,  // Babel React Compiler optimizations
  
  images: {
    unoptimized: true,  // IMPORTANT: Pages statiques ne supportent pas optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.kitsu.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
