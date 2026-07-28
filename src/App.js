import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// ---------------------------------------------------------
// 1. 데이터: 모든 부위의 방대한 운동 및 근육 타겟 정보 도감
// ---------------------------------------------------------
const FITNESS_DICTIONARY = {
  '가슴': [
    { name: '벤치 프레스', type: '바벨', target: ['chest'], desc: '대흉근 전체의 매스와 근력을 키우는 최고의 상체 운동', tip: '견갑을 고정하고 가슴 위쪽으로 밀어 올립니다.' },
    { name: '인클라인 벤치 프레스', type: '바벨', target: ['chest'], desc: '상부 가슴 발달에 효과적인 경사 벤치 운동', tip: '쇄골 라인을 향해 바를 내렸다가 밀어냅니다.' },
    { name: '디클라인 벤치 프레스', type: '바벨', target: ['chest'], desc: '하부 가슴 라인을 선명하게 다듬는 운동', tip: '허리가 뜨지 않도록 주의하며 하흉부에 집중합니다.' },
    { name: '덤벨 플라이', type: '덤벨', target: ['chest'], desc: '가슴을 넓게 이완시키며 안쪽을 수축하는 고립 운동', tip: '팔꿈치를 살짝 고정하고 포옹하듯 모아줍니다.' },
    { name: '펙 덱 플라이', type: '머신', target: ['chest'], desc: '초보자도 안전하게 가슴 안쪽 자극을 느끼는 기구', tip: '어깨가 뒤로 젖혀지지 않게 유의합니다.' },
    { name: '케이블 크로스 오버', type: '케이블', desc: '운동 범위 내내 지속적인 장력을 주는 흉근 운동', tip: '손을 모을 때 가슴을 최대한 조여줍니다.' },
    { name: '푸시 업', type: '맨몸', target: ['chest', 'abs'], desc: '코어와 가슴 전체를 단련하는 대표 맨몸 운동', tip: '몸이 일직선이 되도록 유지합니다.' }
  ],
  '등': [
    { name: '랫 풀 다운', type: '머신', target: ['back'], desc: '광배근 상부와 외곽을 넓혀주는 필수 머신', tip: '가슴을 위로 연 채 쇄골 방향으로 당깁니다.' },
    { name: '바벨 로우', type: '바벨', target: ['back'], desc: '등의 두께감을 키우는 고중량 복합 운동', tip: '상체를 숙이고 아랫배 쪽으로 당겨줍니다.' },
    { name: '시티드 케이블 로우', type: '케이블', target: ['back'], desc: '등 중앙부와 능형근을 타격하는 머신', tip: '허리를 곧게 펴고 배꼽 쪽으로 당깁니다.' },
    { name: '원 암 덤벨 로우', type: '덤벨', target: ['back'], desc: '좌우 불균형을 교정하고 광배근 하부를 수축', tip: '상체가 회전하지 않도록 고정합니다.' },
    { name: '풀 업 (턱걸이)', type: '맨몸', target: ['back'], desc: '상체 등 근육 전반을 다루는 최고의 맨몸 운동', tip: '어깨를 내린 상태에서 가슴이 바에 닿는 느낌으로 올라갑니다.' },
    { name: '루마니안 데드리프트', type: '바벨', target: ['back', 'glutes', 'legs'], desc: '등 후면 전체와 햄스트링을 단련하는 3대 운동', tip: '바가 정강이와 허벅지에 밀착해서 오르내리게 합니다.' }
  ],
  '어깨': [
    { name: '오버헤드 프레스', type: '바벨', target: ['shoulders'], desc: '전면 삼각근과 상체 코어를 키우는 대표 바벨 운동', tip: '코어에 힘을 주고 수직으로 밀어 올립니다.' },
    { name: '덤벨 숄더 프레스', type: '덤벨', target: ['shoulders'], desc: '가동범위를 넓게 가져가는 어깨 볼륨 운동', tip: '손목이 꺾이지 않도록 수직 정렬을 맞춥니다.' },
    { name: '숄더 프레스 머신', type: '머신', target: ['shoulders'], desc: '안전하게 고중량을 다루는 어깨 기구', tip: '안장 높이를 조절하여 어깨 라인에 맞춥니다.' },
    { name: '사이드 레터럴 레이즈', type: '덤벨', target: ['shoulders'], desc: '어깨 측면의 넓이를 만들어 주는 필수 고립 운동', tip: '팔꿈치가 손목보다 살짝 위를 향하게 들어 올립니다.' },
    { name: '프론트 레이즈', type: '덤벨', target: ['shoulders'], desc: '어깨 전면의 분리도를 높여주는 운동', tip: '반동을 최소화하며 눈높이까지만 들어 올립니다.' },
    { name: '벤트 오버 레이즈', type: '덤벨', target: ['shoulders'], desc: '옷핏을 살려주는 후면 삼각근 타격 운동', tip: '상체를 숙인 채 팔을 바깥쪽으로 밀어냅니다.' },
    { name: '페이스 풀', type: '케이블', target: ['shoulders'], desc: '후면 삼각근과 회전근개를 강화하는 운동', tip: '얼굴을 향해 당기며 팔꿈치를 바깥으로 벌립니다.' }
  ],
  '이두': [
    { name: '바벨 컬', type: '바벨', target: ['arms'], desc: '이두근의 전체적인 매스를 키우는 기본 운동', tip: '팔꿈치 위치를 옆구리에 고정하고 들어 올립니다.' },
    { name: '덤벨 컬', type: '덤벨', target: ['arms'], desc: '손목을 회전하며 이두근의 최대 수축을 유도', tip: '올라갈 때 손바닥이 하늘을 보게 회전시킵니다.' },
    { name: '해머 컬', type: '덤벨', target: ['arms'], desc: '상완근과 전완근을 동시 타격하는 중립 그립 운동', tip: '손바닥이 마주 보는 상태를 유지합니다.' },
    { name: '프리처 컬', type: '머신', target: ['arms'], desc: '팔을 고정한 상태로 이두 하부를 수축', tip: '패드에 겨드랑이와 팔을 완전히 밀착시킵니다.' }
  ],
  '삼두': [
    { name: '스컬 크러셔', type: '바벨', target: ['arms'], desc: '삼두근 장두와 전체적인 두께를 키우는 대표 운동', tip: '팔꿈치가 벌어지지 않게 고정하고 이마 쪽으로 내립니다.' },
    { name: '케이블 푸시 다운', type: '케이블', target: ['arms'], desc: '초보자도 쉽게 삼두근 수축을 느끼는 기구', tip: '팔꿈치를 몸통에 붙인 채 아래로 밀어냅니다.' },
    { name: '오버헤드 덤벨 익스텐션', type: '덤벨', target: ['arms'], desc: '머리 위로 들어 올려 삼두근 장두를 스트레칭', tip: '상완을 고정하고 귀 옆으로 덤벨을 내립니다.' },
    { name: '딥스', type: '맨몸', target: ['chest', 'arms'], desc: '가슴 하부와 삼두근을 동시에 자극하는 복합 운동', tip: '상체를 앞으로 숙이면 가슴, 세우면 삼두에 집중됩니다.' }
  ],
  '전완근': [
    { name: '리스트 컬', type: '바벨', target: ['arms'], desc: '전완근 안쪽(굴근)을 두껍게 만드는 손목 운동', tip: '손목을 최대한 젖혔다가 손끝으로 말아 쥡니다.' },
    { name: '리버스 리스트 컬', type: '바벨', target: ['arms'], desc: '전완근 바깥쪽(신근)을 다듬는 운동', tip: '손등이 위로 향하게 잡고 위로 들어 올립니다.' },
    { name: '파머스 워크', type: '덤벨', target: ['arms', 'glutes', 'legs'], desc: '무거운 덤벨을 들고 걸으며 악력과 코어 강화', tip: '어깨가 말리지 않도록 가슴을 펴고 걷습니다.' }
  ],
  '복근': [
    { name: '크런치', type: '맨몸', target: ['abs'], desc: '상복부를 집중 수축하여 선명도를 높이는 코어 운동', tip: '허리가 바닥에서 떨어지지 않게 상복부만 말아 올립니다.' },
    { name: '행잉 레그 레이즈', type: '맨몸', target: ['abs'], desc: '매달려서 다리를 들어 올리며 하복부 단련', tip: '골반을 위로 말아 올리듯 수축합니다.' },
    { name: '케이블 크런치', type: '케이블', target: ['abs'], desc: '중량을 추가하여 상복부에 강한 부하를 주는 운동', tip: '무릎을 꿇은 상태로 복부의 힘으로만 상체를 숙입니다.' },
    { name: '플랭크', type: '맨몸', target: ['abs'], desc: '전신 코어 안정성을 잡는 정적 운동', tip: '엉덩이가 들리거나 허리가 꺾이지 않게 일직선을 유지합니다.' },
    { name: '러시안 트위스트', type: '맨몸', target: ['abs'], desc: '상체를 비틀어 옆구리를 정리하는 운동', tip: '척추가 굽지 않도록 주의하며 복부 회전에 집중합니다.' }
  ],
  '하체': [
    { name: '바벨 백 스쿼트', type: '바벨', target: ['glutes', 'legs'], desc: '하체 전반과 코어를 강화하는 헬스의 꽃', tip: '무릎과 발끝 방향을 일치시키고 깊게 앉습니다.' },
    { name: '레그 프레스', type: '머신', target: ['legs', 'glutes'], desc: '허리 부담을 줄이고 안정적으로 고중량을 다루는 기구', tip: '무릎이 완전히 펴지기 직전까지만 밀어냅니다.' },
    { name: '레그 익스텐션', type: '머신', target: ['legs'], desc: '허벅지 앞쪽(대퇴사두근)을 고립·분리하는 머신', tip: '무릎 패드가 정강이 하단에 오도록 맞춥니다.' },
    { name: '라잉 레그 컬', type: '머신', target: ['legs'], desc: '허벅지 뒤쪽(햄스트링)을 단련하는 엎드리는 기구', tip: '엉덩이가 들리지 않게 상체를 패드에 고정합니다.' },
    { name: '바벨 루마니안 데드리프트', type: '바벨', target: ['glutes', 'legs'], desc: '엉덩이와 햄스트링 후면을 타격하는 최고의 후면 운동', tip: '힙힌지를 사용하여 골반을 뒤로 밀어냅니다.' },
    { name: '스탠딩 카프 레이즈', type: '머신', target: ['legs'], desc: '종아리 근육을 수축·이완하는 운동', tip: '발목을 완전히 늘려준 후 끝까지 까치발을 듭니다.' }
  ],
  '유산소': [
    { name: '트레드밀 (러닝머신)', type: '유산소', target: ['legs'], desc: '속도와 경사도를 조절하여 심폐지구력과 체지방을 연소', tip: '시선은 정면을 향하고 발바닥 전체로 착지합니다.' },
    { name: '실내 사이클', type: '유산소', target: ['legs'], desc: '무릎 관절에 무리를 주지 않는 하체 유산소', tip: '안장 높이를 다리가 완전히 펴지지 않을 정도로 맞춥니다.' },
    { name: '천국의 계단 (스텝밀)', type: '유산소', target: ['glutes', 'legs'], desc: '극악의 칼로리 소모와 하체 탄력을 동시에 잡는 기구', tip: '손잡이에 몸을 기대지 않고 발의 힘으로 오릅니다.' }
  ]
};

function App() {
  const [activeTab, setActiveTab] = useState('record');
  
  const [bodyInfo, setBodyInfo] = useState({ height: '', weight: '', age: '', goal: '다이어트', targetPart: '가슴' });
  const [aiResponse, setAiResponse] = useState('');
  
  // 도감에서 선택된 운동 (클릭 시 상세창 오픈)
  const [selectedExercise, setSelectedExercise] = useState(null);

  // 운동 기록 상태
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('workout_history_v10');
      return saved ? JSON.parse(saved) : [
        { date: '2026-07-01', weight: 72.5, muscle: 31.5, fat: 18.5, part: '가슴' },
        { date: '2026-07-15', weight: 71.8, muscle: 31.8, fat: 18.0, part: '등' },
      ];
    } catch {
      return [];
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const [inputDate, setInputDate] = useState(todayStr);
  const [inputWeight, setInputWeight] = useState('');
  const [inputMuscle, setInputMuscle] = useState('');
  const [inputFat, setInputFat] = useState('');
  const [inputPart, setInputPart] = useState('가슴');

  const [currentDateObj, setCurrentDateObj] = useState(new Date());
  const viewYear = currentDateObj.getFullYear();
  const viewMonth = currentDateObj.getMonth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('workout_history_v10', JSON.stringify(historyList));
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
      setInputFat(found.fat || '');
      setInputPart(found.part || '가슴');
    } else {
      setInputWeight('');
      setInputMuscle('');
      setInputFat('');
      setInputPart('가슴');
    }
  };

  const handleSaveRecord = (e) => {
    e.preventDefault();
    if (!inputWeight || !inputMuscle) {
      alert('체중과 근육량은 필수 입력 항목입니다.');
      return;
    }
    const newItem = {
      date: inputDate,
      weight: parseFloat(inputWeight),
      muscle: parseFloat(inputMuscle),
      fat: inputFat ? parseFloat(inputFat) : 0,
      part: inputPart
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
    alert('기록이 저장되었습니다.');
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
      const x = ((day - 1) / (daysInCurrentMonth - 1)) * (width - 40) + 20;
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

  return (
    <div className="container" style={{maxWidth: '650px', margin: '0 auto', padding: '15px', background: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif'}}>
      <h2 style={{textAlign: 'center', color: '#38bdf8', marginBottom: '15px'}}>🏋️ 스마트 피트니스 & 완전판 운동 도감</h2>
      
      <div className="tab-menu" style={{display: 'flex', gap: '5px', marginBottom: '15px'}}>
        <button style={{flex: 1, padding: '10px', background: activeTab === 'record' ? '#38bdf8' : '#1e293b', color: activeTab === 'record' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => setActiveTab('record')}>📊 그래프 & 기록</button>
        <button style={{flex: 1, padding: '10px', background: activeTab === 'dictionary' ? '#38bdf8' : '#1e293b', color: activeTab === 'dictionary' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => setActiveTab('dictionary')}>📖 운동 도감</button>
        <button style={{flex: 1, padding: '10px', background: activeTab === 'routine' ? '#38bdf8' : '#1e293b', color: activeTab === 'routine' ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => setActiveTab('routine')}>맞춤 루틴</button>
      </div>

      {/* 탭 1: 그래프 & 기록 */}
      {activeTab === 'record' && (
        <div style={{background: '#0f172a', padding: '15px', borderRadius: '10px', border: '1px solid #334155'}}>
          <h3>📅 인터랙티브 캘린더</h3>
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
            <button type="submit" style={{padding: '10px', background: '#38bdf8', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>기록 저장 / 수정</button>
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

      {/* 탭 2: 운동 도감 (이름 버튼 클릭 시 옆/아래에 큰 상세창 및 근육 타겟 표시) */}
      {activeTab === 'dictionary' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div style={{background: '#0f172a', padding: '15px', borderRadius: '10px', border: '1px solid #334155'}}>
            <h3 style={{margin: '0 0 5px 0', color: '#38bdf8'}}>📖 운동 도감</h3>
            <p style={{fontSize: '12px', color: '#94a3b8', margin: '0 0 15px 0'}}>원하는 운동 이름을 누르면 상세 설명과 타겟 근육이 표시됩니다.</p>

            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {Object.entries(FITNESS_DICTIONARY).map(([part, exs]) => (
                <div key={part} style={{background: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b'}}>
                  <h4 style={{color: '#38bdf8', margin: '0 0 8px 0', fontSize: '14px'}}>💪 {part} 부위</h4>
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
                          fontSize: '13px',
                          fontWeight: selectedExercise?.name === ex.name ? 'bold' : 'normal'
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

          {/* 선택한 운동 상세 정보 커다란 창 */}
          {selectedExercise && (
            <div style={{background: '#0f172a', padding: '20px', borderRadius: '10px', border: '2px solid #38bdf8'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                <h3 style={{margin: 0, color: '#38bdf8'}}>{selectedExercise.name} <span style={{fontSize: '12px', background: '#1e293b', color: '#cbd5e1', padding: '2px 6px', borderRadius: '4px'}}>{selectedExercise.type}</span></h3>
                <button onClick={() => setSelectedExercise(null)} style={{background: '#f43f5e', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'}}>닫기 ✖</button>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px'}}>
                <div style={{background: '#020617', padding: '12px', borderRadius: '8px'}}>
                  <strong style={{color: '#38bdf8', display: 'block', marginBottom: '4px'}}>📌 운동 설명</strong>
                  <span style={{color: '#cbd5e1'}}>{selectedExercise.desc}</span>
                </div>

                <div style={{background: '#020617', padding: '12px', borderRadius: '8px'}}>
                  <strong style={{color: '#f43f5e', display: 'block', marginBottom: '4px'}}>⚠️ 주의점 및 수행 팁</strong>
                  <span style={{color: '#cbd5e1'}}>{selectedExercise.tip}</span>
                </div>

                {/* 근육 타겟 시각화 다이어그램 */}
                <div style={{background: '#020617', padding: '12px', borderRadius: '8px', textAlign: 'center'}}>
                  <strong style={{color: '#38bdf8', display: 'block', marginBottom: '10px'}}>🎯 타겟 근육 활성화 부위</strong>
                  <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px'}}>
                      <div style={{
                        width: '70px', height: '120px', 
                        background: selectedExercise.target.some(t => ['chest', 'shoulders', 'abs', 'arms'].includes(t)) ? '#f43f5e' : '#1e293b', 
                        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#fff', boxShadow: '0 0 10px rgba(244,63,94,0.3)'
                      }}>전면</div>
                      <span style={{fontSize: '11px', color: '#94a3b8'}}>전면 자극</span>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px'}}>
                      <div style={{
                        width: '70px', height: '120px', 
                        background: selectedExercise.target.some(t => ['back', 'glutes', 'legs', 'arms'].includes(t)) ? '#f43f5e' : '#1e293b', 
                        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#fff', boxShadow: '0 0 10px rgba(244,63,94,0.3)'
                      }}>후면</div>
                      <span style={{fontSize: '11px', color: '#94a3b8'}}>후면 자극</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 탭 3: 맞춤 루틴 (대칭형 UI) */}
      {activeTab === 'routine' && (
        <div style={{background: '#0f172a', padding: '20px', borderRadius: '10px', border: '1px solid #334155'}}>
          <h3 style={{margin: '0 0 15px 0', color: '#38bdf8'}}>🏋️ 맞춤 루틴 생성</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            await new Promise(r => setTimeout(r, 1000));
            setAiResponse(`[AI 맞춤 프로그램 제안]\n- 목표: ${bodyInfo.goal}\n- 집중 부위: ${bodyInfo.targetPart}\n- 구성: 메인 복합 운동 4세트 + 고립 운동 3세트\n\n꾸준한 수행을 통해 목표를 달성하세요!`);
            setLoading(false);
          }} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{display: 'flex', gap: '10px'}}>
              <input type="number" placeholder="키 (cm)" value={bodyInfo.height} onChange={e => setBodyInfo({...bodyInfo, height: e.target.value})} style={{flex: 1, padding: '12px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px'}} />
              <input type="number" placeholder="체중 (kg)" value={bodyInfo.weight} onChange={e => setBodyInfo({...bodyInfo, weight: e.target.value})} style={{flex: 1, padding: '12px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px'}} />
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <select value={bodyInfo.goal} onChange={e => setBodyInfo({...bodyInfo, goal: e.target.value})} style={{flex: 1, padding: '12px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px'}}>
                <option value="다이어트">다이어트</option>
                <option value="근비대">근비대</option>
              </select>
              <select value={bodyInfo.targetPart} onChange={e => setBodyInfo({...bodyInfo, targetPart: e.target.value})} style={{flex: 1, padding: '12px', background: '#020617', border: '1px solid #334155', color: '#fff', borderRadius: '6px'}}>
                <option value="어깨">어깨</option>
                <option value="가슴">가슴</option>
                <option value="등">등</option>
                <option value="하체">하체</option>
                <option value="복근">복근</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{padding: '14px', background: '#38bdf8', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px'}}>
              {loading ? '분석 중...' : '맞춤 루틴 받기'}
            </button>
          </form>

          {aiResponse && (
            <div style={{marginTop: '20px', background: '#020617', padding: '15px', borderRadius: '8px', border: '1px solid #38bdf8'}}>
              <h4 style={{margin: '0 0 8px 0', color: '#38bdf8'}}>💡 AI 코칭 결과</h4>
              <div style={{whiteSpace: 'pre-line', fontSize: '13px', color: '#cbd5e1'}}>{aiResponse}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
