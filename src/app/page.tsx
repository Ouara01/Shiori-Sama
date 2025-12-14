'use client';

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import ShioriClient from './shiori-client';

/**
 * PAGE D'ACCUEIL - SHIORI-SAMA
 * 
 * Structure HTML exacte du projet original convertie en TSX/Next.js
 * Cette page conserve la même structure DOM que l'original pour compatibilité totale
 * 
 * Contient:
 * - En-tête avec menu burger et navigation
 * - Section bannière de saison
 * - 5 carousels pour différentes catégories d'animes
 * - Pied de page
 * - ShioriClient pour toute la logique client (JS d'origine)
 */
export default function Home() {
  return (
    <>
      {/* ===== EN-TÊTE PRINCIPAL ===== */}
      <header className="shiori-header">
        
        {/* Bouton menu burger (visible sur mobile) */}
        <div className="burger-menu-btn" id="burgerBtn">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Barre de recherche mobile */}
        <div className="shiori-mobile-search">
          <img src="/icons/magnifying-glass-search-svgrepo-com.svg" alt="Search" className="search-icon-mobile"/>
          <input type="text" placeholder="Rechercher..."/>
          <div id="shiori-result-mobile">
            <p>Résultats de recherche...</p>
          </div>
        </div>

        {/* Logo/Titre du site */}
        <Link className="titre-accueil" href="/">SHIORI SAMA</Link>

        {/* Menu mobile (caché par défaut, affiché avec CSS au clic) */}
        <div className="mobile-menu mobile-menu-top" id="mobileMenu">
          <div className="mobile-menu-header">
            <div className="mobile-menu-title">Menu</div>
          </div>
          <div className="mobile-menu-content">
            <a href="#" className="mobile-link" data-route="/catalogue">
              <img src="/icons/cards.svg" alt="Catalogue" className="nav-mobile-icon"/>
              <span>Catalogue</span>
            </a>
            <a href="#" className="mobile-link" data-route="/planning">
              <img src="/icons/calendar.svg" alt="Planning" className="nav-mobile-icon"/>
              <span>Planning</span>
            </a>
            <a href="#" className="mobile-link" data-route="/profil">
              <img src="/icons/user-square.svg" alt="Profil" className="nav-mobile-icon"/>
              <span>Profil</span>
            </a>
          </div>
        </div>

        {/* Navigation desktop */}
        <nav>
          <section className="nav-links">
            {/* Barre de recherche desktop */}
            <div className="shiori-desktop-search">
              <img src="/icons/magnifying-glass-search-svgrepo-com.svg" alt="Search" className="search-icon"/>
              <input type="text" placeholder="Rechercher..."/>
              <div id="shiori-result-desktop">
                <p>Résultats de recherche...</p>
              </div>
            </div>

            {/* Lien Catalogue */}
            <a href="#Catalogue" className="nav-catalogue" data-route="/catalogue">
              <img src="/icons/cards.svg" alt="Catalogue" className="nav-icon"/>
              <span>Catalogue</span>
            </a>

            {/* Lien Planning */}
            <a href="#Planning" className="nav-planning" data-route="/planning">
              <img src="/icons/calendar.svg" alt="Planning" className="nav-icon"/>
              <span>Planning</span>
            </a>

            {/* Lien Profil */}
            <a href="#Profil" className="nav-profil" data-route="/profil">
              <img src="/icons/user-square.svg" alt="Profil" className="nav-icon"/>
              <span>Profil</span>
            </a>
          </section>
        </nav>
      </header>

      {/* Overlay pour fermer le menu mobile au clic */}
      <div className="menu-overlay"></div>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <main id="main-content">
        
        {/* Bannière de la saison actuelle */}
        <section className="season-banner-wrapper" id="home-section">
          <section className="season-banner">
            <div className="season-banner-images" id="season-banner-images"></div>
            <div className="season-banner-text">
              <h2>NOUVELLE SAISON</h2>
              <p>Montez dans le train pour suivre les pépites du moment !</p>
            </div>
          </section>
        </section>

        {/* ===== 5 CAROUSELS D'ANIMES ===== */}

        {/* Carousel 1: Reprendre votre visionnage (historique depuis localStorage) */}
        <section className="section-reprendre">
          <div className="rep-visio">
            <img className="h2-icons" src="/icons/clock.svg" alt="Icône horloge"/>
            <h2 className="h2-visio">REPRENEZ VOTRE VISIONNAGE</h2>
          </div>
          <div className="carousel-anime" id="carousel-reprendre"></div>
        </section>

        {/* Carousel 2: Sorties du jour (animes diffusés aujourd'hui via Jikan API) */}
        <section className="section-sorties-jour">
          <div className="sorties-jour">
            <img className="h2-icons" src="/icons/arrow-left-04.svg" alt="Précédent"/>
            <h2 className="h2-sorties" id="date-title"></h2>
            <img className="h2-icons" src="/icons/arrow-right-04.svg" alt="Suivant"/>
          </div>
          <div className="carousel-anime" id="carousel-sorties-jour"></div>
        </section>

        {/* Carousel 3: Derniers épisodes (animes populaires via AniList) */}
        <section className="section-derniers-episodes">
          <div className="derniers-episodes">
            <img className="h2-icons" src="/icons/directbox-receive.svg" alt="Icône nouveautés"/>
            <h2 className="h2-episodes">DERNIERS ÉPISODES AJOUTÉS</h2>
          </div>
          <div className="carousel-anime" id="carousel-episodes"></div>
        </section>

        {/* Carousel 4: Derniers scans (mangas populaires via AniList) */}
        <section className="section-derniers-scans">
          <div className="derniers-scans">
            <img className="h2-icons" src="/icons/directbox-receive.svg" alt="Icône scans"/>
            <h2 className="h2-scans">DERNIERS SCANS AJOUTÉS</h2>
          </div>
          <div className="carousel-anime" id="carousel-scans"></div>
        </section>

        {/* Carousel 5: Les classiques (animes les mieux notés via AniList) */}
        <section className="section-classiques">
          <div className="les-classiques">
            <img className="h2-icons" src="/icons/verify.svg" alt="Icône classiques"/>
            <h2 className="h2-classiques">LES CLASSIQUES</h2>
          </div>
          <div className="carousel-anime" id="carousel-classiques"></div>
        </section>

        {/* Wrapper pour pages détail (SPA - Single Page Application) */}
        <div id="detail-page" className="spa-detail-wrapper"></div>
      </main>

      {/* ===== PIED DE PAGE ===== */}
      <footer className="shiori-footer">
        <div className="footer-content">
          <strong>&copy; <span id="date-copyright">2025</span> Shiori-Sama</strong><br/>
          Tous droits réservés
        </div>
      </footer>

      {/* Composant client qui gère toute la logique (JS d'origine convertis) */}
      <ShioriClient />
    </>
  );
}
