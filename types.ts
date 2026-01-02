export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';

export interface Chapter {
  id: string;
  title: Record<Language, string>;
  content: Record<Language, string>;
  readTime: number; // in minutes
}

export interface Story {
  id: string;
  title: Record<Language, string>;
  author: Record<Language, string>;
  description: Record<Language, string>;
  coverImage: string;
  tags: string[];
  chapters: Chapter[];
  publishDate: string;
  rating: number;      // 0 to 5
  reviewCount: number; // Total number of reviews
}

export interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}