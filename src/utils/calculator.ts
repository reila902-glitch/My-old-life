import { SeniorConsultationInput, FiveYearInterval, AssetsInput } from '../types';

export function formatKoreanWon(manwon: number): string {
  if (manwon === 0) return '0원';
  const isNegative = manwon < 0;
  const absVal = Math.abs(manwon);

  const eok = Math.floor(absVal / 10000);
  const remainderMan = absVal % 10000;

  let result = '';
  if (eok > 0) {
    result += `${eok}억`;
    if (remainderMan > 0) {
      result += ` ${remainderMan.toLocaleString()}만원`;
    } else {
      result += '원';
    }
  } else {
    result = `${remainderMan.toLocaleString()}만원`;
  }

  return isNegative ? `-${result}` : result;
}

export function calculateNetWorth(assets: AssetsInput) {
  const totalAssets =
    (assets.housing || 0) +
    (assets.savings || 0) +
    (assets.stocks || 0) +
    (assets.pensions?.retirementPensionTotal || 0) +
    (assets.others || 0);

  const debts = assets.debts || 0;
  const netWorth = totalAssets - debts;

  return {
    totalAssets,
    debts,
    netWorth,
  };
}

export function calculateHousingPensionEstimate(houseValueManwon: number, age: number): number {
  if (houseValueManwon <= 0 || age < 55) return 0;
  // Korea Housing Finance Corp approximate:
  // At 60: ~20만원 / 1억원 house value
  // At 65: ~25만원 / 1억원
  // At 70: ~31만원 / 1억원
  // At 75: ~39만원 / 1억원
  let ratePerEok = 20;
  if (age >= 75) ratePerEok = 39;
  else if (age >= 70) ratePerEok = 31;
  else if (age >= 65) ratePerEok = 25;
  else if (age >= 60) ratePerEok = 20;
  else ratePerEok = 16;

  const eok = houseValueManwon / 10000;
  return Math.round(eok * ratePerEok);
}

export function generateFiveYearIntervals(input: SeniorConsultationInput): FiveYearInterval[] {
  const current = input.currentAge;
  const retire = input.retirementAge;
  const desiredExp = input.desiredMonthlyExpense;

  const intervals: FiveYearInterval[] = [];

  // Generate intervals up to 100
  let age = current;

  while (age < 100) {
    const startAge = age;
    // Align to 5-year step or retirement age boundary
    let endAge = Math.min(100, Math.ceil((age + 1) / 5) * 5);
    if (endAge <= startAge) {
      endAge = Math.min(100, startAge + 5);
    }

    const isBeforeRetire = endAge <= retire;
    const isCrevasse = startAge >= retire && endAge <= 65;
    const isEarlyRetireActive = startAge >= 65 && endAge <= 75;
    const isMiddleSenior = startAge >= 75 && endAge <= 85;
    const isLateSenior = startAge >= 85;

    let stageName = '';
    let stageSub = '';
    let monthlyLivingCost = desiredExp;
    let primaryIncomeSource = '';
    let keyAction = '';
    let healthFocus = '';

    if (isBeforeRetire) {
      stageName = '은퇴 카운트다운 준비기';
      stageSub = '주 수입원 유지 및 부채 상환, 자산 구조 정리';
      monthlyLivingCost = desiredExp;
      primaryIncomeSource = '근로/사업 소득 + 저축';
      keyAction = '잔여 대출 상환 가속화, 국민연금 추납/임의계속가입 여부 확인';
      healthFocus = '직무 스트레스 완화, 혈압/혈당 주기적 모니터링, 기초 근력 강화';
    } else if (isCrevasse) {
      stageName = '소득 크레바스(절벽) 극복기';
      stageSub = '퇴직 후 국민연금 개시(63~65세) 전 든든한 징검다리 구축';
      monthlyLivingCost = Math.round(desiredExp * 0.9); // slightly adjusted
      primaryIncomeSource = '퇴직연금 분할인출 + 개인연금 + 비상예금 + 파트타임/자문';
      keyAction = '퇴직연금 IRP 절세 인출, 건보료 피부양자 유지 체크, 생활비 다이어트';
      healthFocus = '은퇴 후 루틴 유지, 아침 산책과 독서, 사회적 관계망 다변화';
    } else if (isEarlyRetireActive) {
      stageName = '황금빛 액티브 시니어기';
      stageSub = '국민연금 수령 개시 및 가장 건강하고 여유로운 제2의 청춘';
      monthlyLivingCost = Math.round(desiredExp * 1.05); // Active leisure spending
      primaryIncomeSource = '국민연금 + 개인연금 + 배당수익';
      keyAction = '버킷리스트 실현(여행, 취미, 봉사), 가족과의 추억 여행';
      healthFocus = '관절 무리 없는 유산소 운동(수영, 걷기), 뇌 인지 훈련(독서, 악기)';
    } else if (isMiddleSenior) {
      stageName = '안정적 여가 및 건강 집중기';
      stageSub = '활동량 완화, 의료비 예비비 확보 및 주거 환경 개선';
      monthlyLivingCost = Math.round(desiredExp * 0.85);
      primaryIncomeSource = '국민연금 + 주택연금(필요시) + 안전 채권이자';
      keyAction = '주거 다운사이징 또는 주택연금 전환 검토, 의료 실손보험 보장 점검';
      healthFocus = '낙상 예방 근력 운동, 만성질환 집중 관리, 정기 뇌 건강(치매 조기검진)';
    } else {
      stageName = '평온하고 존엄한 안식기';
      stageSub = '돌봄과 의료 안정망, 따뜻한 가족 유대와 삶의 정리';
      monthlyLivingCost = Math.round(desiredExp * 0.8) + 30; // living cost lowers, care cost rises
      primaryIncomeSource = '국민연금 + 주택연금 + 의료비 비축금';
      keyAction = '간병 및 장기요양보험 활용, 유언 및 자산 상속 사전 정리';
      healthFocus = '영양 균형 식단, 햇볕 쬐기, 가족 및 이웃과의 정서적 교감';
    }

    intervals.push({
      startAge,
      endAge,
      stageName,
      stageSub,
      monthlyLivingCost,
      primaryIncomeSource,
      keyAction,
      healthFocus,
      isCrevasse,
    });

    age = endAge;
  }

  return intervals;
}
