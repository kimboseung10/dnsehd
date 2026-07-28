import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// ---------------------------------------------------------
// 운동 도감 데이터 (부위별 정확히 5개씩, 추가된 부위 포함)
// ---------------------------------------------------------
const FITNESS_DICTIONARY = {
  '가슴': [
    { name: '벤치 프레스', target: { front: ['chest'], back: [] }, desc: '대흉근 전체의 매스와 근력을 키우는 최고의 상체 운동', tip: '견갑을 고정하고 가슴 위쪽으로 밀어 올립니다.' },
    { name: '인클라인 벤치 프레스', target: { front: ['chest'], back: [] }, desc: '상부 가슴 발달에 효과적인 경사 벤치 운동', tip: '쇄골 라인을 향해 바를 내렸다가 밀어냅니다.' },
    { name: '펙 덱 플라이', target: { front: ['chest'], back: [] }, desc: '초보자도 안전하게 가슴 안쪽 자극을 느끼는 기구', tip: '어깨가 뒤로 젖혀지지 않게 유의합니다.' },
    { name: '푸시 업', target: { front: ['chest', 'abs'], back: [] }, desc: '코어와 가슴 전체를 단련하는 대표 맨몸 운동', tip: '몸이 일직선이 되도록 유지합니다.' },
    { name: '딥스', target: { front: ['chest'], back: [] }, desc: '하부 가슴과 삼두를 발달시키는 맨몸 복합 운동', tip: '상체를 살짝 앞으로 숙여 가슴에 집중합니다.' }
  ],
  '등': [
    { name: '랫 풀 다운', target: { front: [], back: ['back'] }, desc: '광배근 상부와 외곽을 넓혀주는 필수 머신', tip: '가슴을 위로 연 채 쇄골 방향으로 당깁니다.' },
    { name: '바벨 로우', target: { front: [], back: ['back'] }, desc: '등의 두께감을 키우는 고중량 복합 운동', tip: '상체를 숙이고 아랫배 쪽으로 당겨줍니다.' },
    { name: '시티드 케이블 로우', target: { front: [], back: ['back'] }, desc: '등 중앙부와 능형근을 타격하는 머신', tip: '허리를 곧게 펴고 배꼽 쪽으로 당깁니다.' },
    { name: '풀 업', target: { front: [], back: ['back'] }, desc: '등 넓이와 상체 전반의 근력을 키우는 맨몸 운동', tip: '광배근의 힘으로 몸을 위로 끌어올립니다.' },
    { name: '데드리프트', target: { front: [], back: ['back', 'glutes'] }, desc: '후면 사슬 전체를 강화하는 웨이트의 왕', tip: '허리가 굽지 않도록 복압을 단단히 유지합니다.' }
  ],
  '어깨': [
    { name: '오버헤드 프레스', target: { front: ['shoulders'], back: [] }, desc: '전면 삼각근과 상체 코어를 키우는 대표 바벨 운동', tip: '코어에 힘을 주고 수직으로 밀어 올립니다.' },
    { name: '사이드 레터럴 레이즈', target: { front: ['shoulders'], back: [] }, desc: '어깨 측면의 넓이를 만들어 주는 필수 고립 운동', tip: '팔꿈치가 손목보다 살짝 위를 향하게 들어 올립니다.' },
    { name: '벤트 오버 레이즈', target: { front: [], back: ['shoulders'] }, desc: '후면 삼각근 타격 운동', tip: '상체를 숙인 채 팔을 바깥쪽으로 밀어냅니다.' },
    { name: '덤벨 숄더 프레스', target: { front: ['shoulders'], back: [] }, desc: '안정성과 가동범위를 넓혀주는 어깨 운동', tip: '귀 라인 수평에서 수직으로 밀어 올립니다.' },
    { name: '프론트 레이즈', target: { front: ['shoulders'], back: [] }, desc: '전면 삼각근을 고립하여 타격하는 운동', tip: '반동을 최소화하며 눈높이까지만 들어 올립니다.' }
  ],
  '하체': [
    { name: '바벨 백 스쿼트', target: { front: ['legs'], back: ['glutes', 'legs'] }, desc: '하체 전반과 코어를 강화하는 헬스의 꽃', tip: '무릎과 발끝 방향을 일치시키고 깊게 앉습니다.' },
    { name: '레그 프레스', target: { front: ['legs'], back: ['glutes'] }, desc: '허리 부담을 줄이고 안정적으로 고중량을 다루는 기구', tip: '무릎이 완전히 펴지기 직전까지만 밀어냅니다.' },
    { name: '레그 익스텐션', target: { front: ['legs'], back: [] }, desc: '허벅지 앞쪽(대퇴사두근)을 고립·분리하는 머신', tip: '무릎 패드가 정강이 하단에 오도록 맞췄습니다.' },
    { name: '레그 컬', target: { front: [], back: ['legs'] }, desc: '허벅지 뒤쪽(햄스트링)을 단련하는 머신 운동', tip: '엉덩이가 들리지 않도록 패드에 고정합니다.' },
    { name: '런지', target: { front: ['legs'], back: ['glutes'] }, desc: '균형 감각과 하체 근육을 동시에 잡는 운동', tip: '무릎이 바닥에 닿지 않을 정도로 수직으로 내려갑니다.' }
  ],
  '이두': [
    { name: '바벨 컬', target: { front: ['shoulders'], back: [] }, desc: '이두근의 전체적인 크기를 키우는 대표 운동', tip: '팔꿈치를 옆구리에 고정하고 들어 올립니다.' },
    { name: '덤벨 컬', target: { front: ['shoulders'], back: [] }, desc: '좌우 균형을 맞추며 이두근을 수축하는 운동', tip: '손목을 바깥쪽으로 살짝 돌려주며 수축합니다.' },
    { name: '해머 컬', target: { front: ['shoulders'], back: [] }, desc: '상완근과 전완근을 동시에 자극하는 운동', tip: '망치를 쥐듯 손바닥이 마주보게 잡고 들어 올립니다.' },
    { name: '케이블 컬', target: { front: ['shoulders'], back: [] }, desc: '케이블의 장력을 이용해 지속적인 자극을 주는 운동', tip: '팔꿈치가 앞뒤로 움직이지 않게 고정합니다.' },
    { name: '컨센트레이션 컬', target: { front: ['shoulders'], back: [] }, desc: '앉아서 이두근을 최고조로 고립하는 운동', tip: '팔꿈치를 허벅지 안쪽에 단단히 지지합니다.' }
  ],
  '삼두': [
    { name: '랫 푸시 다운', target: { front: [], back: [] }, desc: '삼두근 외측을 탄탄하게 만들어주는 대표 머신 운동', tip: '상체를 살짝 숙인 채 팔꿈치를 몸통에 붙입니다.' },
    { name: '오버헤드 삼두 익스텐션', target: { front: [], back: [] }, desc: '삼두근 장두를 늘려주어 볼륨을 키우는 운동', tip: '팔꿈치가 귀에 바짝 붙은 상태를 유지합니다.' },
    { name: '라잉 트라이셉스 익스텐션', target: { front: [], back: [] }, desc: '누워서 고중량을 다루며 삼두 전체를 키우는 운동', tip: '이마 혹은 머리 뒤쪽으로 바를 내립니다.' },
    { name: '벤치 딥스', target: { front: [], back: [] }, desc: '맨몸으로 삼두와 가슴 하부를 자극하는 운동', tip: '엉덩이가 벤치에서 너무 멀어지지 않게 합니다.' },
    { name: '클로즈 그립 벤치 프레스', target: { front: ['chest'], back: [] }, desc: '좁은 그립으로 삼두와 가슴 안쪽을 타격하는 운동', tip: '손 간격을 어깨너비보다 좁게 잡고 내립니다.' }
  ],
  '전완근': [
    { name: '리스트 컬', target: { front: [], back: [] }, desc: '손목 굴곡근을 강화하여 악력을 높이는 운동', tip: '벤치에 팔을 올리고 손목만 움직여 바벨을 내렸다가 말아 올립니다.' },
    { name: '리버스 리스트 컬', target: { front: [], back: [] }, desc: '전완근 상단과 신전근을 강화하는 운동', tip: '손등이 위로 향하게 잡고 손목을 위로 젖힙니다.' },
    { name: '파머스 워크', target: { front: [], back: [] }, desc: '무거운 덤벨을 들고 걸으며 전신 악력을 기르는 운동', tip: '허리를 곧게 펴고 코어에 힘을 준 채 전진합니다.' },
    { name: '추 감기', target: { front: [], back: [] }, desc: '봉에 매달린 추를 감아 올리며 전완근을 불태우는 운동', tip: '팔을 쭉 펴고 손목 스냅만 이용해 말아 올립니다.' },
    { name: '데드 헹잉', target: { front: [], back: ['back'] }, desc: '철봉에 매달려 악력과 전완 지구력을 키우는 운동', tip: '힘을 빼고 전완근의 긴장을 유지하며 매달립니다.' }
  ],
  '복근': [
    { name: '크런치', target: { front: ['abs'], back: [] }, desc: '상복부를 집중 수축하여 선명도를 높이는 코어 운동', tip: '허리가 바닥에서 떨어지지 않게 상복부만 말아 올립니다.' },
    { name: '행잉 레그 레이즈', target: { front: ['abs'], back: [] }, desc: '매달려서 다리를 들어 올리며 하복부 단련', tip: '골반을 위로 말아 올리듯 수축합니다.' },
    { name: '플랭크', target: { front: ['abs'], back: [] }, desc: '척추기립근과 복부 전반의 버티는 힘을 기르는 코어 운동', tip: '엉덩이가 들리거나 허리가 꺾이지 않게 일직선을 유지합니다.' },
    { name: '바이시클 크런치', target: { front: ['abs'], back: [] }, desc: '복사근과 상하복부를 동시에 자극하는 입체 운동', tip: '팔꿈치와 반대쪽 무릎이 닿도록 비틀어줍니다.' },
    { name: '레그 레이즈', target: { front: ['abs'], back: [] }, desc: '바닥에 누워 하복부의 근력을 키우는 운동', tip: '허리가 바닥에서 뜨지 않도록 복부에 계속 힘을 줍니다.' }
  ]
};

// 성인 남성 인체 모형 컴포넌트
const HumanBodyViewer = ({ target }) => {
  const frontParts = target?.front || [];
  const backParts = target?.back || [];

  return (
    <div style={{display: 'flex', justifyContent: 'center', gap: '30px', margin: '15px 0'}}>
      <div style={{textAlign: 'center'}}>
        <span style={{fontSize: '12px', color: '#38bdf8', display: 'block', marginBottom: '5px'}}>전면 근육</span>
        <svg width="90" height="160" viewBox="0 0 100 180" style={{background: '#020617', borderRadius: '8px', border: '1px solid #334155'}}>
          <circle cx="50" cy="20" r="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <path 
            d="M 35 35 L 65 35 L 75 55 L 60 90 L 40 90 L 25 55 Z" 
            fill={frontParts.includes('chest') || frontParts.includes('shoulders') ? '#f43f5e' : '#1e293b'} 
            stroke="#475569" strokeWidth="1.5" 
          />
          <rect 
            x="42" y="60" width="16" height="30" rx="3" 
            fill={frontParts.includes('abs') ? '#f43f5e' : '#1e293b'} 
            stroke="#475569" strokeWidth="1" 
          />
          <path 
            d="M 40 95 L 48 95 L 46 150 L 38 150 Z M 52 95 L 60 95 L 62 150 L 54 150 Z" 
            fill={frontParts.includes('legs') ? '#f43f5e' : '#1e293b'} 
            stroke="#475569" strokeWidth="1.5" 
          />
        </svg>
      </div>

      <div style={{textAlign: 'center'}}>
        <span style={{fontSize: '12px', color: '#38bdf8', display: 'block', marginBottom: '5px'}}>후면 근육</span>
        <svg width="90" height="160" viewBox="0 0 100 180" style={{background: '#020617', borderRadius: '8px', border: '1px solid #334155'}}>
          <circle cx="50" cy="20" r="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <path 
            d="M 35 35 L 65 35 L 75 55 L 60 90 L 40 90 L 25 55 Z" 
            fill={backParts.includes('back') || backParts.includes('shoulders') ? '#f43f5e' : '#1e293b'} 
            stroke="#475569" strokeWidth="1.5" 
          />
          <rect 
            x="38" y="90" width="24" height="20" rx="4" 
            fill={backParts.includes('glutes') ? '#f43f5e' : '#1e293b'} 
            stroke="#475569" strokeWidth="1" 
          />
          <path 
            d="M 40 112 L 48 112 L 46 150 L 38 150 Z M 52 112 L 60 112 L 62 150 L 54 150 Z" 
            fill={backParts.includes('legs') ? '#f43f5e' : '#1e293b'} 
            stroke="#475569" strokeWidth="1.5" 
          />
        </svg>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('record');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('workout_history_v12');
      return saved ? JSON.parse(saved) : [
        { date: '2026-07-01', weight: 72.5, muscle: 31.5 },
        { date: '2026-07-15', weight: 71.8, muscle: 31.8 },
      ];
    } catch {
      return [];
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const [inputDate, setInputDate] = useState(todayStr);
  const [inputWeight, setInputWeight] = useState('');
  const [inputMuscle, setInputMuscle] = useState('');

  const [currentDateObj, setCurrentDateObj] = useState(new Date());
  const viewYear = currentDateObj.getFullYear();
  const viewMonth = currentDateObj.getMonth();

  const [bodyInfo, setBodyInfo] = useState({ height: '', weight: '', goal: '다이어트', targetPart: '가슴' });
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [recognizedMachine, setRecognizedMachine] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('workout_history_v12', JSON.stringify(historyList));
    } catch (e) {
      console.error(e);
    }
  }, [historyList]);

  const handlePrevMonth = () => setCurrentDateObj(new Date(viewYear, viewMonth - 1, 1));
  const handleNextMonth = () => setCurrentDateObj(new Date(viewYear, viewMonth + 1, 1));

  const handleSelectDate = (dateString) => {
    setInputDate(dateString);
    const found = historyList.find(item => item.date === dateString);
    if (found) {
      setInputWeight(found.weight || '');
      setInputMuscle(found.muscle || '');
    } else {
      setInputWeight('');
      setInputMuscle('');
    }
  };

  const handleSaveRecord = (e) => {
    e.preventDefault();
    if (!inputWeight || !inputMuscle) {
      alert('체중과 근육량을 입력해주세요.');
      return;
    }
    const newItem = {
      date: inputDate,
      weight: parseFloat(inputWeight),
      muscle: parseFloat(inputMuscle)
    };

    setHistoryList(prev => {
      const idx = prev.findIndex(item => item.date === inputDate);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newItem;
        return updated.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else {
        return [...prev, newItem].sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    });
    alert('저장되었습니다.');
  };

  const monthString = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
  const currentMonthRecords = historyList
    .filter(item => item.date.startsWith(monthString))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const renderMonthPolylinePoints = (dataKey, minVal, maxVal) => {
    const width = 300;
    const height = 140;
    if (currentMonthRecords.length === 0) return "";
    const range = maxVal - minVal;
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    
    return currentMonthRecords.map((item) => {
      const day = parseInt(item.date.split('-')[2], 10);
      const x = ((day - 1) / (daysInCurrentMonth - 1)) * (width - 30) + 15;
      const val = item[dataKey] || minVal;
      const clampedVal = Math.max(minVal, Math.min(maxVal, val));
      const y = height - 25 - ((clampedVal - minVal) / range) * (height - 50);
      return `${x},${y}`;
    }).join(" ");
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }

  const yAxisTicksKg = [120, 100, 80, 60, 40, 20];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setRecognizedMachine('사진 분석 중...');
    setTimeout(() => {
      setRecognizedMachine('🔍 분석 완료: [펙 덱 플라이 머신] (가슴 안쪽 고립 운동에 적합합니다.)');
    }, 1200);
  };

  // AI 코칭 생성 함수 (다시 만들기 기능 지원)
  const generateAiRoutine = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const variations = [
      `[AI 맞춤 종목 코칭 결과]\n- 목표: ${bodyInfo.goal} (${bodyInfo.targetPart} 집중)\n\n1. [바벨 벤치 프레스] - 바벨을 이용해 메인 가슴 운동 4세트 (8~10회)\n2. [인클라인 덤벨 프레스] - 덤벨로 상부 가슴 고립 3세트 (12회)\n3. [펙 덱 플라이 머신] - 머신을 활용해 안쪽 수축 3세트 (15회)\n4. [케이블 푸시 다운] - 삼두 보조 운동 3세트\n\n💡 팁: 중량보다는 타겟 근육의 이완과 수축에 집중하세요!`,
      `[AI 맞춤 종목 코칭 결과 (새로운 버전)]\n- 목표: ${bodyInfo.goal} (${bodyInfo.targetPart} 집중 고강도 루틴)\n\n1. [인클라인 벤치 프레스] - 상부 중심 5세트 (8회)\n2. [딥스] - 맨몸 하부 가슴 타격 4세트\n3. [푸시 업] - 마무리 펌핑 3세트\n\n💡 팁: 세트 간 휴식 시간은 60초를 엄수하세요!`
    ];
    const randomRoutine = variations[Math.floor(Math.random() * variations.length)];
    setAiResponse(randomRoutine);
    setLoading(false);
  };

  return (
    <div className="container" style={{maxWidth: '600px', margin: '0 auto', padding: '15px', background: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif'}}>
      <h2 style={{textAlign: 'center', color: '#38bdf8', marginBottom: '15px'}}>🏋️ 스마트 피트니스 & 도감</h2>
      
      <div className="tab-menu" style={{display: 'flex', gap: '5px', marginBottom: '15px'}}>
        <button style={{flex: 1, padding: '10px', background: activeTab === 'record' ? '#38bdf8' : '#1e293b', color: activeTab === 'record' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => setActiveTab('record')}>📊 그래프 & 기록</button>
        <button style={{flex: 1, padding: '10px', background: activeTab === 'dictionary' ? '#38bdf8' : '#1e293b', color: activeTab === 'dictionary' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => setActiveTab('dictionary')}>📖 운동 도감</button>
        <button style={{flex: 1, padding: '10px', background: activeTab === 'routine' ? '#38bdf8' : '#1e293b', color: activeTab === 'routine' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => setActiveTab('routine')}>맞춤 루틴 & 기구인식</button>
      </div>

      {activeTab === 'record' && (
        <div style={{background: '#0f172a', padding: '15px', borderRadius: '10px', border: '1px solid #334155'}}>
          <h3>📅 캘린더</h3>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}}>
            <button onClick={handlePrevMonth} style={{padding: '5px 10px', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>◀ 이전달</button>
            <span style={{fontWeight: 'bold', color: '#38bdf8'}}>{viewYear}년 {viewMonth + 1}월</span>
            <button onClick={handleNextMonth} style={{padding: '5px 10px', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>다음달 ▶</button>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '15px'}}>
            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => <div key={i} style={{fontSize: '12px', color: '#94a3b8'}}>{d}</div>)}
            {calendarDays.map((dateStr, idx) => {
              if (!dateStr) return <div key={idx}></div>;
              const dayNum = parseInt(dateStr.split('-')[2], 10);
              const hasRecord = historyList.some(item => item.date === dateStr);
              const isSelected = inputDate === dateStr;
              return (
                <div key={idx} onClick={() => handleSelectDate(dateStr)} style={{padding: '8px 0', background: isSelected ? '#38bdf8' : hasRecord ? '#1e293b' : '#020617', color: isSelected ? '#000' : '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: isSelected ? 'bold' : 'normal'}}>
                  {dayNum}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSaveRecord} style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{fontSize: '13px', color: '#38bdf8'}}>선택일: {inputDate}</span>
              <input type="date" value={inputDate} onChange={e => handleSelectDate(e.target.value)} style={{background: '#020617', color: '#fff', border: '1px solid #334155', padding: '4px', borderRadius: '4px'}} />
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <input type="number" step="0.1" placeholder="체중 (kg)" value={inputWeight} onChange={e => setInputWeight(e.target.value)} style={{flex: 1, padding: '8px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '4px'}} />
              <input type="number" step="0.1" placeholder="근육량 (kg)" value={inputMuscle} onChange={e => setInputMuscle(e.target.value)} style={{flex: 1, padding: '8px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '4px'}} />
            </div>
            <button type="submit" style={{padding: '10px', background: '#38bdf8', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>기록 저장</button>
          </form>

          <div style={{background: '#020617', padding: '10px', borderRadius: '8px'}}>
            <h4 style={{margin: '0 0 10px 0', fontSize: '14px', color: '#38bdf8'}}>📈 체중 & 근육량 추이 (20kg ~ 120kg)</h4>
            <div style={{display: 'flex', position: 'relative'}}>
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', paddingRight: '5px', textAlign: 'right', width: '35px', height: '140px'}}>
                {yAxisTicksKg.map((t, i) => <span key={i}>{t}kg</span>)}
              </div>
              <div style={{flex: 1, position: 'relative', height: '140px'}}>
                <svg viewBox="0 0 300 140" style={{width: '100%', height: '140px', overflow: 'visible'}}>
                  {yAxisTicksKg.map((_, i) => (
                    <line key={i} x1="0" y1={i * 28} x2="300" y2={i * 28} stroke="#1e293b" strokeWidth="1" />
                  ))}
                  <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" points={renderMonthPolylinePoints('weight', 20, 120)} />
                  <polyline fill="none" stroke="#4ade80" strokeWidth="2.5" points={renderMonthPolylinePoints('muscle', 20, 120)} />
                </svg>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '6px'}}>
                  <span>1일</span>
                  <span>15일</span>
                  <span>말일</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dictionary' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div style={{background: '#0f172a', padding: '15px', borderRadius: '10px', border: '1px solid #334155'}}>
            <h3>📖 운동 도감</h3>
            <p style={{fontSize: '12px', color: '#94a3b8', marginBottom: '15px'}}>운동 이름을 누르면 상세 설명과 인체 모형 타겟 부위가 표시됩니다.</p>

            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {Object.entries(FITNESS_DICTIONARY).map(([part, exs]) => (
                <div key={part} style={{background: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b'}}>
                  <h4 style={{color: '#38bdf8', margin: '0 0 8px 0', fontSize: '14px'}}>💪 {part}</h4>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                    {exs.map((ex, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedExercise(ex)} 
                        style={{
                          padding: '6px 12px', 
                          background: selectedExercise?.name === ex.name ? '#38bdf8' : '#1e293b', 
                          color: selectedExercise?.name === ex.name ? '#000' : '#fff', 
                          border: '1px solid #334155', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          fontSize: '13px'
                        }}
                      >
                        {ex.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedExercise && (
            <div style={{background: '#0f172a', padding: '15px', borderRadius: '10px', border: '2px solid #38bdf8'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                <h3 style={{margin: 0, color: '#38bdf8'}}>{selectedExercise.name}</h3>
                <button onClick={() => setSelectedExercise(null)} style={{background: '#f43f5e', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>닫기 ✖</button>
              </div>
              <p style={{fontSize: '13px', color: '#cbd5e1', margin: '0 0 8px 0'}}><strong>설명:</strong> {selectedExercise.desc}</p>
              <p style={{fontSize: '13px', color: '#cbd5e1', margin: '0 0 12px 0'}}><strong>주의점:</strong> {selectedExercise.tip}</p>

              <div style={{background: '#020617', padding: '10px', borderRadius: '6px', textAlign: 'center'}}>
                <span style={{fontSize: '12px', color: '#38bdf8', display: 'block', marginBottom: '5px'}}>🎯 자극되는 근육 부위</span>
                <HumanBodyViewer target={selectedExercise.target} />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'routine' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div style={{background: '#0f172a', padding: '15px', borderRadius: '10px', border: '1px solid #334155'}}>
            <h3>📸 기구 인식 기능</h3>
            <p style={{fontSize: '12px', color: '#94a3b8', marginBottom: '10px'}}>헬스장 기구 사진을 찍거나 업로드하면 어떤 기구인지 AI가 판별합니다.</p>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{display: 'none'}} />
            <button onClick={() => fileInputRef.current.click()} style={{width: '100%', padding: '10px', background: '#1e293b', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}}>
              📷 기구 사진 찍기 / 업로드하기
            </button>
            {recognizedMachine && (
              <div style={{marginTop: '10px', padding: '10px', background: '#020617', borderRadius: '6px', fontSize: '13px', color: '#4ade80'}}>
                {recognizedMachine}
              </div>
            )}
          </div>

          <div style={{background: '#0f172a', padding: '15px', borderRadius: '10px', border: '1px solid #334155'}}>
            <h3>🏋️ 디테일한 AI 코칭 루틴</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{display: 'flex', gap: '10px'}}>
                <input type="number" placeholder="키 (cm)" value={bodyInfo.height} onChange={e => setBodyInfo({...bodyInfo, height: e.target.value})} style={{flex: 1, padding: '10px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px'}} />
                <input type="number" placeholder="체중 (kg)" value={bodyInfo.weight} onChange={e => setBodyInfo({...bodyInfo, weight: e.target.value})} style={{flex: 1, padding: '10px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px'}} />
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <select value={bodyInfo.goal} onChange={e => setBodyInfo({...bodyInfo, goal: e.target.value})} style={{flex: 1, padding: '10px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px'}}>
                  <option value="다이어트">다이어트</option>
                  <option value="근비대">근비대</option>
                </select>
                <select value={bodyInfo.targetPart} onChange={e => setBodyInfo({...bodyInfo, targetPart: e.target.value})} style={{flex: 1, padding: '10px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px'}}>
                  <option value="가슴">가슴</option>
                  <option value="등">등</option>
                  <option value="어깨">어깨</option>
                  <option value="하체">하체</option>
                  <option value="이두">이두</option>
                  <option value="삼두">삼두</option>
                  <option value="전완근">전완근</option>
                  <option value="복근">복근</option>
                </select>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button type="button" onClick={generateAiRoutine} disabled={loading} style={{flex: 2, padding: '12px', background: '#38bdf8', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>
                  {loading ? '분석 중...' : '디테일 맞춤 루틴 받기'}
                </button>
                {/* 코칭 마음에 안들면 다시 만들기 버튼 추가 */}
                {aiResponse && (
                  <button type="button" onClick={generateAiRoutine} disabled={loading} style={{flex: 1, padding: '12px', background: '#334155', color: '#38bdf8', fontWeight: 'bold', border: '1px solid #38bdf8', borderRadius: '6px', cursor: 'pointer'}}>
                    🔄 다시 만들기
                  </button>
                )}
              </div>
            </div>

            {aiResponse && (
              <div style={{marginTop: '15px', background: '#020617', padding: '15px', borderRadius: '8px', border: '1px solid #38bdf8'}}>
                <h4 style={{margin: '0 0 8px 0', color: '#38bdf8'}}>💡 AI 코칭 결과</h4>
                <div style={{whiteSpace: 'pre-line', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5'}}>{aiResponse}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
