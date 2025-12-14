/**
 * AnimeCard Component - Carte anime réutilisable (Optional)
 * 
 * NOTE: Ce composant React est OPTIONNEL et n'est actuellement PAS utilisé.
 * Le shiori-client.tsx crée les cartes directement via DOM manipulation
 * pour maximiser la compatibilité avec l'architecture originale.
 * 
 * Ce composant reste ici comme option pour une future refactorisation vers
 * une approche 100% React avec hydratation côté client.
 * 
 * Classes CSS utilisées dans le DOM (synchronisées avec shiori-client.tsx):
 * - .shiori-card: Conteneur de la carte
 * - .card-title: Titre de l'anime
 * - .card-type: Type d'anime (TV, ANIME, MANGA, etc.)
 * - .card-language: Drapeau de langue
 * - .card-info: Informations supplémentaires (saison/épisode)
 * 
 * @see shiori-client.tsx - Fichier qui crée actuellement les cartes via DOM
 */

'use client';

import React from 'react';

interface AnimeCardProps {
  anime: {
    title: string;
    image_url: string;
    type: string;
    language: string;
    seasonEpisode?: string;
  };
  onSelect?: (anime: any) => void;
}

/**
 * Rendu optionnel d'une carte anime en composant React
 * 
 * Utile si vous voulez utiliser ce composant côté React dans le futur.
 * Actuellement, les cartes sont créées directement dans shiori-client.tsx
 * via créations d'éléments DOM (voir function createCard()).
 * 
 * @param {AnimeCardProps} props - Propriétés incluant les données d'anime
 * @returns {JSX.Element} - Div.shiori-card avec structure exacte du DOM original
 * 
 * @example
 * // Utilisation (non utilisée actuellement):
 * <AnimeCard 
 *   anime={{
 *     title: "Attack on Titan",
 *     image_url: "https://...",
 *     type: "TV",
 *     language: "JP"
 *   }}
 *   onSelect={(anime) => console.log(anime)}
 * />
 */
export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onSelect }) => {
  /**
   * Gère le clic sur la carte
   * Appelle le handler parent si fourni
   */
  const handleClick = () => {
    onSelect?.(anime);
  };

  /**
   * Convertit un code de langue en classe drapeau
   * Aligné avec getFlagClass() de shiori-client.tsx pour cohérence
   * 
   * @param {string} language - Code langue (ex: "JP", "EN", "JAPANESE")
   * @returns {string} - Classe drapeau pour flag-icons CSS
   */
  const getFlagClass = (language: string): string => {
    const map: Record<string, string> = {
      "JAPANESE": "fi fi-jp",
      "ENGLISH": "fi fi-us",
      "FRENCH": "fi fi-fr",
      "JP": "fi fi-jp",
      "EN": "fi fi-us",
      "FR": "fi fi-fr"
    };
    return map[language.toUpperCase()] || "fi fi-xx"; // Drapeau générique si inconnu
  };

  return (
    <div
      className="shiori-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {/* Image de couverture de l'anime */}
      <img 
        src={anime.image_url} 
        alt={anime.title} 
        loading="lazy"
      />
      
      {/* Titre de l'anime */}
      <div className="card-title">{anime.title}</div>
      
      {/* Type d'anime (TV, MOVIE, MANGA, etc.) */}
      <div className="card-type">{anime.type || "ANIME"}</div>
      
      {/* Drapeau de langue avec classe flag-icons */}
      <div className="card-language">
        <span className={getFlagClass(anime.language)}></span>
      </div>
      
      {/* Informations supplémentaires (saison/épisode) */}
      <div className="card-info">
        <span>{anime.seasonEpisode || "N/A"}</span>
      </div>
    </div>
  );
};

export default AnimeCard;
