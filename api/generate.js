import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed' 
    }));
  }

  try {
    const { height, weight, goal, targetPart } = req.body;
    
    // 환경 변수에서 API 키 가져오기
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      사용자 정보: 키 ${height}cm, 체중 ${weight}kg
      목표: ${goal}
      집중 타겟 부위: ${targetPart}
      위 조건에 맞는 전문적이고 디테일한 맞춤 운동 루틴을 세트 수, 횟수, 팁과 함께 작성해줘.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite', // 정확한 모델명 사용
      contents: prompt,
    });

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
