/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SeniorConsultationInput } from './types';
import { SAMPLE_PRESETS } from './utils/presets';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ReportView } from './components/ReportView';
import { Coffee, Heart, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [inputData, setInputData] = useState<SeniorConsultationInput>(SAMPLE_PRESETS[0].data);
  const [adviceMarkdown, setAdviceMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [largeText, setLargeText] = useState<boolean>(false);

  const handleSelectPreset = (preset: SeniorConsultationInput) => {
    setInputData(preset);
    setAdviceMarkdown(null);
    setErrorMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAdviceMarkdown(null);
    setErrorMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/senior-consult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '선배의 조언을 불러오지 못했습니다.');
      }

      setAdviceMarkdown(data.advice);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Consultation request failed:', err);
      setErrorMsg(
        err.message || '상담을 진행하는 도중 연결이 원활하지 않았습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#fcfaf7] text-stone-800 ${largeText ? 'text-lg' : 'text-base'}`}>
      {/* Header */}
      <Header
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        hasResult={!!adviceMarkdown}
        largeText={largeText}
        setLargeText={setLargeText}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between gap-3">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs font-semibold text-red-700 underline"
            >
              닫기
            </button>
          </div>
        )}

        {adviceMarkdown ? (
          <ReportView
            inputData={inputData}
            adviceMarkdown={adviceMarkdown}
            onEditInputs={() => {
              setAdviceMarkdown(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            largeText={largeText}
          />
        ) : (
          <InputForm
            inputData={inputData}
            onChange={setInputData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            largeText={largeText}
          />
        )}
      </main>

      {/* Warm Footer */}
      <footer className="border-t border-stone-200 bg-[#f7f3ec] py-8 text-stone-600 text-xs sm:text-sm no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-4 h-4 text-amber-800" />
            <span className="font-batang font-semibold text-stone-900">
              인생선배의 따뜻한 은퇴·노년 설계 사랑방
            </span>
          </div>
          <p className="text-stone-500 text-center sm:text-right">
            100세 인생 설계 나침반 · 몸과 마음이 편안한 노후를 진심으로 응원합니다
          </p>
        </div>
      </footer>
    </div>
  );
}
