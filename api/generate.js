import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { type, bodyInfo, condition, feedback, image } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    let contents = [];

    if (type === 'equipment' && image) {
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: '유효하지 않은 이미지 형식입니다.' });
      }
      const mimeType = matches[1];
      const base64Data = matches[2];

      contents = [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: `
            당신은 전문 피트니스 트레이너입니다. 이 사진에 찍힌 헬스장 기구를 분석해주세요.
            다음 항목을 포함하여 알기 쉽게 설명해주세요:
            1. 기구의 정확한 명칭 및 주요 타겟 근육 부위
            2. 올바른 기구 사용법 (초보자 기준 단계별 설명)
            3. 운동 시 주의해야 할 부상 방지 팁
          `,
        },
      ];
    } else {
      contents = `
        당신은 전문 AI 퍼스널 트레이너입니다. 사용자의 신체 정보, 오늘 컨디션, 그리고 직전 세트의 난이도 피드백을 바탕으로 최적의 운동 루틴과 조절된 난이도를 제안해주세요.

        [사용자 신체 정보]
        - 키: ${bodyInfo?.height || '미입력'} cm
        - 체중: ${bodyInfo?.weight || '미입력'} kg
        - 나이: ${bodyInfo?.age || '미입력'}세
        - 운동 목적: ${bodyInfo?.goal || '체력 증진'}

        [오늘의 컨디션]
        - ${condition || '보통'}

        [직전 세트 피드백 (힘든 정도)]
        - ${feedback || '보통 (적당함)'}

        위 내용을 바탕으로 다음 항목을 보기 쉽게 구성하여 답변해주세요:
        1. 오늘 추천하는 맞춤 운동 루틴 및 종목
        2. 직전 세트 피드백을 반영한 난이도 조정 제안 (무게, 횟수, 휴식 시간 변경 등 - 힘이 들면 쉽게, 쉬우면 어렵게 조절)
        3. 동기부여를 위한 트레이너의 한 줄 조언
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: contents,
    });

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'AI 응답 생성 중 오류가 발생했습니다.' });
  }
}
