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
  return `![${alt}](${image.url})`;
};

const escapeAttribute = (value: string) => value.replace(/"/g, "&quot;");

const formatCompactImage = (image: CountryClueImage) => {
  const alt = escapeAttribute(image.alt || "Plonkit clue image");
  return `<img src="${image.url}" width="120" alt="${alt}" />`;
};

const normalizeMarkdownText = (text: string) =>
  text
    .replace(/\]\(\/images\//g, "](https://www.plonkit.net/images/")
    .replace(/\]\(\/(guide|maps|tools)\b/g, "](https://www.plonkit.net/$1")
    .replace(/\*\*([^*]+?) \*\*/g, "**$1**")
    .replace(/\*{4,}/g, "**")
    .replace(/([^\s*])\*\* ([^*])/g, "$1 **$2")
    .replace(/([a-z])\*\*([a-z])/gi, "$1 **$2")
    .trim();

const formatTipText = (text: string[]) =>
  text.map(normalizeMarkdownText).filter(Boolean).join("\n\n");

const isNoteLine = (line: string) => /^NOTE:/i.test(line.trim());

const isCrossCountryNote = (note: string) => {
  const lower = note.toLowerCase();

  if (/other countries|other european countries|other asian countries|other african countries/.test(lower)) {
    return true;
  }

  if (/also (?:be )?(?:found|seen|common|exist)|can also be found|also used in|also exist in/.test(lower)) {
    if (/other provinces|within the country|in this country|the town of|the only other place in the country/.test(lower)) {
      return false;
    }

    return true;
  }

  if (/similar to .* in (?:the )?(?:us|uk|europe|africa|asia|south america)/.test(lower)) {
    return true;
  }

  return false;
};

const shortenCrossCountryNote = (note: string) => {
  const patterns = [
    /within [^,]+, (?:this|these|it)[^.]*/i,
    /can also be found in[^.]*/i,
    /also (?:be )?(?:found|seen|common|exist)[^.]*/i,
    /other (?:\w+ )?countries[^.]*/i,
  ];

  for (const pattern of patterns) {
    const match = note.match(pattern);
    if (match) {
      return normalizeMarkdownText(match[0]);
    }
  }

  const firstSentence = note.split(/(?<=[.!?])\s+/)[0] ?? note;
  return normalizeMarkdownText(firstSentence.length > 140 ? `${firstSentence.slice(0, 137)}...` : firstSentence);
};

const getCrossCountryNote = (text: string[]) => {
  const notes = text
    .filter(isNoteLine)
    .map((line) => line.replace(/^NOTE:\s*/i, "").trim())
    .filter(isCrossCountryNote);

  if (!notes.length) {
    return undefined;
  }

  return shortenCrossCountryNote(notes.join(" "));
};

const formatCompactTip = (tip: CountryClueTip, includeCrossCountryNote = false) => {
  const image = tip.images[0] ? `${formatCompactImage(tip.images[0])}\n\n` : "";
  const mainText = formatTipText(tip.text.filter((line) => !isNoteLine(line)));
  const crossCountryNote = includeCrossCountryNote ? getCrossCountryNote(tip.text) : undefined;
  const text = crossCountryNote ? `${mainText}\n\n_${crossCountryNote}_` : mainText;

  return `${image}${text}`;
};

const formatCompactTips = (tips: CountryClueTip[], includeCrossCountryNote = false) => {
  return tips.map((tip) => formatCompactTip(tip, includeCrossCountryNote)).join("\n\n---\n\n");
};

const formatTip = (tip: CountryClueTip, headingLevel = 3) => {
  const images = tip.images.map(formatImage).join("\n\n");
  const text = formatTipText(tip.text);
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

${formatCompactTips(section.tips, true)}`,
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
