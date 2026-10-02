import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Senior consultation advice generation endpoint
  app.post('/api/senior-consult', async (req, res) => {
    try {
      const data = req.body;
      const {
        currentAge = 55,
        retirementAge = 60,
        desiredMonthlyExpense = 300,
        assets = {},
        health = {},
      } = data;

      const housingVal = assets.housing || 0;
      const savingsVal = assets.savings || 0;
      const stocksVal = assets.stocks || 0;
      const othersVal = assets.others || 0;
      const debtsVal = assets.debts || 0;
      const insuranceDesc = assets.insurance || '미입력';
      const nationalPension = assets.pensions?.nationalPensionEstimatedMonthly || 0;
      const retirementPension = assets.pensions?.retirementPensionTotal || 0;
      const personalPension = assets.pensions?.personalPensionMonthly || 0;

      const physicalDesc = health.physicalConcerns || '특별한 지병 없음';
      const psychologicalDesc = health.psychologicalConcerns || '노후에 대한 막연한 불안';
      const bucketListDesc = health.bucketList || '건강하고 평온한 일상 누리기';

      const prompt = `
당신은 인생의 온갖 희로애락을 먼저 겪어낸 든든하고 따뜻한 인생 대선배(70대 혜안을 지닌 원로)이자, 공인 노년 라이프·재무 설계 전문가입니다.

방문자(후배)가 노후와 은퇴에 대한 불안을 안고 찾아왔습니다. 사랑방에서 정성스레 우려낸 따뜻한 둥굴레차나 국화차 한 잔을 건네며 다정하게 마주 앉아 이야기를 나누듯 맞춤형 조언을 작성해주세요.

[후배가 털어놓은 현재 정보]
- 현재 나이: ${currentAge}세
- 은퇴 예정/희망 나이: ${retirementAge}세
- 희망 월 생활비: ${desiredMonthlyExpense}만원
- 6가지 자금 상황:
  1) 주거 자산: ${housingVal}만원 (형태: ${assets.housingType || '자가/전월세'})
  2) 예금 및 현금: ${savingsVal}만원
  3) 보험 현황: ${insuranceDesc}
  4) 연금 현황: 국민연금 예상 월 ${nationalPension}만원 / 퇴직연금 일시금 또는 총액 ${retirementPension}만원 / 개인연금 월 ${personalPension}만원
  5) 주식 및 투자: ${stocksVal}만원
  6) 기타 자산: ${othersVal}만원 (부채/대출: ${debtsVal}만원)
- 건강 및 심리 상태:
  * 신체 질병 및 걱정거리: ${physicalDesc}
  * 심리적 걱정거리: ${psychologicalDesc}
  * 버킷리스트 및 꿈꾸는 노후 취미: ${bucketListDesc}

[답변 작성 가이드라인 - 엄격 준수]
1. 말투: 마치 오랜 세월을 먼저 살아온 친근하고 다정한 선배가 따뜻한 차 한잔 건네며 조언해주듯, 부드럽고 격려가 되는 어조(~했어, ~해보자, 걱정마, ~란다, ~했구나, 참 애썼어)를 사용해주세요. 절대 기계적이거나 차가운 딱딱한 보고서체(~합니다, ~하십시오)를 쓰지 마세요.
2. 구성:
   # 1. 🍵 따뜻한 공감과 응원의 오프닝
     - 후배의 그동안의 치열한 삶과 노고를 진심으로 인정하고 토닥여주는 따뜻한 위로와 격려
     - 혼자가 아니라는 든든한 응원
   # 2. 💰 100세까지 5년 단위 생존 기간을 고려한 월별 생활자금 설계 및 제안
     - 현재 나이(${currentAge}세)부터 100세까지 5년 단위(예: ${currentAge}~${retirementAge}세, ${retirementAge}~65세 크레바스기, 65~70세 국민연금 개시 액티브기, 70~75세, 75~80세 의료비 대비기, 80~85세, 85~90세, 90~100세 평온한 노후)로 나누어 상세한 월 생활자금 플랜 제시
     - 6가지 자금(주거, 예금, 보험, 연금, 주식, 기타)의 구체적인 인출 순서, 소득 공백기(크레바스) 대처법, 주택연금 활용 시기 등 현실적 조언
   # 3. 🌿 신체 및 심리 건강을 위한 다정한 조언과 관리 팁
     - 후배의 신체 걱정("${physicalDesc}")에 대한 무리 없는 일상 건강 관리법
     - 심리적 불안("${psychologicalDesc}")을 다스리는 선배의 따뜻한 지혜와 마음가짐
   # 4. 🌟 취미 생활 및 버킷리스트 실현을 위한 구체적인 아이디어
     - 후배의 버킷리스트("${bucketListDesc}")를 은퇴 자금에 무리 없이 단계별로 실현할 수 있는 구체적인 실행 아이디어
     - 선배가 권하는 소소하고 행복한 시니어 취미와 활동
   # 5. 💌 선배가 건네는 배웅의 말
     - 차 한 잔 더 생각나면 언제든 들르라는 다정한 배웅

3. 형식: 마크다운 헤더(#, ##, ###), 인용구(>), 글머리 기호(-), 강조(**)를 활용하여 가독성이 아주 좋고 편안하게 읽히도록 작성해주세요.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      const adviceText = response.text || '선배의 조언을 불러오는 중 잠시 지연이 발생했단다. 다시 한 번 이야기해줄래?';

      res.json({
        success: true,
        advice: adviceText,
      });
    } catch (error: any) {
      console.error('Error generating senior advice:', error);
      res.status(500).json({
        success: false,
        error: error.message || '인생 선배의 조언을 작성하는 중 문제가 발생했습니다.',
      });
    }
  });

  // Follow-up conversation endpoint
  app.post('/api/senior-followup', async (req, res) => {
    try {
      const { userQuestion, context } = req.body;

      const prompt = `
당신은 인생의 온갖 경험을 먼저 겪어낸 든든하고 다정한 인생 선배이자 노년 생활 설계 전문가입니다.
후배가 앞서 작성해준 은퇴 설계 조언을 읽고 추가로 다음과 같은 질문이나 고민을 털어놓았습니다.

[이전 상담 요약]
- 현재 나이: ${context?.currentAge || '미상'}세, 은퇴: ${context?.retirementAge || '미상'}세
- 주요 걱정: ${context?.health?.physicalConcerns || '건강'} / ${context?.health?.psychologicalConcerns || '노후 심리'}

[후배의 추가 질문/고민]
"${userQuestion}"

[답변 지침]
- 오랜 세월을 먼저 살아온 친근하고 다정한 선배의 어조(~했어, ~해보자, 걱정마, ~란다 등)를 유지해주세요.
- 현실적이면서도 마음이 놓이는 실천 팁과 지혜를 마크다운 형식으로 다정하게 설명해주세요.
- 차 한 잔을 앞에 두고 눈을 맞추며 이야기하듯 따뜻하게 답해주세요.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.75,
        },
      });

      res.json({
        success: true,
        reply: response.text || '선배가 잠깐 생각에 잠겼단다. 다시 한번 물어봐줄래?',
      });
    } catch (error: any) {
      console.error('Error in followup:', error);
      res.status(500).json({
        success: false,
        error: error.message || '답변을 생성하는 도중 오류가 발생했습니다.',
      });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Senior Life Mentor Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
