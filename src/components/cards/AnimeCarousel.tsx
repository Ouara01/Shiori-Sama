/**
 * Composant AnimeCarousel (Optional)
 * 
 * NOTE: Ce composant est OPTIONNEL et n'est actuellement PAS utilisé.
 * Les carousels sont actuellement gérés par shiori-client.tsx via DOM manipulation directe.
 * 
 * Affiche un carrousel horizontal d'animes avec leurs couvertures.
 * Utilise le scroll horizontal natif pour naviguer entre les cartes.
 * 
 * @see shiori-client.tsx - Code actuel qui gère les carousels
 */

import { Anime } from '@/types';
import Image from 'next/image';

interface AnimeCarouselProps {
  animes: Anime[];
  onAnimeClick?: (anime: Anime) => void;
}

export function AnimeCarousel({ animes, onAnimeClick }: AnimeCarouselProps) {
  if (!animes || animes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Aucun anime à afficher
      </div>
    );
  }

  return (
    <div className="carousel-anime flex gap-6 overflow-x-auto py-4 pb-2">
      {animes.map((anime) => (
        <div
          key={anime.id}
          className="shiori-card"
          onClick={() => onAnimeClick?.(anime)}
        >
          {anime.image && (
            <Image
              src={anime.image}
              alt={anime.title}
              width={175}
              height={250}
              className="w-full h-3/5 object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/icons/placeholder.svg';
              }}
            />
          )}
          <div className="card-title">{anime.title}</div>
          {anime.type && <div className="card-type">{anime.type}</div>}
          {anime.score && (
            <div className="card-language">⭐ {(anime.score / 10).toFixed(1)}</div>
          )}
        </div>
      ))}
    </div>
  );
}
