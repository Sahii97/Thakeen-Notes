import { Plus, Settings2, Moon, Sun, Trash2, X } from 'lucide-react';
import { useAppStore } from '../store';

export function RightSidebar({ onClose }: { onClose?: () => void }) {
  const { notes, activeNoteId, setActiveNoteId, addNote, deleteNote, settings, updateSettings } = useAppStore();

  const toggleDarkMode = () => updateSettings({ darkMode: !settings.darkMode });

  return (
    <div className="flex flex-col h-full bg-[var(--bg-sidebar)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="p-6 flex justify-between items-center bg-[var(--bg-sidebar)]">
        <h1 className="text-2xl font-bold font-serif tracking-tight">ذكين</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleDarkMode}
            className="p-2 hover:bg-[#cec9be] dark:hover:bg-[#2a2a2a] rounded-full transition-colors"
            aria-label="تبديل المظهر"
          >
            {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#cec9be] dark:hover:bg-[#2a2a2a] rounded-full transition-colors md:hidden"
              aria-label="إغلاق القائمة"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* New Note Action */}
      <div className="px-4 pb-4">
        <button
          onClick={addNote}
          className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-paper)] rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          <span className="font-medium">ملاحظة جديدة</span>
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide">
        {notes.map((note) => {
          const isActive = note.id === activeNoteId;
          const date = new Date(note.updatedAt);
          const dateString = date.toLocaleDateString('ar-SA', { 
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });

          return (
            <div 
              key={note.id}
              onClick={() => {
                setActiveNoteId(note.id);
                if (window.innerWidth < 768 && onClose) {
                  onClose();
                }
              }}
              className={`group relative p-4 rounded-2xl cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-[var(--bg-paper)] border border-[var(--border-color)]' 
                  : 'hover:bg-[#cec9be] dark:hover:bg-[#2a2a2a] border border-transparent'
              }`}
            >
              <div className="pr-1">
                <h3 
                  className={`font-medium mb-1 text-sm truncate ${isActive ? 'font-bold' : ''}`}
                  style={{ fontFamily: settings.titleFontFamily }}
                >
                  {note.title.trim() === '' ? 'ملاحظة بدون عنوان' : note.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">{dateString}</p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 text-red-500 rounded-full hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 ${notes.length === 1 ? 'hidden' : ''}`}
                aria-label="حذف الملاحظة"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
