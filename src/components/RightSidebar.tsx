import { Plus, Settings2, Moon, Sun, Archive, X, Folder as FolderIcon, PlusCircle, PenSquare } from 'lucide-react';
import { useAppStore } from '../store';
import { useState } from 'react';

export function RightSidebar({ onClose }: { onClose?: () => void }) {
  const { notes, folders, activeFolderId, setActiveFolderId, activeNoteId, setActiveNoteId, addNote, deleteNote, settings, updateSettings, addFolder, deleteFolder } = useAppStore();
  
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#6366f1');
  
  const toggleDarkMode = () => updateSettings({ darkMode: !settings.darkMode });

  // Filter notes by active folder
  const currentNotes = notes.filter(n => (n.folderId || 'general') === activeFolderId);

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

  return (
    <div className="flex flex-col h-full bg-[var(--bg-sidebar)] text-[var(--text-primary)] relative z-10">
      {/* Header */}
      <div className="p-6 flex justify-between items-center bg-[var(--bg-sidebar)]">
        <h1 
          className="text-3xl font-bold"
          style={{ 
            fontFamily: settings.fontFamily, 
            fontFeatureSettings: [
              settings.openType.saltTitle && '"salt" 1',
              settings.openType.ss01 && '"ss01" 1',
              settings.openType.ss02 && '"ss02" 1',
              settings.openType.ss03 && '"ss03" 1',
              settings.openType.ss04 && '"ss04" 1',
              settings.openType.ss05 && '"ss05" 1',
            ].filter(Boolean).join(', ') || 'normal'
          }}
        >
          ملاحظات ذكين
        </h1>
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

      {/* Notebooks Section */}
      <div className="px-4 pb-4 border-b border-[var(--border-color)] mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-bold text-[var(--text-secondary)]">الدفاتر (Notebooks)</h2>
          <button 
            onClick={() => setIsAddingFolder(!isAddingFolder)}
            className="p-1 hover:bg-[#cec9be] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            title="إضافة دفتر جديد"
          >
            <PlusCircle size={18} />
          </button>
        </div>

        {isAddingFolder && (
          <div className="mb-3 p-3 bg-[var(--bg-paper)] rounded-xl border border-[var(--border-color)]">
            <input 
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="اسم الدفتر..."
              className="w-full bg-transparent border-b border-[var(--border-color)] px-2 py-1 mb-3 text-sm focus:outline-none focus:border-[var(--text-primary)]"
              autoFocus
            />
            <div className="flex gap-2 mb-3 px-1 justify-between">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setNewFolderColor(c)}
                  className={`w-5 h-5 rounded-full transition-transform ${newFolderColor === c ? 'scale-125 ring-2 ring-offset-1 ring-offset-[var(--bg-paper)] ring-' + c : 'hover:scale-110'}`}
                  style={{ backgroundColor: c, outlineColor: c }}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsAddingFolder(false)}
                className="px-3 py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                إلغاء
              </button>
              <button 
                onClick={() => {
                  if (newFolderName.trim()) {
                    addFolder(newFolderName.trim(), newFolderColor);
                    setNewFolderName('');
                    setIsAddingFolder(false);
                  }
                }}
                className="px-3 py-1 text-sm bg-[var(--text-primary)] text-[var(--bg-paper)] rounded-lg"
              >
                إنشاء
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {folders.map(f => (
            <div key={f.id} className="group relative">
              <button
                onClick={() => setActiveFolderId(f.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base transition-colors ${
                  activeFolderId === f.id 
                    ? 'bg-[var(--text-primary)] text-[var(--bg-paper)] font-medium shadow-sm' 
                    : 'hover:bg-[#cec9be] dark:hover:bg-[#2a2a2a] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full opacity-80" 
                  style={{ backgroundColor: f.color || '#6366f1' }}
                />
                <span className="text-lg">{f.name}</span>
              </button>
              
              {!f.isSystem && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('هل أنت متأكد من حذف هذا الدفتر؟ ستُنقل الملاحظات للدفتر العام.')) {
                      deleteFolder(f.id);
                    }
                  }}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-[var(--text-secondary)] rounded-md hover:bg-[var(--bg-paper)] hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 ${activeFolderId === f.id ? 'text-[var(--bg-paper)] hover:text-red-300 hover:bg-black/20' : ''}`}
                  title="حذف الدفتر"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* New Note Action */}
      <div className="px-4 pb-4">
        <button
          onClick={() => addNote()}
          className="w-full py-3.5 bg-[var(--text-primary)] text-[var(--bg-paper)] rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
        >
          <PenSquare size={20} />
          <span className="font-medium text-lg">تدوينة جديدة</span>
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide pb-4">
        {currentNotes.length === 0 ? (
          <div className="text-center text-[var(--text-secondary)] text-sm py-10 opacity-60">
            لا توجد تدوينات في هذا الدفتر
          </div>
        ) : (
          currentNotes.map((note) => {
          const isActive = note.id === activeNoteId;
          const date = new Date(note.updatedAt);
          
          let dateString = '';
          if (settings.calendarType === 'hijri') {
            try {
              dateString = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
                year: 'numeric', month: 'long', day: 'numeric'
              }).format(date);
            } catch (e) {
              dateString = date.toLocaleDateString('ar-SA', { 
                year: 'numeric', month: 'short', day: 'numeric'
              });
            }
          } else {
            dateString = date.toLocaleDateString('ar-SA', { 
              year: 'numeric', month: 'short', day: 'numeric'
            });
          }

          return (
            <div 
              key={note.id}
              onClick={() => {
                setActiveNoteId(note.id);
                if (window.innerWidth < 1024 && onClose) {
                  onClose();
                }
              }}
              className={`group relative p-4 rounded-2xl cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-[var(--bg-paper)] border border-[var(--border-color)] shadow-sm' 
                  : 'hover:bg-[#cec9be] dark:hover:bg-[#2a2a2a] border border-transparent'
              }`}
            >
              <div className="pr-1">
                <h3 
                  className={`font-medium mb-1.5 text-lg truncate ${isActive ? 'font-bold' : ''}`}
                  style={{ 
                    fontFamily: settings.fontFamily, 
                    fontFeatureSettings: [
                      settings.openType.saltTitle && '"salt" 1',
                      settings.openType.ss01 && '"ss01" 1',
                      settings.openType.ss02 && '"ss02" 1',
                      settings.openType.ss03 && '"ss03" 1',
                      settings.openType.ss04 && '"ss04" 1',
                      settings.openType.ss05 && '"ss05" 1',
                    ].filter(Boolean).join(', ') || 'normal'
                  }}
                >
                  {note.title.trim() === '' ? 'بدون عنوان' : note.title}
                </h3>
                <p className="text-base text-[var(--text-secondary)]">{dateString}</p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-secondary)] rounded-full hover:bg-[var(--text-primary)] hover:text-[var(--bg-paper)] transition-all opacity-0 group-hover:opacity-100 ${notes.length === 1 ? 'hidden' : ''}`}
                aria-label="حذف التدوينة"
              >
                <Archive size={18} />
              </button>
            </div>
          );
        }))}
      </div>
    </div>
  );
}
