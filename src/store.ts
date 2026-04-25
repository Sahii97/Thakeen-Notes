import { create } from 'zustand';

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  isSystem?: boolean;
}

export interface AppSettings {
  darkMode: boolean;
  fontFamily: 'ThmanyahSans' | 'ThmanyahSerifText' | 'ThmanyahSerifDisplay';
  fontWeight: number;
  layout: 'blank' | 'lined' | 'dotted';
  baseFontSize: number;
  lineHeight: number;
  calendarType: 'gregorian' | 'hijri';
  openType: {
    saltTitle: boolean;
    saltBody: boolean;
    ss01: boolean;
    ss02: boolean;
    ss03: boolean;
    ss04: boolean;
    ss05: boolean;
  };
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  fontFamily: 'ThmanyahSerifText',
  fontWeight: 400,
  layout: 'blank',
  baseFontSize: 24,
  lineHeight: 1.8,
  calendarType: 'gregorian',
  openType: {
    saltTitle: false,
    saltBody: false,
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
  content: '<p><strong>ذكين</strong> هو تطبيق لتدوين الملاحظات، مستوحى من جماليات التحرير العربي.</p><p></p><p>ملاحظاتك تُحفظ محلياً في متصفحك الحالي، لضمان بقاء أفكارك خاصة وآمنة.</p><p></p><p>يمكنك تخصيص الخطوط والمسافات من القائمة الجانبية لتجربة قراءة وكتابة مريحة.</p>',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
}

export interface AppStoreState {
  notes: Note[];
  folders: Folder[];
  activeNoteId: string;
  activeFolderId: string | null;
  settings: AppSettings;
  addNote: (templateId?: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  moveNote: (noteId: string, folderId: string) => void;
  setActiveNoteId: (id: string) => void;
  setActiveFolderId: (id: string | null) => void;
  addFolder: (name: string, color?: string) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppStoreState>((set, get) => {
  const savedNotes = localStorage.getItem('thakeen_notes');
  let initialNotes = [DEFAULT_NOTE];
  if (savedNotes) {
    try {
      let parsed = JSON.parse(savedNotes);
      if (parsed.length > 0) {
        parsed = parsed.map((n: any) => ({
          ...n,
          createdAt: n.createdAt || n.updatedAt || Date.now()
        }));
        initialNotes = parsed;
      }
    } catch (e) {
      console.error('Failed to parse notes', e);
    }
  }

  const savedSettings = localStorage.getItem('thakeen_settings');
  let initialSettings = DEFAULT_SETTINGS;
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      initialSettings = { 
        ...DEFAULT_SETTINGS, 
        ...parsed,
        openType: {
          ...DEFAULT_SETTINGS.openType,
          ...(parsed.openType || {})
        }
      };
    } catch (e) {
      console.error('Failed to parse settings', e);
    }
  }

  let initialFolders: Folder[] = [
    { id: 'general', name: 'دفتر عام', color: '#6366f1', isSystem: true },
    { id: 'tasks', name: 'المهام', color: '#10b981', isSystem: true }
  ];

  const savedFolders = localStorage.getItem('thakeen_folders');
  if (savedFolders) {
    try {
      const parsed = JSON.parse(savedFolders);
      if (parsed.length > 0) initialFolders = parsed;
    } catch (e) {
      console.error('Failed to parse folders', e);
    }
  }

  if (initialSettings.darkMode) {
    document.documentElement.classList.add('dark');
  }

  return {
    notes: initialNotes,
    folders: initialFolders,
    activeNoteId: initialNotes[0]?.id || '',
    activeFolderId: 'general',
    settings: initialSettings,

    addNote: (templateId) => set((state) => {
      let title = '';
      let content = '<p></p>';

      if (templateId === 'brainstorming') {
        title = 'العصف الذهني';
        content = '<h2>الفكرة الرئيسية!</h2><p></p><h3>نقاط رئيسية:</h3><ul><li><p></p></li></ul><h3>الخطوات القادمة:</h3><ul data-type="taskList"><li data-type="taskItem" data-checked="false"><div class="content"><p></p></div></li></ul>';
      } else if (templateId === 'work') {
        title = 'ملاحظات العمل';
        content = '<h2>ملخص الاجتماع</h2><p></p><h3>القرارات:</h3><ul><li><p></p></li></ul><h3>المهام المسندة:</h3><ul data-type="taskList"><li data-type="taskItem" data-checked="false"><div class="content"><p></p></div></li></ul>';
      } else if (templateId === 'journal') {
        title = 'المذكرات اليومية';
        content = '<h2>مذكرات اليوم</h2><p></p><h3>كيف كان يومي؟</h3><p></p><h3>ماذا تعلمت؟</h3><p></p><h3>ما أنا ممتن له:</h3><ul><li><p></p></li></ul>';
      }

      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        folderId: state.activeFolderId || 'general',
        createdAt: Date.now(),
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
          folderId: 'general',
          createdAt: Date.now(),
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

    moveNote: (noteId, folderId) => set((state) => {
      const newNotes = state.notes.map(n => n.id === noteId ? { ...n, folderId } : n);
      localStorage.setItem('thakeen_notes', JSON.stringify(newNotes));
      return { notes: newNotes };
    }),

    setActiveNoteId: (id) => set({ activeNoteId: id }),
    setActiveFolderId: (id) => set({ activeFolderId: id }),

    addFolder: (name, color = '#6366f1') => set((state) => {
      const newFolder: Folder = { id: Date.now().toString(), name, color };
      const newFolders = [...state.folders, newFolder];
      localStorage.setItem('thakeen_folders', JSON.stringify(newFolders));
      return { folders: newFolders, activeFolderId: newFolder.id };
    }),

    updateFolder: (id, updates) => set((state) => {
      const newFolders = state.folders.map(f => f.id === id ? { ...f, ...updates } : f);
      localStorage.setItem('thakeen_folders', JSON.stringify(newFolders));
      return { folders: newFolders };
    }),

    deleteFolder: (id) => set((state) => {
      const filteredFolders = state.folders.filter(f => f.id !== id);
      // Move notes from deleted folder to 'general'
      const newNotes = state.notes.map(n => n.folderId === id ? { ...n, folderId: 'general' } : n);
      
      localStorage.setItem('thakeen_folders', JSON.stringify(filteredFolders));
      localStorage.setItem('thakeen_notes', JSON.stringify(newNotes));
      
      return { 
        folders: filteredFolders, 
        notes: newNotes,
        activeFolderId: state.activeFolderId === id ? 'general' : state.activeFolderId 
      };
    }),

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
