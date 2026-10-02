import { SeniorConsultationInput } from '../types';

export const SAMPLE_PRESETS: { title: string; subtitle: string; data: SeniorConsultationInput }[] = [
  {
    title: '53세 직장인 (은퇴 카운트다운)',
    subtitle: '자녀 독립 후 노후 자금 점검 및 소득 크레바스 대비',
    data: {
      currentAge: 53,
      retirementAge: 60,
      desiredMonthlyExpense: 280,
      assets: {
        housing: 55000, // 5.5억
        housingType: 'own',
        housingPensionEligible: true,
        savings: 8000, // 8천만원
        insurance: '실손의료비 유지 중, 3대 질병 진단비(암·뇌·심) 5천만원 보장, 65세 만기 저축보험 1건',
        insuranceMonthlyRefund: 0,
        pensions: {
          nationalPensionEstimatedMonthly: 135, // 135만원 예상
          retirementPensionTotal: 18000, // 1.8억
          personalPensionMonthly: 45, // 개인연금 45만원
        },
        stocks: 6500, // 6,500만원
        others: 2000, // 차량 및 중고 자산 2,000만원
        debts: 3500, // 주택담보대출 잔액 3,500만원
      },
      health: {
        physicalConcerns: '최근 혈압이 약간 높게 나오고 오래 서 있으면 무릎과 허리가 뻐근합니다. 체력이 예전 같지 않아 걱정입니다.',
        physicalTags: ['경미한 고혈압', '무릎·허리 관절', '만성 피로'],
        psychologicalConcerns: '평생 일만 해왔는데 직장을 그만두면 사회에서 잊혀질까 봐 두렵고, 매일 아침 어디로 가야 할지 막막할 것 같습니다.',
        psychologicalTags: ['역할 상실감', '사회적 고립 불안', '은퇴 후 루틴 상실'],
        bucketList: '아내와 함께 제주도 1달 살기, 작고 아담한 주말농장에서 유기농 채소 가꾸기, 목공 가구 만들기 배우기',
        bucketListTags: ['제주 한달살기', '텃밭·가드닝', '목공 DIY', '부부 트래킹'],
      },
    },
  },
  {
    title: '58세 은퇴 직전 베이비부머',
    subtitle: '퇴직 2년 전, 소득 공백기 극복 및 제2의 인생 찾기',
    data: {
      currentAge: 58,
      retirementAge: 60,
      desiredMonthlyExpense: 320,
      assets: {
        housing: 70000, // 7억
        housingType: 'own',
        housingPensionEligible: true,
        savings: 12000, // 1.2억
        insurance: '실손보험 + 종신보험 완납, 암보험 가입 완료',
        insuranceMonthlyRefund: 20,
        pensions: {
          nationalPensionEstimatedMonthly: 155, // 155만원 (63세~65세 수령)
          retirementPensionTotal: 22000, // 2.2억
          personalPensionMonthly: 60, // 60만원
        },
        stocks: 9000, // 9천만원 (배당주 위주)
        others: 1500,
        debts: 0,
      },
      health: {
        physicalConcerns: '당뇨 전단계 판정을 받아 식단 관리가 필요하고, 시력이 침침해져 노안이 심해졌습니다.',
        physicalTags: ['당뇨 전단계', '노안', '수면 장애'],
        psychologicalConcerns: '자녀들이 모두 분가하면서 집이 너무 조용해졌습니다. 배우자와 둘만 남았을 때 어색하지 않게 지낼 수 있을지 걱정입니다.',
        psychologicalTags: ['빈둥지 증후군', '배우자 관계 조율', '삶의 의미 탐색'],
        bucketList: '손주들에게 읽어줄 그림책 글쓰기, 동해안 해파랑길 완주, 지역 복지관에서 은퇴자 멘토링 봉사활동',
        bucketListTags: ['동화책 집필', '해파랑길 걷기', '시니어 멘토링', '커피 핸드드립'],
      },
    },
  },
  {
    title: '63세 은퇴 초년생 (액티브 시니어)',
    subtitle: '국민연금 개시 직전, 건강과 여가를 함께 챙기는 황금기',
    data: {
      currentAge: 63,
      retirementAge: 62,
      desiredMonthlyExpense: 250,
      assets: {
        housing: 40000, // 4억
        housingType: 'own',
        housingPensionEligible: true,
        savings: 6000,
        insurance: '실손보험 보유 (보험료 상승 부담 약간 있음)',
        insuranceMonthlyRefund: 0,
        pensions: {
          nationalPensionEstimatedMonthly: 110,
          retirementPensionTotal: 8000,
          personalPensionMonthly: 30,
        },
        stocks: 4000,
        others: 1000,
        debts: 0,
      },
      health: {
        physicalConcerns: '고지혈증 약을 복용 중이며, 계단 오를 때 숨이 좀 차서 유산소 운동이 절실합니다.',
        physicalTags: ['고지혈증 약 복용', '심폐 지구력 저하'],
        psychologicalConcerns: '시간은 많은데 막상 돈을 쓰자니 통장 잔고가 줄어드는 것이 두려워 집에만 머물게 됩니다.',
        psychologicalTags: ['지출 공포증', '활동 위축', '무기력감'],
        bucketList: '색소폰이나 통기타 동호회 활동, 국립공원 스탬프 투어, 아내와 함께하는 전국 5일장 맛기행',
        bucketListTags: ['통기타 배우기', '국립공원 스탬프', '전국 5일장 투어'],
      },
    },
  },
];
