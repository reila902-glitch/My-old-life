import React, { useState } from 'react';
import {
  SeniorConsultationInput,
  AssetsInput,
  HealthInput,
  PensionAssets,
} from '../types';
import { formatKoreanWon, calculateNetWorth } from '../utils/calculator';
import {
  Heart,
  Home,
  Coins,
  ShieldCheck,
  Landmark,
  TrendingUp,
  PackagePlus,
  Smile,
  Sparkles,
  Info,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface InputFormProps {
  inputData: SeniorConsultationInput;
  onChange: (data: SeniorConsultationInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
  largeText: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  inputData,
  onChange,
  onSubmit,
  isLoading,
  largeText,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'assets' | 'health'>('basic');

  const updateField = <K extends keyof SeniorConsultationInput>(
    key: K,
    val: SeniorConsultationInput[K]
  ) => {
    onChange({
      ...inputData,
      [key]: val,
    });
  };

  const updateAsset = <K extends keyof AssetsInput>(key: K, val: AssetsInput[K]) => {
    onChange({
      ...inputData,
      assets: {
        ...inputData.assets,
        [key]: val,
      },
    });
  };

  const updatePension = <K extends keyof PensionAssets>(key: K, val: number) => {
    onChange({
      ...inputData,
      assets: {
        ...inputData.assets,
        pensions: {
          ...inputData.assets.pensions,
          [key]: val,
        },
      },
    });
  };

  const updateHealth = <K extends keyof HealthInput>(key: K, val: HealthInput[K]) => {
    onChange({
      ...inputData,
      health: {
        ...inputData.health,
        [key]: val,
      },
    });
  };

  const addTag = (
    field: 'physicalTags' | 'psychologicalTags' | 'bucketListTags',
    tag: string
  ) => {
    const current = inputData.health[field] || [];
    if (!current.includes(tag)) {
      updateHealth(field, [...current, tag]);

      // Also append to main text field if not already there
      const targetTextField =
        field === 'physicalTags'
          ? 'physicalConcerns'
          : field === 'psychologicalTags'
          ? 'psychologicalConcerns'
          : 'bucketList';

      const existingText = inputData.health[targetTextField];
      if (!existingText.includes(tag)) {
        updateHealth(
          targetTextField,
          existingText ? `${existingText}, ${tag}` : tag
        );
      }
    }
  };

  const removeTag = (
    field: 'physicalTags' | 'psychologicalTags' | 'bucketListTags',
    tag: string
  ) => {
    const current = inputData.health[field] || [];
    updateHealth(
      field,
      current.filter((t) => t !== tag)
    );
  };

  const { totalAssets, debts, netWorth } = calculateNetWorth(inputData.assets);

  // Quick preset suggestions
  const physicalSuggestions = [
    '고혈압 관리',
    '당뇨 전단계',
    '무릎·허리 관절',
    '노안 및 시력 저하',
    '수면 부족·불면',
    '만성 피로',
    '체중·복부비만',
    '기억력 감퇴 걱정',
  ];

  const psychologicalSuggestions = [
    '퇴직 후 역할 상실감',
    '사회적 고립감',
    '배우자와의 관계 조율',
    '빈둥지 증후군 (자녀 독립)',
    '통장 잔고 소진 불안',
    '아침 루틴 부재',
    '삶의 의미와 보람 찾기',
  ];

  const bucketListSuggestions = [
    '제주도 1달 살기',
    '텃밭·주말농장 가꾸기',
    '통기타·색소폰 배우기',
    '목공·도예 공예',
    '전국 둘레길 완주',
    '시니어 자원봉사',
    '손주 동화책 쓰기',
    '해외 배낭·유럽 여행',
  ];

  return (
    <div className={`space-y-6 ${largeText ? 'text-base' : 'text-sm'}`}>
      {/* Warm Mentor Greeting Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-[#fcf6ee] to-amber-100/50 border border-amber-200/80 rounded-xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-10 pointer-events-none">
          <Smile className="w-32 h-32 text-amber-900" />
        </div>
        <div className="max-w-2xl">
          <span className="text-xs font-semibold text-amber-900 tracking-wider font-batang">
            인생 대선배의 환영 인사
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-batang mt-1 mb-2">
            "여기 따뜻한 차 한 잔 하렴. 그동안 정말 치열하게 살아왔지?"
          </h2>
          <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
            은퇴와 노년이란 두려운 마침표가 아니라, 평생 애쓴 나 자신에게 주는{' '}
            <strong className="text-amber-900 font-semibold">가장 자유롭고 따스한 새 학기</strong>란다.
            자네의 나이와 자금, 그리고 마음에 품은 작은 소망들을 솔직하게 들려주겠니?
            100세까지 5년마다 어떻게 살아갈지 선배로서 꼼꼼하고 다정하게 짚어줄게.
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`flex-1 py-3 px-2 sm:px-4 text-center font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'basic'
              ? 'border-amber-700 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-700" />
          <span>1. 기본 시기 & 목표</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('assets')}
          className={`flex-1 py-3 px-2 sm:px-4 text-center font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'assets'
              ? 'border-amber-700 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-700" />
          <span>2. 6가지 자금 상황</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('health')}
          className={`flex-1 py-3 px-2 sm:px-4 text-center font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'health'
              ? 'border-amber-700 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className="w-4 h-4 text-amber-700" />
          <span>3. 건강 & 버킷리스트</span>
        </button>
      </div>

      {/* Tab 1: Basic info & goals */}
      {activeTab === 'basic' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 font-batang text-lg">
              은퇴 여정의 출발점과 목표 생활비
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              현재 연령과 퇴직 시기, 그리고 노후에 희망하는 적정 월 생활비를 편안하게 적어주세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Age */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <span>현재 나이</span>
                  <span className="text-xs text-stone-500 font-normal">(만 나이)</span>
                </label>
                <span className="text-amber-800 font-bold text-base bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/50">
                  만 {inputData.currentAge}세
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="80"
                value={inputData.currentAge}
                onChange={(e) => updateField('currentAge', Number(e.target.value))}
                className="w-full accent-amber-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>40세</span>
                <span>50세</span>
                <span>60세</span>
                <span>70세</span>
                <span>80세</span>
              </div>
            </div>

            {/* Retirement Age */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <span>은퇴 (예정) 나이</span>
                  <span className="text-xs text-stone-500 font-normal">
                    {inputData.retirementAge <= inputData.currentAge ? '(현재 은퇴 상태)' : '(앞으로 남은 기간)'}
                  </span>
                </label>
                <span className="text-amber-800 font-bold text-base bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/50">
                  만 {inputData.retirementAge}세
                </span>
              </div>
              <input
                type="range"
                min={inputData.currentAge - 5 > 40 ? inputData.currentAge - 5 : 40}
                max="80"
                value={inputData.retirementAge}
                onChange={(e) => updateField('retirementAge', Number(e.target.value))}
                className="w-full accent-amber-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>
                  {inputData.retirementAge > inputData.currentAge
                    ? `퇴직까지 약 ${inputData.retirementAge - inputData.currentAge}년 남음`
                    : '이미 퇴직하여 노후 진행 중'}
                </span>
                <span>
                  {inputData.retirementAge < 65 && (
                    <span className="text-amber-700 font-medium">
                      ⚠️ 국민연금(63~65세) 수령 전 {65 - Math.max(inputData.currentAge, inputData.retirementAge)}년 소득 공백기
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Desired Monthly Expense */}
          <div className="border-t border-stone-100 pt-5 space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <span>희망하는 은퇴 후 부부/개인 월 생활비</span>
                </label>
                <p className="text-xs text-stone-500">
                  (국민연금연구원 2024 발표: 시니어 부부 적정 생활비 약 324만원 / 최소 생활비 216만원)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-amber-900 font-batang">
                  월 {inputData.desiredMonthlyExpense}만원
                </span>
                <span className="text-xs text-stone-500 block">
                  (연간 {formatKoreanWon(inputData.desiredMonthlyExpense * 12)})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="150"
                max="600"
                step="10"
                value={inputData.desiredMonthlyExpense}
                onChange={(e) => updateField('desiredMonthlyExpense', Number(e.target.value))}
                className="w-full accent-amber-700 cursor-pointer"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[200, 250, 280, 300, 350, 400].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => updateField('desiredMonthlyExpense', amt)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    inputData.desiredMonthlyExpense === amt
                      ? 'bg-amber-800 text-white border-amber-800'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  월 {amt}만원
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('assets')}
              className="px-4 py-2 bg-amber-800 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-amber-900 transition-colors flex items-center gap-2"
            >
              <span>다음: 6가지 자금 상황 입력</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: 6 Asset Buckets */}
      {activeTab === 'assets' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="border-b border-stone-100 pb-3 flex flex-wrap justify-between items-center gap-2">
            <div>
              <h3 className="font-bold text-stone-900 font-batang text-lg">
                후배의 6가지 든든한 자금 주머니
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                주거, 예금, 보험, 연금, 주식, 기타 자산을 솔직하게 적어주시면 선배가 최적의 인출 전략을 세워드립니다.
              </p>
            </div>
            <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/60 text-right">
              <span className="text-[11px] text-stone-500 block">현재 합산 순자산</span>
              <span className="font-bold text-amber-900 text-base">{formatKoreanWon(netWorth)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Housing (주거) */}
            <div className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-stone-200 flex items-center justify-center text-stone-700">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">1. 주거 자산 (부동산)</h4>
                    <span className="text-[11px] text-stone-500">자가 시세 또는 전·월세 보증금</span>
                  </div>
                </div>
                <span className="font-bold text-stone-900 text-sm font-batang">
                  {formatKoreanWon(inputData.assets.housing)}
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={inputData.assets.housing || ''}
                  onChange={(e) => updateAsset('housing', Math.max(0, Number(e.target.value)))}
                  placeholder="50000 (5억원)"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700 bg-white"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400">만원</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[1000, 5000, 10000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => updateAsset('housing', (inputData.assets.housing || 0) + inc)}
                    className="px-2 py-0.5 text-[11px] bg-white border border-stone-200 rounded text-stone-600 hover:bg-stone-100"
                  >
                    +{formatKoreanWon(inc)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-1 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={inputData.assets.housingPensionEligible}
                    onChange={(e) => updateAsset('housingPensionEligible', e.target.checked)}
                    className="rounded text-amber-700 focus:ring-amber-700"
                  />
                  <span>주택연금 가입 고려 (평생 거주 + 월 연금 지급)</span>
                </label>
              </div>
            </div>

            {/* 2. Savings & Cash (예금) */}
            <div className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-stone-200 flex items-center justify-center text-stone-700">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">2. 예금 및 현금성 자산</h4>
                    <span className="text-[11px] text-stone-500">정기예금, 적금, CMA, 비상금</span>
                  </div>
                </div>
                <span className="font-bold text-stone-900 text-sm font-batang">
                  {formatKoreanWon(inputData.assets.savings)}
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={inputData.assets.savings || ''}
                  onChange={(e) => updateAsset('savings', Math.max(0, Number(e.target.value)))}
                  placeholder="8000 (8천만원)"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700 bg-white"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400">만원</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[500, 1000, 3000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => updateAsset('savings', (inputData.assets.savings || 0) + inc)}
                    className="px-2 py-0.5 text-[11px] bg-white border border-stone-200 rounded text-stone-600 hover:bg-stone-100"
                  >
                    +{formatKoreanWon(inc)}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Insurance (보험) */}
            <div className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-stone-200 flex items-center justify-center text-stone-700">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">3. 보장성 및 저축성 보험</h4>
                    <span className="text-[11px] text-stone-500">
                      실손의료비 유지 여부, 3대 질병(암·뇌·심) 진단비, 종신/만기환급금 등
                    </span>
                  </div>
                </div>
              </div>

              <input
                type="text"
                value={inputData.assets.insurance}
                onChange={(e) => updateAsset('insurance', e.target.value)}
                placeholder="예: 실손의료보험 가입 중, 암 진단비 5천만원 보장, 65세 만기 저축보험 1건 보유"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700 bg-white"
              />

              <div className="flex flex-wrap gap-1.5 text-xs text-stone-600">
                <span className="text-stone-400 text-[11px] py-0.5">자주 쓰는 예시:</span>
                {['실손의료비 가입', '3대 질병(암/뇌/심장) 진단비 보유', '보험료 완납 완료', '치매·간병보험 보유'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      const cur = inputData.assets.insurance;
                      updateAsset('insurance', cur ? `${cur}, ${item}` : item);
                    }}
                    className="px-2 py-0.5 bg-white border border-stone-200 rounded text-[11px] hover:bg-stone-100"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Pensions (연금 3층 탑) */}
            <div className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-stone-200 flex items-center justify-center text-stone-700">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">4. 연금 자산 (3층 연금 체계)</h4>
                    <span className="text-[11px] text-stone-500">
                      평생 마르지 않는 월급 통장 (국민연금, 퇴직연금, 개인연금/IRP)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* National Pension */}
                <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1.5">
                  <label className="text-xs font-semibold text-stone-800 block">
                    국민연금 예상 수령액 (월)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputData.assets.pensions.nationalPensionEstimatedMonthly || ''}
                      onChange={(e) =>
                        updatePension('nationalPensionEstimatedMonthly', Math.max(0, Number(e.target.value)))
                      }
                      placeholder="130"
                      className="w-full px-2.5 py-1.5 text-sm border border-stone-300 rounded focus:ring-1 focus:ring-amber-700"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-stone-400">만원/월</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">
                    (63~65세부터 평생 수령)
                  </span>
                </div>

                {/* Retirement Pension */}
                <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1.5">
                  <label className="text-xs font-semibold text-stone-800 block">
                    퇴직연금 예상 총액 (일시금)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputData.assets.pensions.retirementPensionTotal || ''}
                      onChange={(e) =>
                        updatePension('retirementPensionTotal', Math.max(0, Number(e.target.value)))
                      }
                      placeholder="15000 (1.5억원)"
                      className="w-full px-2.5 py-1.5 text-sm border border-stone-300 rounded focus:ring-1 focus:ring-amber-700"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-stone-400">만원</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">
                    {formatKoreanWon(inputData.assets.pensions.retirementPensionTotal)}
                  </span>
                </div>

                {/* Personal Pension */}
                <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1.5">
                  <label className="text-xs font-semibold text-stone-800 block">
                    개인연금 / IRP (월 수령액)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputData.assets.pensions.personalPensionMonthly || ''}
                      onChange={(e) =>
                        updatePension('personalPensionMonthly', Math.max(0, Number(e.target.value)))
                      }
                      placeholder="50"
                      className="w-full px-2.5 py-1.5 text-sm border border-stone-300 rounded focus:ring-1 focus:ring-amber-700"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-stone-400">만원/월</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">
                    (연금저축펀드/보험 등)
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Stocks & Investments (주식) */}
            <div className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-stone-200 flex items-center justify-center text-stone-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">5. 주식 및 투자 자산</h4>
                    <span className="text-[11px] text-stone-500">국내외 주식, 배당 ETF, 펀드</span>
                  </div>
                </div>
                <span className="font-bold text-stone-900 text-sm font-batang">
                  {formatKoreanWon(inputData.assets.stocks)}
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={inputData.assets.stocks || ''}
                  onChange={(e) => updateAsset('stocks', Math.max(0, Number(e.target.value)))}
                  placeholder="5000 (5천만원)"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700 bg-white"
                />
                <span className="absolute right-3 top-2.5 text-xs text-stone-400">만원</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[500, 1000, 3000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => updateAsset('stocks', (inputData.assets.stocks || 0) + inc)}
                    className="px-2 py-0.5 text-[11px] bg-white border border-stone-200 rounded text-stone-600 hover:bg-stone-100"
                  >
                    +{formatKoreanWon(inc)}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Others & Debts (기타 및 부채) */}
            <div className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-stone-200 flex items-center justify-center text-stone-700">
                    <PackagePlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">6. 기타 자산 및 대출/부채</h4>
                    <span className="text-[11px] text-stone-500">차량, 귀금속 및 주택담보/신용대출</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-stone-600 block mb-1">기타 자산</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputData.assets.others || ''}
                      onChange={(e) => updateAsset('others', Math.max(0, Number(e.target.value)))}
                      placeholder="1000"
                      className="w-full px-2.5 py-1.5 text-sm border border-stone-300 rounded bg-white"
                    />
                    <span className="absolute right-2 top-2 text-xs text-stone-400">만원</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-red-700 block mb-1">남은 대출 (부채)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputData.assets.debts || ''}
                      onChange={(e) => updateAsset('debts', Math.max(0, Number(e.target.value)))}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 text-sm border border-red-200 text-red-800 rounded bg-white"
                    />
                    <span className="absolute right-2 top-2 text-xs text-red-400">만원</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-stone-500">
                기타 {formatKoreanWon(inputData.assets.others)} / 대출{' '}
                <span className="text-red-600">{formatKoreanWon(inputData.assets.debts)}</span>
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className="px-3 py-1.5 border border-stone-300 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-50"
            >
              ← 이전
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('health')}
              className="px-4 py-2 bg-amber-800 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-amber-900 transition-colors flex items-center gap-2"
            >
              <span>다음: 건강 & 버킷리스트 입력</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Health & Bucket list */}
      {activeTab === 'health' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 font-batang text-lg">
              몸과 마음의 건강, 그리고 못다 이룬 꿈
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              돈만 있다고 행복한 노후가 되는 건 아니란다. 선배에게 마음속 고민과 꼭 해보고 싶은 일들을 터놓아보렴.
            </p>
          </div>

          {/* Physical Health */}
          <div className="space-y-2.5">
            <label className="font-semibold text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>신체 질병 및 건강 걱정거리</span>
            </label>
            <textarea
              rows={3}
              value={inputData.health.physicalConcerns}
              onChange={(e) => updateHealth('physicalConcerns', e.target.value)}
              placeholder="예: 혈압이 약간 높고 오래 걸으면 허리와 무릎이 시큰거립니다. 체력이 예전 같지 않아 걱정됩니다."
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            {/* Quick tags */}
            <div className="flex flex-wrap gap-1.5">
              {physicalSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag('physicalTags', tag)}
                  className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Psychological Concerns */}
          <div className="space-y-2.5 border-t border-stone-100 pt-5">
            <label className="font-semibold text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>심리적 걱정거리 및 마음 고민</span>
            </label>
            <textarea
              rows={3}
              value={inputData.health.psychologicalConcerns}
              onChange={(e) => updateHealth('psychologicalConcerns', e.target.value)}
              placeholder="예: 은퇴 후 직장 명함이 없어지면 나를 어떻게 소개할지 막막하고, 하루 종일 배우자와 마주할 생각에 불안합니다."
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            <div className="flex flex-wrap gap-1.5">
              {psychologicalSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag('psychologicalTags', tag)}
                  className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Bucket list */}
          <div className="space-y-2.5 border-t border-stone-100 pt-5">
            <label className="font-semibold text-stone-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>꼭 해보고 싶은 취미와 버킷리스트</span>
            </label>
            <textarea
              rows={3}
              value={inputData.health.bucketList}
              onChange={(e) => updateHealth('bucketList', e.target.value)}
              placeholder="예: 배우자와 제주도 1달 살기, 작은 텃밭에서 유기농 채소 키우기, 목공 가구 만들기 배우기"
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            <div className="flex flex-wrap gap-1.5">
              {bucketListSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag('bucketListTags', tag)}
                  className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setActiveTab('assets')}
              className="px-3 py-1.5 border border-stone-300 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-50"
            >
              ← 이전
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar with Realtime Summary */}
      <div className="bg-[#f8f4ee] border border-amber-300/80 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span className="font-bold text-stone-900 font-batang text-sm sm:text-base">
              입력 요약 진단
            </span>
          </div>
          <p className="text-xs text-stone-600">
            현재 {inputData.currentAge}세 → 은퇴 {inputData.retirementAge}세 · 희망 월 {inputData.desiredMonthlyExpense}만원 · 순자산 {formatKoreanWon(netWorth)}
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={onSubmit}
          className="w-full sm:w-auto px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>선배가 차를 우리며 깊은 조언을 적는 중...</span>
            </>
          ) : (
            <>
              <span>🍵 선배에게 따뜻한 조언 청하기</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
