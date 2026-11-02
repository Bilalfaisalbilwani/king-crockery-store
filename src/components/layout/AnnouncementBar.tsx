import React from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  onNavigate: (page: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigate }) => {
  const { settings } = useStore();

  if (!settings?.announcementBar?.enabled) {
    return null;
  }

  return (
    <div className="bg-[#1C1917] text-[#FAF8F5] text-xs font-medium py-2 px-4 text-center tracking-wide relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#C8A261] shrink-0" />
        <span className="truncate">
          {settings.announcementBar.text}
        </span>
        <button
          onClick={() => onNavigate('shop')}
          className="underline hover:text-[#C8A261] transition-colors inline-flex items-center gap-1 shrink-0 ml-1 cursor-pointer font-semibold"
        >
          Shop Now <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
