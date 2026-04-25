import { X } from 'lucide-react';
import { useAppStore } from '../store';

export function LeftSidebar({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-[var(--bg-sidebar)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-sidebar)]">
        <h2 className="text-base text-[var(--text-secondary)] font-bold">خصائص النص والإعدادات</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-[#cec9be] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto flex-1 scrollbar-hide">
        {/* Typography */}
        <section>
          <label className="text-base block mb-3 text-[var(--text-secondary)]">الخط</label>
          <select 
            className="w-full bg-[var(--bg-paper)] border border-[var(--border-color)] rounded-xl p-3 text-base outline-none cursor-pointer"
            value={settings.fontFamily}
            onChange={(e) => updateSettings({ fontFamily: e.target.value as any })}
          >
            <option value="ThmanyahSans">ثمانية نَصِيّ (Sans)</option>
            <option value="ThmanyahSerifText">ثمانية مقروء (Serif Text)</option>
            <option value="ThmanyahSerifDisplay">ثمانية عناوين (Serif Display)</option>
          </select>
          
          <div className="flex justify-between items-center mt-4">
            <label className="text-base text-[var(--text-secondary)]">وزن الخط</label>
            <select
              className="bg-[var(--bg-paper)] border border-[var(--border-color)] rounded-xl py-2 px-3 text-base outline-none cursor-pointer"
              value={settings.fontWeight}
              onChange={(e) => updateSettings({ fontWeight: Number(e.target.value) })}
            >
              {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(weight => (
                <option key={weight} value={weight}>{weight}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Layout & Font Size */}
        <section>
          <label className="text-base block mb-3 text-[var(--text-secondary)]">المظهر</label>
          
          <div className="flex justify-between items-center mb-4">
            <label className="text-base text-[var(--text-secondary)]">نمط الصفحة</label>
            <select
              className="bg-[var(--bg-paper)] border border-[var(--border-color)] rounded-xl py-2 px-3 text-base outline-none cursor-pointer"
              value={settings.layout}
              onChange={(e) => updateSettings({ layout: e.target.value as any })}
            >
              <option value="blank">بيضاء</option>
              <option value="lined">مسطرة</option>
              <option value="dotted">منقطة</option>
            </select>
          </div>

          <div className="flex justify-between items-center mb-4">
            <label className="text-base text-[var(--text-secondary)]">حجم الخط الأساسي</label>
            <select
              className="bg-[var(--bg-paper)] border border-[var(--border-color)] rounded-xl py-2 px-3 text-base outline-none cursor-pointer"
              value={settings.baseFontSize}
              onChange={(e) => updateSettings({ baseFontSize: Number(e.target.value) })}
            >
              <option value="16">صغير جداً (16)</option>
              <option value="20">صغير (20)</option>
              <option value="24">متوسط (24)</option>
              <option value="28">كبير (28)</option>
              <option value="32">كبير جداً (32)</option>
              <option value="36">عملاق (36)</option>
            </select>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <label className="text-base text-[var(--text-secondary)]">التقويم</label>
            <select
              className="bg-[var(--bg-paper)] border border-[var(--border-color)] rounded-xl py-2 px-3 text-base outline-none cursor-pointer"
              value={settings.calendarType}
              onChange={(e) => updateSettings({ calendarType: e.target.value as any })}
            >
              <option value="gregorian">ميلادي</option>
              <option value="hijri">هجري</option>
            </select>
          </div>
        </section>

        {/* OpenType Features */}
        <section>
          <label className="text-base block mb-3 text-[var(--text-secondary)]">خصائص OpenType</label>
          <div className="space-y-3">
            <div 
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-paper)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--text-primary)] transition-colors"
              onClick={() => updateSettings({ openType: { ...settings.openType, saltTitle: !settings.openType.saltTitle } })}
            >
              <span className="text-sm uppercase font-bold tracking-wider">Salt (العنوان)</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.openType.saltTitle ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-color)]'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white dark:bg-black rounded-full transition-all ${settings.openType.saltTitle ? 'right-1.5' : 'left-1.5'}`}></div>
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-paper)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--text-primary)] transition-colors"
              onClick={() => updateSettings({ openType: { ...settings.openType, saltBody: !settings.openType.saltBody } })}
            >
              <span className="text-sm uppercase font-bold tracking-wider">Salt (المحتوى)</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.openType.saltBody ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-color)]'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white dark:bg-black rounded-full transition-all ${settings.openType.saltBody ? 'right-1.5' : 'left-1.5'}`}></div>
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-paper)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--text-primary)] transition-colors"
              onClick={() => updateSettings({ openType: { ...settings.openType, ss01: !settings.openType.ss01 } })}  
            >
              <span className="text-sm uppercase font-bold tracking-wider">Kashida (ss01)</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.openType.ss01 ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-color)]'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white dark:bg-black rounded-full transition-all ${settings.openType.ss01 ? 'right-1.5' : 'left-1.5'}`}></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
