import { countryClues } from "./country-clues";

export type CountryClue = {
  name: string;
  slug: string;
  description: string;
  importantClues: CountryClueTip[];
  categories: string[];
  keyClues: CountryClueSection[];
  sections: CountryClueSection[];
  sourceUrl: string;
};

export type CountryClueImage = {
  url: string;
  link?: string;
  alt?: string;
};

export type CountryClueTip = {
  title: string;
  text: string[];
  images: CountryClueImage[];
};

export type CountryClueSection = {
  title: string;
  tips: CountryClueTip[];
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

const formatImage = (image: CountryClueImage) => {
  const alt = image.alt || "Plonkit clue image";

  if (image.link) {
    return `[![${alt}](${image.url})](${image.link})`;
  }

  return `![${alt}](${image.url})`;
};

const escapeAttribute = (value: string) => value.replace(/"/g, "&quot;");

const formatCompactImage = (image: CountryClueImage) => {
  const alt = escapeAttribute(image.alt || "Plonkit clue image");
  return `<img src="${image.url}" width="120" alt="${alt}" />`;
};

const formatCompactTips = (tips: CountryClueTip[]) => {
  return tips
    .map((tip) => {
      const image = tip.images[0] ? `${formatCompactImage(tip.images[0])} ` : "";
      const text = tip.text.join("<br><br>");

      return `- ${image}${text}`;
    })
    .join("\n\n");
};

const formatTip = (tip: CountryClueTip, headingLevel = 3) => {
  const images = tip.images.map(formatImage).join("\n\n");
  const text = tip.text.join("\n\n");
  const body = [text, images].filter(Boolean).join("\n\n");
  const heading = "#".repeat(headingLevel);

  return `${heading} ${tip.title}\n\n${body}`;
};

const getImportantCluesMarkdown = (clue: CountryClue) =>
  formatCompactTips(clue.importantClues);

const getSectionGroupMarkdown = (sections: CountryClueSection[]) =>
  sections
    .map((section) => {
      const tips = section.tips.map((tip) => formatTip(tip, 4)).join("\n\n");

      return `### ${section.title}\n\n${tips}`;
    })
    .join("\n\n");

const getCompactSectionGroupMarkdown = (sections: CountryClueSection[]) =>
  sections
    .map(
      (section) => `### ${section.title}

${formatCompactTips(section.tips)}`,
    )
    .join("\n\n");

export const getClueMarkdown = (clue: CountryClue) => `# ${clue.name}

## Most Important Clues

${getImportantCluesMarkdown(clue)}

## Road / Pole / Etc Clues

${getCompactSectionGroupMarkdown(clue.keyClues)}

## Bigger Summary

${getSectionGroupMarkdown(clue.sections)}

---

[Source: Plonk It](${clue.sourceUrl})`;
