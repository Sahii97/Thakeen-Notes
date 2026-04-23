import { create } from 'zustand';

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface AppSettings {
  darkMode: boolean;
  titleFontFamily: 'ThmanyahSans' | 'ThmanyahSerifText' | 'ThmanyahSerifDisplay';
  fontFamily: 'ThmanyahSans' | 'ThmanyahSerifText' | 'ThmanyahSerifDisplay';
  fontWeight: number;
  layout: 'blank' | 'lined';
  baseFontSize: number;
  lineHeight: number;
  openType: {
    salt: boolean;
    ss01: boolean;
    ss02: boolean;
    ss03: boolean;
    ss04: boolean;
    ss05: boolean;
  };
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  titleFontFamily: 'ThmanyahSerifDisplay',
  fontFamily: 'ThmanyahSerifText',
  fontWeight: 400,
  layout: 'blank',
  baseFontSize: 24,
  lineHeight: 1.8,
  openType: {
    salt: false,
    ss01: false,
    ss02: false,
    ss03: false,
    ss04: false,
    ss05: false,
  },
};

const DEFAULT_NOTE: Note = {
  id: 'welcome-note',
  title: 'مرحباً بك في ذكين',
  content: '<p><strong>ذكين</strong> هو تطبيق لتدوين الملاحظات، مستوحى من جماليات التحرير العربي.</p><p></p><p>يمكنك تخصيص الخطوط والمسافات من القائمة الجانبية لتجربة قراءة وكتابة مريحة.</p>',
  updatedAt: Date.now(),
};

export interface AppStoreState {
  notes: Note[];
  activeNoteId: string;
  settings: AppSettings;
  addNote: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNoteId: (id: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppStoreState>((set, get) => {
  const savedNotes = localStorage.getItem('thakeen_notes');
  let initialNotes = [DEFAULT_NOTE];
  if (savedNotes) {
    try {
      const parsed = JSON.parse(savedNotes);
      if (parsed.length > 0) initialNotes = parsed;
    } catch (e) {
      console.error('Failed to parse notes', e);
    }
  }

  const savedSettings = localStorage.getItem('thakeen_settings');
  let initialSettings = DEFAULT_SETTINGS;
  if (savedSettings) {
    try {
      initialSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
    } catch (e) {
      console.error('Failed to parse settings', e);
    }
  }

  if (initialSettings.darkMode) {
    document.documentElement.classList.add('dark');
  }

  return {
    notes: initialNotes,
    activeNoteId: initialNotes[0]?.id || '',
    settings: initialSettings,

    addNote: () => set((state) => {
      const newNote: Note = {
        id: Date.now().toString(),
        title: '',
        content: '<p></p>',
        updatedAt: Date.now(),
      };
      const newNotes = [newNote, ...state.notes];
      localStorage.setItem('thakeen_notes', JSON.stringify(newNotes));
      return { notes: newNotes, activeNoteId: newNote.id };
    }),

    updateNote: (id, updates) => set((state) => {
      const newNotes = state.notes.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
      );
      localStorage.setItem('thakeen_notes', JSON.stringify(newNotes));
      return { notes: newNotes };
    }),

    deleteNote: (id) => set((state) => {
      const filtered = state.notes.filter((n) => n.id !== id);
      if (filtered.length === 0) {
        const newNote = {
          id: Date.now().toString(),
          title: '',
          content: '<p></p>',
          updatedAt: Date.now(),
        };
        localStorage.setItem('thakeen_notes', JSON.stringify([newNote]));
        return { notes: [newNote], activeNoteId: newNote.id };
      }
      
      localStorage.setItem('thakeen_notes', JSON.stringify(filtered));
      if (state.activeNoteId === id) {
        return { notes: filtered, activeNoteId: filtered[0].id };
      }
      return { notes: filtered };
    }),

    setActiveNoteId: (id) => set({ activeNoteId: id }),

    updateSettings: (updates) => set((state) => {
      const newSettings = { ...state.settings, ...updates };
      localStorage.setItem('thakeen_settings', JSON.stringify(newSettings));
      
      if (newSettings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return { settings: newSettings };
    }),
  };
});
