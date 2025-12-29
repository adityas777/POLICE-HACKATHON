
import { OCRMode, ModeConfig, Language } from './types';

export const SUPPORTED_SOURCE_LANGS: Language[] = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'de', name: 'German', native: 'Deutsch' },
];

export const SUPPORTED_TARGET_LANGS: Language[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
];

export const MODES: ModeConfig[] = [
  {
    id: OCRMode.BASE,
    label: 'Standard OCR',
    description: 'Accurate text extraction from documents.',
    icon: '📝'
  },
  {
    id: OCRMode.HANDWRITTEN,
    label: 'Handwriting Analysis',
    description: 'Specialized for scripts and cursive notes.',
    icon: '🖋️'
  },
  {
    id: OCRMode.TRANSLATION,
    label: 'OCR + Translation',
    description: 'Instant translation of extracted text.',
    icon: '🌐'
  },
  {
    id: OCRMode.ENTITY,
    label: 'Intelligence Extraction',
    description: 'Detect names, dates, and identifiers.',
    icon: '🔍'
  },
  {
    id: OCRMode.MASTER,
    label: 'Master Analysis',
    description: 'Full processing, cleaning, and translation.',
    icon: '🧠'
  }
];

export const getPrompt = (mode: OCRMode, sourceLang: string, targetLang: string): string => {
  const baseInstructions = `You are a world-class OCR and Document Intelligence system. The source document language is ${sourceLang}.`;

  const prompts: Record<OCRMode, string> = {
    [OCRMode.BASE]: `${baseInstructions}
Extract all text from the image. 
- Ignore noise, artifacts, and stamps.
- Maintain paragraph structure.
- Output ONLY the extracted text in ${sourceLang}.`,

    [OCRMode.HANDWRITTEN]: `${baseInstructions}
Specialized Task: Recognize handwritten text in ${sourceLang} script.
- Handle cursive and overlapping text.
- If a word is unreadable, use [?].
- Output ONLY the recognized text.`,

    [OCRMode.TRANSLATION]: `${baseInstructions}
1. Extract text from the image in ${sourceLang}.
2. Translate the text into ${targetLang}.
Output JSON format:
{
  "source_text": "extracted text",
  "translated_text": "translation"
}`,

    [OCRMode.ENTITY]: `${baseInstructions}
Extract key entities from the ${sourceLang} text.
Output JSON format:
{
  "entities": {
    "persons": [],
    "locations": [],
    "dates": [],
    "organizations": [],
    "identifiers": []
  }
}`,

    [OCRMode.MASTER]: `You are a document reconstruction and text normalization system.
Input: A scanned document image in ${sourceLang}.

Strict Reconstruction Rules:
1. Remove all OCR noise characters (random symbols, control characters).
2. Restore correct ${sourceLang} and English words by normalizing broken Unicode.
3. Preserve original document meaning exactly.
4. Reconstruct content into clean, human-readable paragraphs.
5. Maintain logical structure: Headings, numbered sections, tables, and bullet points.
6. If text is unreadable, replace with [UNCLEAR].
7. Do NOT invent content. Do NOT change facts.
8. Translate the final reconstructed text to ${targetLang}.

Output MUST be valid JSON:
{
  "title": "Normalized document title",
  "clean_source_text": "Reconstructed ${sourceLang} text following all rules",
  "entities": { "persons": [], "locations": [], "dates": [], "organizations": [] },
  "translated_text": "Translation to ${targetLang}",
  "sections": [{"heading": "Normalized Heading", "content": "Reconstructed content"}]
}`,
    [OCRMode.LAYOUT]: ``
  };

  return prompts[mode];
};
