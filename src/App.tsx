import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useAppStore } from './store';
import { EditorCanvas } from './components/EditorCanvas';
import { RightSidebar } from './components/RightSidebar';
import { LeftSidebar } from './components/LeftSidebar';
import { cn } from './lib/utils';

export default function App() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  
  const { settings } = useAppStore();

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const fontFeatures = [
    settings.openType.salt && '"salt" 1',
    settings.openType.ss01 && '"ss01" 1',
    settings.openType.ss02 && '"ss02" 1',
    settings.openType.ss03 && '"ss03" 1',
    settings.openType.ss04 && '"ss04" 1',
    settings.openType.ss05 && '"ss05" 1',
  ].filter(Boolean).join(', ');

  return (
    <>
      <div 
        className="flex h-screen overflow-hidden bg-[var(--bg-paper)] text-[var(--text-primary)]" 
        dir="rtl"
      >
        <aside 
          className={cn(
            "absolute md:relative h-full overflow-hidden transition-all duration-300 ease-in-out shrink-0 bg-[var(--bg-sidebar)] border-l border-[var(--border-color)] sidebar-shadow z-30 flex flex-col right-0 top-0",
            rightSidebarOpen ? "w-full md:w-72 opacity-100 translate-x-0" : "w-full md:w-0 opacity-0 border-none translate-x-full md:translate-x-0"
          )}
        >
           <div className="w-full md:w-72 h-full">
              <RightSidebar 
                onClose={() => setRightSidebarOpen(false)}
              />
           </div>
        </aside>

        <main 
          className="flex-1 h-full flex flex-col relative bg-[var(--bg-paper)] overflow-hidden"
          style={{
            fontFeatureSettings: fontFeatures || 'normal',
          }}
        >
          <EditorCanvas 
            rightSidebarOpen={rightSidebarOpen}
            toggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
            toggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
          />
        </main>

        <aside 
          className={cn(
            "absolute top-0 left-0 h-full w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl overflow-hidden sidebar-shadow",
            leftSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <LeftSidebar onClose={() => setLeftSidebarOpen(false)} />
        </aside>
        
        {leftSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 transition-opacity bg-black/5 dark:bg-black/20" 
            onClick={() => setLeftSidebarOpen(false)} 
          />
        )}
        {rightSidebarOpen && (
          <div 
            className="fixed inset-0 z-20 transition-opacity bg-black/5 dark:bg-black/20 md:hidden" 
            onClick={() => setRightSidebarOpen(false)} 
          />
        )}
      </div>
      <Analytics />
    </>
  );
}
