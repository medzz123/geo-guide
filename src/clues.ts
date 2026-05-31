import { countryClues } from "./country-clues";

export type CountryClue = {
  name: string;
  description: string;
  categories: string[];
};

export const getCountryClues = (): CountryClue[] => countryClues;

export const getRandomCountryClue = (clues: CountryClue[]) =>
  clues[Math.floor(Math.random() * clues.length)];

export const getDescriptionPreview = (description: string, maxLength = 110) => {
  const normalized = description.replace(/\s+/g, " ");

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trim()}...`;
};

export const getClueMarkdown = (clue: CountryClue) => `# ${clue.name}

${clue.description}`;
