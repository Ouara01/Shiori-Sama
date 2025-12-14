/**
 * Composant Carousel - Affiche un carrousel d'animes (Optional)
 * 
 * NOTE: Ce composant est OPTIONNEL et n'est actuellement PAS utilisé.
 * Les carousels sont gérés directement par shiori-client.tsx via DOM manipulation.
 * 
 * Utilise la scrollbar horizontale native pour naviguer entre les animes.
 */

'use client';

import React, { useRef } from 'react';
import { Anime } from '@/types';
import { AnimeCard } from './AnimeCard';

interface CarouselProps {
  title: string;
  animes: Anime[];
  onSelectAnime?: (anime: Anime) => void;
}

/**
 * Carousel réutilisable pour afficher une liste d'animes (Optional)
 * 
 * Affiche un carrousel scrollable horizontalement avec contrôles de navigation.
 * Chaque anime est affiché via le composant AnimeCard.
 * 
 * NOTE: Ce composant n'est pas actuellement utilisé dans l'application.
 * Les carousels actuels sont gérés par shiori-client.tsx qui manipule
 * directement le DOM pour une compatibilité maximale avec l'architecture originale.
 * 
 * Ce composant reste disponible pour une future refactorisation 100% React.
 */
export const Carousel: React.FC<CarouselProps> = ({
  title,
  animes,
  onSelectAnime,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll le carrousel vers la gauche
   */
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth',
      });
    }
  };

  /**
   * Scroll le carrousel vers la droite
   */
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth',
      });
    }
  };

  if (animes.length === 0) {
    return (
      <section className="section-carousel mt-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="text-gray-400 text-center py-8">
          Aucun anime à afficher
        </div>
      </section>
    );
  }

  return (
    <section className="section-carousel mt-8">
      {/* Titre */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      {/* Conteneur du carrousel */}
      <div className="relative group">
        {/* Bouton scroll gauche */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Carrousel */}
        <div
          ref={scrollContainerRef}
          className="carousel-anime"
        >
          {animes.map((anime) => (
            <AnimeCard
              key={anime.id}
              anime={{
                title: anime.title,
                image_url: anime.image,
                type: anime.type,
                language: "JP",
                seasonEpisode: `${anime.episodes} eps`
              }}
              onSelect={() => onSelectAnime?.(anime)}
            />
          ))}
        </div>

        {/* Bouton scroll droite */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Carousel;
