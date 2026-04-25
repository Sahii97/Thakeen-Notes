import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import { FormattingToolbar, FloatingSlashMenu } from './FormattingToolbar';
import { useAppStore } from '../store';
import { useEffect, useState, useRef } from 'react';
import { PanelRight, Lock, Unlock, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';
import TextareaAutosize from 'react-textarea-autosize';

interface EditorCanvasProps {
  rightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
  toggleLeftSidebar: () => void;
}

export function EditorCanvas({ rightSidebarOpen, toggleRightSidebar, toggleLeftSidebar }: EditorCanvasProps) {
  const { notes, activeNoteId, updateNote, settings } = useAppStore();
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];
  const [readOnly, setReadOnly] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate automatic line height
  const autoLineHeight = Math.max(1.2, 1.5 - ((settings.baseFontSize - 16) / 8) * 0.3);

  const fontFeaturesTitle = [
    settings.openType.saltTitle && '"salt" 1',
    settings.openType.ss01 && '"ss01" 1',
    settings.openType.ss02 && '"ss02" 1',
    settings.openType.ss03 && '"ss03" 1',
    settings.openType.ss04 && '"ss04" 1',
    settings.openType.ss05 && '"ss05" 1',
  ].filter(Boolean).join(', ');

  const fontFeaturesBody = [
    settings.openType.saltBody && '"salt" 1',
    settings.openType.ss01 && '"ss01" 1',
    settings.openType.ss02 && '"ss02" 1',
    settings.openType.ss03 && '"ss03" 1',
    settings.openType.ss04 && '"ss04" 1',
    settings.openType.ss05 && '"ss05" 1',
  ].filter(Boolean).join(', ');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Placeholder.configure({
        placeholder: 'اكتب أفكارك هنا...',
        emptyEditorClass: 'is-editor-empty',
      }),
      TextStyle,
      Color,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Strike,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
      }),
    ],
    content: activeNote?.content || '',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      updateNote(activeNote.id, { 
        content: editor.getHTML()
      });
    },
  });

  // Sync content when active note changes
  useEffect(() => {
    if (editor && activeNote) {
      if (editor.getHTML() !== activeNote.content) {
        editor.commands.setContent(activeNote.content);
      }
    }
  }, [activeNote?.id, editor]);

  // Sync read-only state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        useAppStore.getState().updateSettings({
          openType: {
            ...useAppStore.getState().settings.openType,
            saltBody: !useAppStore.getState().settings.openType.saltBody,
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!editor || !activeNote) {
    return null;
  }

  const lineSize = settings.baseFontSize * settings.lineHeight;

  return (
    <div 
      className="relative h-full flex flex-col transition-colors duration-300"
      ref={containerRef}
    >
      <style>{`
        .ProseMirror {
          font-feature-settings: ${fontFeaturesBody || 'normal'} !important;
        }
      `}</style>
      
      {/* Top Header Controls (Sticky) */}
      <header className="h-16 border-b border-[var(--border-color)] px-4 md:px-8 flex items-center justify-between w-full absolute top-0 left-0 bg-[var(--bg-paper)] z-10 shrink-0 gap-4">
        
        {/* Right side controls (Menu + Title) */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 h-full">
          <button 
            onClick={toggleRightSidebar}
            className="p-2 hover:bg-[#dcd8ce] dark:hover:bg-[#2a2a2a] rounded-lg text-inherit transition-colors shrink-0 mt-1"
          >
            <PanelRight size={20} className={rightSidebarOpen ? 'opacity-50' : 'opacity-100'} />
          </button>
          
          <TextareaAutosize 
            className="bg-transparent border-none text-xl md:text-2xl font-bold focus:ring-0 w-full min-w-0 outline-none text-[var(--text-primary)] px-2 placeholder:text-[var(--text-secondary)] placeholder:opacity-50 resize-none py-4"
            value={activeNote.title}
            onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
            readOnly={readOnly}
            placeholder="عنوان الملاحظة"
            minRows={1}
            maxRows={2}
            style={{ 
              fontFamily: settings.fontFamily,
              fontFeatureSettings: fontFeaturesTitle || 'normal',
            }}
          />
        </div>

        {/* Left side controls */}
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <button 
            onClick={() => setReadOnly(!readOnly)}
            className="p-2 hover:bg-[#dcd8ce] dark:hover:bg-[#2a2a2a] rounded-lg text-[var(--text-secondary)] transition-colors"
            title={readOnly ? "تعديل" : "قراءة فقط"}
          >
            {readOnly ? <Lock size={20} /> : <Unlock size={20} />}
          </button>
          <button 
            onClick={toggleLeftSidebar}
            className="p-2 hover:bg-[#dcd8ce] dark:hover:bg-[#2a2a2a] rounded-lg text-[var(--text-secondary)] transition-colors"
          >
            <Settings2 size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden px-4 md:px-8 lg:px-12 pt-2 md:pt-4 pb-0 mt-16 w-full h-full relative" ref={containerRef}>
        <div 
          className={cn(
            "w-full h-full overflow-y-auto scrollbar-hide opacity-90",
            settings.layout === 'lined' ? "lined-paper" : "",
            settings.layout === 'dotted' ? "dotted-paper" : ""
          )}
          style={{
            backgroundSize: settings.layout === 'lined' ? `100% calc(${settings.baseFontSize}px * ${autoLineHeight})` : settings.layout === 'dotted' ? `calc(${settings.baseFontSize}px * ${autoLineHeight}) calc(${settings.baseFontSize}px * ${autoLineHeight})` : undefined,
            fontSize: `${settings.baseFontSize}px`,
            lineHeight: autoLineHeight,
            fontFeatureSettings: fontFeaturesBody || 'normal',
            fontFamily: settings.fontFamily,
            fontWeight: settings.fontWeight,
            paddingTop: `calc(${settings.baseFontSize * autoLineHeight}px * 1)`,
            backgroundAttachment: 'local'
          }}
        >
          {!readOnly && (
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex overflow-hidden items-center bg-[var(--bg-paper)] rounded-xl border border-[var(--border-color)] p-1 shadow-xl z-50">
              <FormattingToolbar editor={editor} />
            </BubbleMenu>
          )}
          {!readOnly && (
            <FloatingMenu editor={editor} tippyOptions={{ duration: 100, placement: 'right' }} className="flex items-center gap-1 z-50">
              <FloatingSlashMenu editor={editor} />
            </FloatingMenu>
          )}
          <EditorContent 
            editor={editor} 
            className="w-full h-full pb-32"
          />
        </div>
      </div>
    </div>
  );
}
