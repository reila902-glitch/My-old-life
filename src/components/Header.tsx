import React from 'react';
import { Coffee, Sparkles, BookOpen, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/presets';
import { SeniorConsultationInput } from '../types';

interface HeaderProps {
  onSelectPreset: (preset: SeniorConsultationInput) => void;
  onReset: () => void;
  hasResult: boolean;
  largeText: boolean;
  setLargeText: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onReset,
  hasResult,
  largeText,
  setLargeText,
}) => {
  return (
    <header className="border-b border-stone-200/90 bg-[#fbf8f3] sticky top-0 z-40 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shadow-xs border border-amber-200/60">
            <Coffee className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-batang">
                인생선배의 사랑방
              </h1>
              <span className="text-[11px] text-amber-800 font-medium px-2 py-0.5 bg-amber-50 rounded border border-amber-200/60">
                100세 은퇴·노년 설계
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              따뜻한 차 한 잔 나누며 짚어보는 든든한 5년 주기 생활자금과 삶의 지혜
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Presets Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium bg-amber-50/80 text-amber-900 border border-amber-200/80 rounded-md hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>추천 사례 불러오기</span>
            </button>
            <div className="absolute right-0 mt-1 w-64 bg-white border border-stone-200 rounded-lg shadow-lg py-1.5 hidden group-hover:block hover:block z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 border-b border-stone-100 mb-1">
                상황별 실제 사례
              </div>
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPreset(preset.data)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50/70 transition-colors block text-stone-700"
                >
                  <p className="font-medium text-stone-900">{preset.title}</p>
                  <p className="text-[11px] text-stone-500 truncate">{preset.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Senior Text Size Toggle */}
          <button
            type="button"
            onClick={() => setLargeText(!largeText)}
            title={largeText ? '보통 글씨로 보기' : '큰 글씨로 편하게 보기'}
            className="px-2.5 py-1.5 text-xs font-medium bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1"
          >
            {largeText ? (
              <>
                <ZoomOut className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">보통 글씨</span>
              </>
            ) : (
              <>
                <ZoomIn className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">큰 글씨</span>
              </>
            )}
          </button>

          {/* Reset / New consultation */}
          {hasResult && (
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-1.5 text-xs font-medium bg-stone-800 text-white rounded-md hover:bg-stone-700 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>새로 상담하기</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
