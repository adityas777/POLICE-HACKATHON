
export enum OCRMode {
  BASE = 'base',
  LAYOUT = 'layout',
  HANDWRITTEN = 'handwritten',
  TRANSLATION = 'translation',
  ENTITY = 'entity',
  MASTER = 'master'
}

export type VaultStatus = 'not-visited' | 'in-progress' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only for local mock auth
}

export interface OCRResultData {
  clean_source_text?: string;
  source_text?: string;
  translated_text?: string;
  entities?: {
    persons: string[];
    locations: string[];
    dates: string[];
    organizations?: string[];
    identifiers?: string[];
  };
  title?: string;
  sections?: Array<{
    heading: string;
    content: string;
  }>;
  raw_text?: string;
}

export interface VaultItem {
  id: string;
  userId: string;
  timestamp: number;
  title: string;
  image: {
    base64: string;
    mime: string;
  };
  result: OCRResultData;
  sourceLang: string;
  targetLang: string;
  status: VaultStatus;
}

export interface ModeConfig {
  id: OCRMode;
  label: string;
  description: string;
  icon: string;
}

export interface Language {
  code: string;
  name: string;
  native: string;
}
