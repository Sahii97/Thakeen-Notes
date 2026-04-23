import { Editor } from '@tiptap/react';
import { 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Bold, 
  Italic, 
  Underline as UnderlineIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppStore } from '../store';

export function FormattingToolbar({ editor }: { editor: Editor }) {
  const { settings } = useAppStore();
  
  if (!editor) {
    return null;
  }

  const defaultTextColor = settings.darkMode ? '#ffffff' : '#000000';
  const colors = [
    { value: defaultTextColor, label: 'Default' },
    { value: '#2563eb', label: 'Blue' }, // Blue
    { value: '#dc2626', label: 'Red' }, // Red
    { value: '#16a34a', label: 'Green' }, // Green
  ];

  const tools = [
    {
      icon: <Heading1 size={18} />,
      label: 'H1',
      isActive: editor.isActive('heading', { level: 1 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: <Heading2 size={18} />,
      label: 'H2',
      isActive: editor.isActive('heading', { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: <List size={18} />,
      label: 'Bullet',
      isActive: editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: <ListOrdered size={18} />,
      label: 'Ordered',
      isActive: editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: <Quote size={18} />,
      label: 'Quote',
      isActive: editor.isActive('blockquote'),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    { divider: true },
    {
      icon: <Bold size={18} />,
      label: 'Bold',
      isActive: editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: <Italic size={18} />,
      label: 'Italic',
      isActive: editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: <UnderlineIcon size={18} />,
      label: 'Underline',
      isActive: editor.isActive('underline'),
      onClick: () => editor.chain().focus().toggleUnderline().run(),
    },
  ];

  return (
    <>
      {tools.map((tool, idx) => {
        if (tool.divider) {
          return <div key={`div-${idx}`} className="w-[1px] h-6 bg-[var(--border-color)] mx-1" />;
        }
        
        return (
          <button
            key={tool.label}
            onClick={tool.onClick}
            className={cn(
              "p-2 rounded-xl transition-colors",
              tool.isActive 
                ? "bg-[var(--text-primary)] text-[var(--bg-paper)] font-bold" 
                : "text-[var(--text-primary)] hover:bg-[var(--bg-paper)] hover:text-black dark:hover:text-white"
            )}
            title={tool.label}
          >
            {tool.icon}
          </button>
        );
      })}

      <div className="w-[1px] h-6 bg-[var(--border-color)] mx-1" />

      {/* Colors */}
      <div className="flex gap-2 px-2">
        {colors.map((color) => {
          const isColorActive = editor.isActive('textStyle', { color: color.value }) || 
                                (editor.isActive('textStyle') === false && color.label === 'Default');
          return (
             <button
                key={color.label}
                onClick={() => {
                  if (color.label === 'Default') {
                    editor.chain().focus().unsetColor().run();
                  } else {
                    editor.chain().focus().setColor(color.value).run();
                  }
                }}
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-transform",
                  isColorActive ? "scale-125 border-[var(--bg-paper)] outline outline-1 outline-[var(--text-primary)]" : "border-transparent hover:scale-110",
                  // Ensure explicit borders for the default color dots so they are visible
                  color.label === 'Default' ? "border-[var(--border-color)]" : ""
                )}
                style={{ backgroundColor: color.value }}
                title={color.label}
              />
          );
        })}
      </div>
    </>
  );
}
