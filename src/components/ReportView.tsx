import React, { useState, useEffect } from 'react';
import {
  SeniorConsultationInput,
  ChatMessage,
} from '../types';
import {
  formatKoreanWon,
  calculateNetWorth,
  generateFiveYearIntervals,
  calculateHousingPensionEstimate,
} from '../utils/calculator';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  Heart,
  Calendar,
  Coins,
  Smile,
  Volume2,
  VolumeX,
  Printer,
  Copy,
  Check,
  Sparkles,
  Send,
  Home,
  ShieldAlert,
  ArrowRight,
  BookmarkCheck,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportViewProps {
  inputData: SeniorConsultationInput;
  adviceMarkdown: string;
  onEditInputs: () => void;
  largeText: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({
  inputData,
  adviceMarkdown,
  onEditInputs,
  largeText,
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'roadmap' | 'assets' | 'wellness' | 'bucket'>('letter');
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);

  // Follow-up chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Bucket list checked items
  const [checkedBuckets, setCheckedBuckets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisSupported(true);
    }
  }, []);

  const { netWorth } = calculateNetWorth(inputData.assets);
  const fiveYearIntervals = generateFiveYearIntervals(inputData);
  const housingPensionEstimate = calculateHousingPensionEstimate(
    inputData.assets.housing,
    Math.max(65, inputData.retirementAge)
  );

  // Copy advice text
  const handleCopy = () => {
    navigator.clipboard.writeText(adviceMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Speech TTS
  const toggleSpeech = () => {
    if (!speechSynthesisSupported) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      // Strip markdown tags for clean listening
      const plainText = adviceMarkdown
        .replace(/#+\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/>/g, '')
        .replace(/[-*•]/g, '');

      const utterance = new SpeechSynthesisUtterance(plainText.slice(0, 3000));
      utterance.lang = 'ko-KR';
      utterance.rate = 0.88; // gentle, reassuring elder pacing
      utterance.pitch = 0.95;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Follow-up question submit
  const handleSendQuestion = async (textToSend?: string) => {
    const q = textToSend || userQuestion;
    if (!q.trim() || isAsking) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setUserQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/senior-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: q,
          context: inputData,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const replyMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'senior',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, replyMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  const handleToggleBucket = (item: string) => {
    setCheckedBuckets((prev) => {
      const next = { ...prev, [item]: !prev[item] };
      if (next[item]) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
      return next;
    });
  };

  // Suggested follow-up questions
  const suggestedQuestions = [
    '주택연금은 몇 세에 신청하는 게 가장 이득일까?',
    '퇴직 직후 건강보험료 피부양자 자격 유지 비법은?',
    '소득 크레바스 기간 동안 멘탈과 통장을 지키는 현실 꿀팁은?',
    '은퇴 후 배우자와 하루 종일 부딪히지 않는 슬기로운 대화법은?',
  ];

  return (
    <div className={`space-y-6 ${largeText ? 'text-base' : 'text-sm'}`}>
      {/* Top Warm Banner & Action Bar */}
      <div className="bg-[#fcf7ef] border border-amber-300/80 rounded-2xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs font-semibold text-amber-900 tracking-wider font-batang flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span>100세 인생 설계 나침반 처방전</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-batang">
              "그동안 정말 수고 많았어. 이제 인생의 진짜 봄날을 시작해보자."
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              현재 만 {inputData.currentAge}세 · 은퇴 목표 {inputData.retirementAge}세 · 월 희망 생활비 {inputData.desiredMonthlyExpense}만원 · 순자산 {formatKoreanWon(netWorth)}
            </p>
          </div>

          {/* Quick Tools */}
          <div className="flex items-center flex-wrap gap-2 no-print">
            {speechSynthesisSupported && (
              <button
                type="button"
                onClick={toggleSpeech}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-800 text-white border-amber-800'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-amber-50'
                }`}
                title="선배의 다정한 음성으로 편지 듣기"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>낭독 멈추기</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span>음성으로 듣기</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
              <span>{copied ? '복사 완료' : '전체 복사'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-500" />
              <span>인쇄 / PDF</span>
            </button>

            <button
              type="button"
              onClick={onEditInputs}
              className="px-3 py-1.5 bg-amber-800 text-white hover:bg-amber-900 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>입력값 수정</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto no-print">
        <button
          type="button"
          onClick={() => setActiveTab('letter')}
          className={`py-3 px-4 font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'letter'
              ? 'border-amber-700 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Smile className="w-4 h-4 text-amber-700" />
          <span>🍵 선배의 따뜻한 편지</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roadmap')}
          className={`py-3 px-4 font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'roadmap'
              ? 'border-amber-700 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-700" />
          <span>📊 100세 5년 주기 로드맵</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('assets')}
          className={`py-3 px-4 font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'assets'
              ? 'border-amber-700 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-700" />
          <span>💰 6대 자금 진단 & 솔루션</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wellness')}
          className={`py-3 px-4 font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'wellness'
              ? 'border-amber-700 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className="w-4 h-4 text-amber-700" />
          <span>🌿 몸 & 마음 건강 처방전</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bucket')}
          className={`py-3 px-4 font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'bucket'
              ? 'border-amber-700 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>🌟 버킷리스트 실천 플래너</span>
        </button>
      </div>

      {/* Tab 1: Full Letter from Senior Mentor */}
      {activeTab === 'letter' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-amber-600"></div>
              <span className="font-batang font-bold text-stone-900 text-lg sm:text-xl">
                사랑방에서 건네는 선배의 맞춤형 친서
              </span>
            </div>
            <span className="text-xs text-stone-400">
              상담일: {new Date().toLocaleDateString('ko-KR')}
            </span>
          </div>

          <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200/50 text-stone-700 text-xs sm:text-sm leading-relaxed font-batang italic">
            "인생이란 긴 마라톤에서 이제 결승점을 통과한 게 아니라, 가장 좋아하는 풍경 속으로 산책을 나서는 시간이란다. 조급해하지 말고 하나씩 천천히 준비해보자."
          </div>

          <div className="pt-2">
            <MarkdownRenderer content={adviceMarkdown} />
          </div>
        </div>
      )}

      {/* Tab 2: 100-Year 5-Year Cashflow Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-batang flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-700" />
              <span>100세까지 5년 주기 생존 자금 & 활동 로드맵</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              현재 만 {inputData.currentAge}세부터 100세까지, 5년 단위로 변화하는 월 필요 생활비와 중점 행동 요령입니다.
            </p>
          </div>

          {/* Income Crevasse Highlight Alert if retirement age < 65 */}
          {inputData.retirementAge < 65 && (
            <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-xl space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <h4 className="font-bold text-amber-950 text-sm">
                  ⚡ 주목: {inputData.retirementAge}세 ~ 65세 ‘소득 크레바스(소득 절벽기)’ 완충 전략
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                은퇴 후 국민연금이 개시되는 63~65세까지 약 {65 - inputData.retirementAge}년의 소득 공백기가 발생합니다.
                이 시기에는 <strong>퇴직연금 분할 인출, 비상예금(연간 생활비의 1~2년치), 개인연금</strong>을 브릿지(징검다리)로 활용하고,
                건강보험료 피부양자 자격 유지(또는 임의계속가입제도 36개월 활용)를 꼼꼼히 챙겨야 합니다.
              </p>
            </div>
          )}

          {/* 5-Year Interval Cards */}
          <div className="space-y-4">
            {fiveYearIntervals.map((interval, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-xl border transition-all ${
                  interval.isCrevasse
                    ? 'border-amber-400 bg-amber-50/40 shadow-xs'
                    : 'border-stone-200 hover:border-amber-300 bg-stone-50/30'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-stone-200/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-16 sm:w-20 px-2 py-1 text-center font-bold text-xs sm:text-sm rounded bg-stone-800 text-white">
                      {interval.startAge}~{interval.endAge}세
                    </span>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base font-batang">
                        {interval.stageName}
                      </h4>
                      <p className="text-xs text-stone-500">{interval.stageSub}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-stone-500 block">권장 월 생활비</span>
                    <span className="text-base sm:text-lg font-bold text-amber-900 font-batang">
                      월 약 {interval.monthlyLivingCost}만원
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs sm:text-sm">
                  <div className="bg-white p-3 rounded-lg border border-stone-100">
                    <span className="text-stone-400 text-[11px] block mb-1">주요 현금 수입원</span>
                    <p className="font-medium text-stone-800">{interval.primaryIncomeSource}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-stone-100">
                    <span className="text-stone-400 text-[11px] block mb-1">핵심 실천 과제</span>
                    <p className="font-medium text-stone-800">{interval.keyAction}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-stone-100">
                    <span className="text-stone-400 text-[11px] block mb-1">몸 & 마음 건강 초점</span>
                    <p className="font-medium text-stone-800">{interval.healthFocus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: 6 Financial Buckets Diagnosis & Solutions */}
      {activeTab === 'assets' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3 flex flex-wrap justify-between items-center gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-batang flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-700" />
                <span>6대 자금 진단 및 인출 황금 비율</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                자산의 크기보다 중요한 것은 '매달 마르지 않는 현금 흐름'입니다.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block">총 순자산 (자산 - 부채)</span>
              <span className="text-xl font-bold text-amber-900 font-batang">{formatKoreanWon(netWorth)}</span>
            </div>
          </div>

          {/* 6 Asset Grid Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Housing */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">1. 주거 자산</span>
                <span className="font-bold text-stone-900">{formatKoreanWon(inputData.assets.housing)}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                부동산 자산은 노후 후반부(70세 이후) 가장 든든한 방패입니다. 필요시 주택연금으로 전환하면 평생 내 집에 살면서 월 약{' '}
                <strong className="text-amber-900 font-semibold">{housingPensionEstimate}만원</strong>의 연금을 비과세로 수령할 수 있습니다.
              </p>
            </div>

            {/* Savings */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">2. 예금/비상금</span>
                <span className="font-bold text-stone-900">{formatKoreanWon(inputData.assets.savings)}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                퇴직 직후 최소 1~2년 치 생활비(약 3,000만~6,000만원)는 CMA나 안전한 단기 정기예금에 예치하여 시장 변동 시 원금을 헐지 않도록 완충지대를 만들어두세요.
              </p>
            </div>

            {/* Insurance */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">3. 보험 보장</span>
                <span className="font-bold text-stone-900 text-xs">보유 현황 확인</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                "{inputData.assets.insurance || '실손의료비 중심 유지'}"<br />
                은퇴 후 보험료 지출이 부담되지 않도록 불필요한 저축성 보험은 정리하고 실손보험 및 3대 진단비 위주로 슬림화하는 것이 핵심입니다.
              </p>
            </div>

            {/* Pensions */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">4. 3층 연금 체계</span>
                <span className="font-bold text-amber-900 text-xs">
                  국민 {inputData.assets.pensions.nationalPensionEstimatedMonthly}만 / 퇴직 {formatKoreanWon(inputData.assets.pensions.retirementPensionTotal)}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                국민연금(기초), 퇴직연금 IRP(중간), 개인연금(추가)의 3층 구조로 희망 월 생활비({inputData.desiredMonthlyExpense}만원)의 70% 이상을 현금 흐름으로 방어합니다.
              </p>
            </div>

            {/* Stocks */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">5. 주식 및 투자</span>
                <span className="font-bold text-stone-900">{formatKoreanWon(inputData.assets.stocks)}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                변동성이 큰 개별 종목보다는 연 4~6% 수준의 안정적인 배당 ETF, 리츠(Reits), 우량 채권형 펀드로 포트폴리오를 점진적으로 전환하여 현금 배당을 생활비로 흡수하세요.
              </p>
            </div>

            {/* Debts & Others */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">6. 기타 및 부채</span>
                <span className="font-bold text-red-600 text-xs">부채: {formatKoreanWon(inputData.assets.debts)}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                은퇴 후 고정 금리 비용이 나가는 대출은 은퇴 전 퇴직금 일부나 예금으로 최우선 상환하여 고정 지출을 최소화하는 것이 마음의 평화를 얻는 지름길입니다.
              </p>
            </div>
          </div>

          {/* Housing Pension Deep Dive Card */}
          <div className="bg-[#faf6ee] p-5 rounded-xl border border-amber-300/80 space-y-3">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-amber-800" />
              <h4 className="font-bold text-stone-900 text-sm sm:text-base font-batang">
                💡 선배의 주택연금 솔루션: 집을 지키며 받는 평생 월급
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              보유 주택({formatKoreanWon(inputData.assets.housing)})을 한국주택금융공사의 <strong>주택연금</strong>에 가입할 경우,
              평생 부부 두 분 모두 집에서 거주하면서 <strong>매월 약 {housingPensionEstimate}만원</strong>의 연금을 평생 수령할 수 있습니다.
              부부가 모두 세상을 떠난 후 집값 잔여분이 남으면 자녀에게 상속되고, 부족해도 청구되지 않는 든든한 국가 보증 제도입니다.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Physical & Psychological Wellness Prescriptions */}
      {activeTab === 'wellness' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-batang flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-700" />
              <span>선배가 전하는 몸과 마음 건강 처방전</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              "노후에 가장 큰 자산은 건강한 다리와 평온한 마음이란다."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physical Care */}
            <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <h4 className="font-bold text-base font-batang">신체 건강 관리 솔루션</h4>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
                <span className="font-semibold text-stone-800 block">후배가 들려준 걱정거리:</span>
                <p className="italic text-stone-700">"{inputData.health.physicalConcerns || '특별한 질환 없음'}"</p>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-700 font-bold">1.</span>
                  <div>
                    <strong>매일 아침 햇살 산책 (7,000보)</strong>
                    <p className="text-xs text-stone-500 mt-0.5">
                      무리한 마라톤이나 헬스보다 매일 일정한 시간에 햇볕을 쬐며 걷는 것이 혈압 안정, 뼈 건강, 수면 호르몬에 가장 특효약이란다.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-700 font-bold">2.</span>
                  <div>
                    <strong>허벅지와 코어 근육 지키기</strong>
                    <p className="text-xs text-stone-500 mt-0.5">
                      의자에 앉아 다리 들어 올리기, 벽 짚고 스쿼트 20회씩만 해보렴. 70대 이후 낙상을 막고 관절 통증을 줄여주는 최고의 저축이란다.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-700 font-bold">3.</span>
                  <div>
                    <strong>국가 건강검진과 단골 병원 주치의 만들기</strong>
                    <p className="text-xs text-stone-500 mt-0.5">
                      대형병원만 고집하지 말고 집 근처에 내 혈압과 당뇨 수치를 꾸준히 기록해줄 다정한 동네 내과 의사를 정해두렴.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Psychological Care */}
            <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h4 className="font-bold text-base font-batang">심리적 안정 & 마음 챙김 비결</h4>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
                <span className="font-semibold text-stone-800 block">후배가 털어놓은 마음 고민:</span>
                <p className="italic text-stone-700">"{inputData.health.psychologicalConcerns || '은퇴 후 막연한 불안'}"</p>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-700 font-bold">1.</span>
                  <div>
                    <strong>직함 대신 '내 이름'으로 살아갈 용기</strong>
                    <p className="text-xs text-stone-500 mt-0.5">
                      부장, 이사, 사장이라는 껍데기를 벗는 순간이 진짜 내 삶의 주인으로 거듭나는 순간이란다. 명함이 없어도 자네는 존귀한 사람이야.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-700 font-bold">2.</span>
                  <div>
                    <strong>아침에 눈떠서 갈 곳 3곳 만들기</strong>
                    <p className="text-xs text-stone-500 mt-0.5">
                      동네 도서관, 주민센터 강좌, 단골 카페 등 아침에 옷을 갈아입고 걸어갈 나만의 '아지트'를 3곳만 만들어두면 우울증이 올 틈이 없어.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-700 font-bold">3.</span>
                  <div>
                    <strong>배우자와 '따로 또 같이' 거리 유지</strong>
                    <p className="text-xs text-stone-500 mt-0.5">
                      하루 종일 삼시세끼 밥상만 바라보지 말고, 각자의 취미와 공간을 존중해줄 때 부부 사이도 다시 애틋하고 다정해진단다.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Bucket List Action Planner */}
      {activeTab === 'bucket' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-batang flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <span>꿈꿔온 버킷리스트 & 취미 실천 플래너</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              언젠가 해야지 하고 미뤄두었던 일들을 지금부터 하나씩 실천해보렴. 클릭해서 달성 체크를 해볼 수 있단다!
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: inputData.health.bucketList || '제주 한달살기와 나만의 텃밭 가꾸기',
                timing: '은퇴 직후 1~3년 차 (황금기)',
                tip: '퇴직 직후 가장 체력과 호기심이 왕성할 때 예산의 5~10%를 과감히 투자하여 실천해보렴.',
              },
              {
                title: '매주 한 번 나만의 손맛이 담긴 요리 배우기',
                timing: '일상 루틴 정착기',
                tip: '배우자를 위해, 혹은 나 자신을 위해 정갈한 밥상을 차리는 기쁨은 마음을 가득 채워준단다.',
              },
              {
                title: '마을 도서관이나 청소년 센터 시니어 멘토링 봉사',
                timing: '은퇴 3~5년 차',
                tip: '평생 축적한 직무 경험과 지혜를 다음 세대에게 나누어줄 때 인생 최고의 보람을 맛보게 된단다.',
              },
              {
                title: '가족과 손주들에게 들려줄 나의 인생 자서전/녹음 남기기',
                timing: '70세 이후 여유기',
                tip: '거창한 책이 아니어도 좋아. 소박한 노트 한 권이나 스마트폰 음성 녹음만으로도 가족에게 가장 귀한 가보가 된단다.',
              },
            ].map((bucket, idx) => {
              const isChecked = !!checkedBuckets[bucket.title];
              return (
                <div
                  key={idx}
                  onClick={() => handleToggleBucket(bucket.title)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-amber-50/70 border-amber-400'
                      : 'bg-stone-50/40 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                      isChecked ? 'bg-amber-700 text-white' : 'border-2 border-stone-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h4
                        className={`font-semibold text-sm sm:text-base font-batang ${
                          isChecked ? 'line-through text-stone-500' : 'text-stone-900'
                        }`}
                      >
                        {bucket.title}
                      </h4>
                      <span className="text-[11px] text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                        {bucket.timing}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{bucket.tip}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Senior Follow-up Q&A Chat */}
      <div className="bg-[#faf7f2] border border-amber-300/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4 no-print">
        <div className="flex items-center gap-2 border-b border-amber-200/60 pb-3">
          <HelpCircle className="w-5 h-5 text-amber-800" />
          <div>
            <h3 className="font-bold text-stone-900 font-batang text-base sm:text-lg">
              선배님, 이런 점이 더 궁금해요
            </h3>
            <p className="text-xs text-stone-600">
              읽다 보니 더 묻고 싶은 게 있니? 주저 말고 무엇이든 편하게 물어보렴.
            </p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuestion(q)}
              disabled={isAsking}
              className="px-3 py-1.5 text-xs bg-white hover:bg-amber-100/80 text-stone-800 border border-amber-200 rounded-full transition-colors text-left disabled:opacity-50 cursor-pointer"
            >
              💬 {q}
            </button>
          ))}
        </div>

        {/* Chat message history */}
        {chatMessages.length > 0 && (
          <div className="space-y-3 pt-2 max-h-96 overflow-y-auto pr-1">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'senior' && (
                  <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold font-batang flex-shrink-0">
                    선배
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-800 text-white rounded-tr-none'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-[10px] block mt-1 ${
                      msg.sender === 'user' ? 'text-amber-200 text-right' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isAsking && (
              <div className="flex gap-2.5 items-center text-xs text-stone-500 italic">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                  ...
                </div>
                <span>선배가 찻잔을 쥐고 따뜻한 답변을 생각하고 있단다...</span>
              </div>
            )}
          </div>
        )}

        {/* Input Question Box */}
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendQuestion();
            }}
            placeholder="궁금한 연금 수령법, 가족과의 관계, 지출 줄이기 등을 물어보세요..."
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
          />
          <button
            type="button"
            disabled={isAsking || !userQuestion.trim()}
            onClick={() => handleSendQuestion()}
            className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">질문하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
