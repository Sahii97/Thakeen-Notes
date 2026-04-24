import { X } from 'lucide-react';
import { useAppStore } from '../store';

export function LeftSidebar({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-[var(--bg-sidebar)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-sidebar)]">
        <h2 className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-bold">خصائص النص</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#cec9be] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto flex-1 scrollbar-hide">
        {/* Typography */}
        <section>
          <label className="text-xs block mb-3 text-[var(--text-secondary)]">الخط</label>
          <select 
            className="w-full bg-[var(--bg-paper)] border border-[var(--border-color)] rounded-xl p-2.5 text-sm outline-none cursor-pointer"
            value={settings.fontFamily}
            onChange={(e) => updateSettings({ fontFamily: e.target.value as any })}
          >
            <option value="ThmanyahSans">ثمانية نَصِيّ (Sans)</option>
            <option value="ThmanyahSerifText">ثمانية مقروء (Serif Text)</option>
            <option value="ThmanyahSerifDisplay">ثمانية عناوين (Serif Display)</option>
          </select>
          
          <div className="flex justify-between items-center mb-3 mt-4">
            <label className="text-xs text-[var(--text-secondary)]">وزن الخط</label>
            <span className="text-[10px] font-mono">{settings.fontWeight}</span>
          </div>
          <input 
            type="range" 
            min="100" max="900" step="100"
            value={settings.fontWeight}
            onChange={(e) => updateSettings({ fontWeight: Number(e.target.value) })}
            className="w-full h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer custom-range"
          />
        </section>

        {/* Layout & Spacing */}
        <section>
          <label className="text-xs block mb-3 text-[var(--text-secondary)]">نمط الصفحة</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateSettings({ layout: 'lined' })}
              className={`py-2 text-xs rounded-lg transition-colors ${
                settings.layout === 'lined'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-paper)]'
                  : 'bg-[var(--bg-paper)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              مسطرة
            </button>
            <button
              onClick={() => updateSettings({ layout: 'blank' })}
              className={`py-2 text-xs rounded-lg transition-colors ${
                settings.layout === 'blank'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-paper)]'
                  : 'bg-[var(--bg-paper)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              بيضاء
            </button>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs text-[var(--text-secondary)]">حجم الخط</label>
            <span className="text-[10px] font-mono">{settings.baseFontSize}px</span>
          </div>
          <input 
            type="range" 
            min="16" max="64" step="1"
            value={settings.baseFontSize}
            onChange={(e) => updateSettings({ baseFontSize: Number(e.target.value) })}
            className="w-full h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer custom-range"
          />
        </section>

        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs text-[var(--text-secondary)]">تباعد الأسطر</label>
            <span className="text-[10px] font-mono">{settings.lineHeight.toFixed(1)}</span>
          </div>
          <input 
            type="range" 
            min="1.2" max="2.8" step="0.1"
            value={settings.lineHeight}
            onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })}
            className="w-full h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer custom-range"
          />
        </section>

        {/* OpenType Features */}
        <section>
          <label className="text-xs block mb-3 text-[var(--text-secondary)]">جماليات OpenType</label>
          <div className="space-y-2">
            <div 
              className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-paper)] border border-[var(--border-color)] cursor-pointer"
              onClick={() => updateSettings({ openType: { ...settings.openType, saltTitle: !settings.openType.saltTitle } })}
            >
              <span className="text-[10px] uppercase font-bold">Salt (العنوان)</span>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.openType.saltTitle ? 'bg-green-600' : 'bg-[var(--border-color)]'}`}>
                <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${settings.openType.saltTitle ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-paper)] border border-[var(--border-color)] cursor-pointer"
              onClick={() => updateSettings({ openType: { ...settings.openType, saltBody: !settings.openType.saltBody } })}
            >
              <span className="text-[10px] uppercase font-bold">Salt (المحتوى)</span>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.openType.saltBody ? 'bg-green-600' : 'bg-[var(--border-color)]'}`}>
                <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${settings.openType.saltBody ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-paper)] border border-[var(--border-color)] cursor-pointer"
              onClick={() => updateSettings({ openType: { ...settings.openType, ss01: !settings.openType.ss01 } })}  
            >
              <span className="text-[10px] uppercase font-bold">Kashida (ss01)</span>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.openType.ss01 ? 'bg-green-600' : 'bg-[var(--border-color)]'}`}>
                <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${settings.openType.ss01 ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
