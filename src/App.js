import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// ---------------------------------------------------------
// 1. 데이터: 모든 세부 부위와 기구가 포함된 완전판 운동 도감
// ---------------------------------------------------------
const FITNESS_DICTIONARY = {
  '가슴': [
    { name: '벤치 프레스', type: '프리웨이트/바벨', desc: '대흉근 전체의 크기와 근력을 키우는 최고의 상체 운동' },
    { name: '인클라인 벤치 프레스', type: '프리웨이트/바벨', desc: '빗장뼈 부근의 상부 가슴 발달에 효과적' },
    { name: '디클라인 벤치 프레스', type: '프리웨이트/바벨', desc: '하부 가슴 라인을 선명하게 다듬는 운동' },
    { name: '덤벨 플라이', type: '프리웨이트/덤벨', desc: '가슴 근육을 넓게 이완시키며 안쪽 자극에 탁월' },
    { name: '펙 덱 플라이', type: '머신', desc: '초보자도 안전하게 가슴 안쪽 고립을 느낄 수 있는 기구' },
    { name: '케이블 크로스 오버', type: '케이블', desc: '운동 범위 내내 지속적인 장력을 주어 선명도를 높이는 운동' },
    { name: '푸시 업 (팔굽혀펴기)', type: '맨몸', desc: '코어와 가슴 전체를 단련하는 맨몸 운동의 기초' }
  ],
  '등': [
    { name: '랫 풀 다운', type: '머신', desc: '광배근 상부와 외곽을 넓혀 역삼각형 체형을 만드는 필수 머신' },
    { name: '바벨 로우', type: '프리웨이트/바벨', desc: '등의 두께감(중하부)을 키우는 고중량 복합 다관절 운동' },
    { name: '시티드 케이블 로우', type: '케이블 머신', desc: '등 중앙부와 능형근을 집중 타격하는 머신' },
    { name: '원 암 덤벨 로우', type: '프리웨이트/덤벨', desc: '좌우 불균형을 교정하고 광배근 하부를 강하게 수축' },
    { name: '풀 업 (턱걸이)', type: '맨몸', desc: '상체 등 근육 전반을 다루는 최고의 맨몸 운동' },
    { name: '데드리프트 (루마니안)', type: '프리웨이트/바벨', desc: '등 후면 전체(기립근, 엉덩이, 햄스트링)를 단련하는 3대 운동' },
    { name: '바벨 풀오버', type: '프리웨이트/바벨', desc: '흉곽을 확장하고 광배근 상단 라인을 정리하는 운동' }
  ],
  '어깨': [
    { name: '오버헤드 프레스 (밀리터리 프레스)', type: '프리웨이트/바벨', desc: '전면 삼각근과 상체 코어 전반을 키우는 대표 바벨 운동' },
    { name: '덤벨 숄더 프레스', type: '프리웨이트/덤벨', desc: '가동범위를 넓게 가져가며 어깨 전체 볼륨을 키우는 운동' },
    { name: '숄더 프레스 머신', type: '머신', desc: '안전하게 고중량을 다루며 어깨 전/측면을 타격하는 기구' },
    { name: '사이드 레터럴 레이즈', type: '프리웨이트/덤벨', desc: '어깨 측면의 넓이(뽕)를 만들어 주는 필수 고립 운동' },
    { name: '프론트 레이즈', type: '프리웨이트/덤벨', desc: '어깨 전면의 분리도를 높여주는 운동' },
    { name: '벤트 오버 레이즈 (리어 레이즈)', type: '프리웨이트/덤벨', desc: '옷핏을 살려주는 후면 삼각근 타격 운동' },
    { name: '페이스 풀', type: '케이블 머신', desc: '후면 삼각근과 회전근개를 강화하여 거북목 교정에 도움' }
  ],
  '이두': [
    { name: '바벨 컬', type: '프리웨이트/바벨', desc: '이두근의 전체적인 크기와 매스(Mass)를 키우는 기본 운동' },
    { name: '덤벨 컬', type: '프리웨이트/덤벨', desc: '손목을 회전(수피네이션)하며 이두근의 최대 수축을 유도' },
    { name: '해머 컬', type: '프리웨이트/덤벨', desc: '손바닥이 마주보게 잡고 수행하여 상완근과 전완근을 동시 타격' },
    { name: '프리처 컬', type: '머신/프리웨이트', desc: '팔을 고정한 상태로 이두 하부를 집중적으로 수축시키는 운동' },
    { name: '케이블 컬', type: '케이블 머신', desc: '내리는 순간에도 장력이 풀리지 않아 지속적 자극 제공' }
  ],
  '삼두': [
    { name: '라바 삼두 익스텐션 (스컬 크러셔)', type: '프리웨이트/바벨', desc: '삼두근 장두와 전체적인 두께를 키우는 대표 운동' },
    { name: '케이블 푸시 다운', type: '케이블 머신', desc: '초보자도 쉽게 삼두근 수축을 느낄 수 있는 대표 케이블 기구' },
    { name: '오버헤드 덤벨 익스텐션', type: '프리웨이트/덤벨', desc: '팔을 위로 들어 올려 삼두근 장두를 강하게 스트레칭' },
    { name: '딥스', type: '맨몸/머신', desc: '가슴 하부와 삼두근을 동시에 폭발적으로 자극하는 복합 운동' },
    { name: '클로즈 그립 벤치 프레스', type: '프리웨이트/바벨', desc: '좁게 잡고 수행하여 고중량으로 삼두를 공략' }
  ],
  '전완근': [
    { name: '리스트 컬 (손목 컬)', type: '프리웨이트/바벨', desc: '전완근 안쪽(굴근)을 두껍게 만드는 손목 운동' },
    { name: '리버스 리스트 컬', type: '프리웨이트/바벨', desc: '전완근 바깥쪽(신근)과 팔뚝 라인을 다듬는 운동' },
    { name: '추 감기 (포어암 롤러)', type: '소도구', desc: '악력과 전완근의 타는 듯한 펌핑감을 주는 도구 운동' },
    { name: '파머스 워크', type: '프리웨이트', desc: '무거운 덤벨을 들고 걸으며 악력과 코어, 전신 근력을 강화' }
  ],
  '복근': [
    { name: '크런치', type: '맨몸', desc: '상복부를 집중 수축하여 선명도를 높이는 대표 코어 운동' },
    { name: '행잉 레그 레이즈', type: '맨몸/철봉', desc: '매달려서 다리를 들어 올리며 하복부와 코어를 난이도 있게 단련' },
    { name: '케이블 크런치', type: '케이블 머신', desc: '중량을 추가하여 상복부에 강한 부하를 주는 머신 운동' },
    { name: '플랭크', type: '맨몸', desc: '허리 통증 방지 및 전신 코어 안정성을 잡는 정적 운동' },
    { name: '러시안 트위스트', type: '맨몸/소도구', desc: '상체를 비틀어 옆구리(외복사직근) 라인을 정리하는 운동' }
  ],
  '하체': [
    { name: '바벨 백 스쿼트', type: '프리웨이트/바벨', desc: '하체 전반과 코어를 강화하는 헬스의 꽃이자 3대 운동' },
    { name: '레그 프레스', type: '머신', desc: '허리 부담을 줄이고 안정적으로 대퇴사두근에 고중량을 다루는 기구' },
    { name: '레그 익스텐션', type: '머신', desc: '무릎을 펴며 허벅지 앞쪽(대퇴사두근)을 고립·분리하는 머신' },
    { name: '라잉 레그 컬', type: '머신', desc: '엎드려서 다리를 접으며 허벅지 뒤쪽(햄스트링)을 단련하는 머신' },
    { name: '불가리안 스플릿 스쿼트', type: '프리웨이트/덤벨', desc: '한쪽씩 수행하여 엉덩이와 허벅지 균형을 맞추는 고강도 운동' },
    { name: '바벨 루마니안 데드리프트', type: '프리웨이트/바벨', desc: '엉덩이(둔근)와 햄스트링 후면을 타격하는 최고의 후면 운동' },
    { name: '스탠딩 카프 레이즈', type: '머신/프리웨이트', desc: '종아리(비복근) 근육을 수축·이완하여 다리 라인을 완성' }
  ],
  '유산소 / 기타 기구': [
    { name: '트레드밀 (러닝머신)', type: '유산소 기구', desc: '속도와 경사도를 조절하여 심폐지구력과 체지방을 연소' },
    { name: '실내 사이클', type: '유산소 기구', desc: '무릎 관절에 무리를 주지 않으면서 하체 유산소를 병행' },
    { name: '천국의 계단 (스텝밀)', type: '유산소 기구', desc: '극악의 칼로리 소모와 엉덩이/허벅지 탄력을 동시에 잡는 기구' },
    { name: '로잉 머신', type: '전신 유산소', desc: '상하체 전신 근육을 모두 사용하여 칼로리를 태우는 기구' }
  ]
};

function App() {
  const [activeTab, setActiveTab] = useState('record');
  
  const [bodyInfo, setBodyInfo] = useState({ height: '', weight: '', age: '', goal: '다이어트', targetPart: '가슴' });
  const [condition, setCondition] = useState('보통');
  const [feedback, setFeedback] = useState('적당함');
  const [aiResponse, setAiResponse] = useState('');
  
  const [equipmentImage, setEquipmentImage] = useState(null);
  const [equipmentResponse, setEquipmentResponse] = useState('');
  
  // 도감 내 검색어 상태
  const [dictSearch, setDictSearch] = useState('');

  // 운동 기록 상태 (2026~2028년 데이터 관리)
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('workout_history_v8');
      return saved ? JSON.parse(saved) : [
        { date: '2026-06-01', weight: 72.5, muscle: 31.5, fat: 18.5, part: '가슴' },
        { date: '2026-06-07', weight: 71.8, muscle: 31.8, fat: 18.0, part: '등' },
        { date: '2026-06-15', weight: 72.1, muscle: 32.0, fat: 17.8, part: '하체' },
        { date: '2026-07-02', weight: 71.5, muscle: 32.1, fat: 17.5, part: '어깨' },
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

  // 캘린더 표시 기준 연도/월 상태
  const [currentDateObj, setCurrentDateObj] = useState(new Date());
  const viewYear = currentDateObj.getFullYear();
  const viewMonth = currentDateObj.getMonth(); // 0~11

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('workout_history_v8', JSON.stringify(historyList));
    } catch (e) {
      console.error(e);
    }
  }, [historyList]);

  const handlePrevMonth = () => {
    const newDate = new Date(viewYear, viewMonth - 1, 1);
    if (newDate.getFullYear() < 2026) return;
    setCurrentDateObj(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewYear, viewMonth + 1, 1);
    if (newDate.getFullYear() > 2028) return;
    setCurrentDateObj(newDate);
  };

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

    setHistoryList((prevList) => {
      const existingIndex = prevList.findIndex(item => item.date === inputDate);
      if (existingIndex >= 0) {
        const updated = [...prevList];
        updated[existingIndex] = newItem;
        return updated.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else {
        return [...prevList, newItem].sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    });

    alert(`${inputDate} 기록이 저장되었습니다!`);
  };

  // 현재 선택된 '해당 월(Month)'의 데이터 필터링
  const monthString = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
  const currentMonthRecords = historyList
    .filter(item => item.date.startsWith(monthString))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // 꺾은선 좌표 계산 함수 (Y축: 50kg ~ 100kg 또는 5% ~ 40%)
  const renderMonthPolylinePoints = (dataKey, minVal, maxVal) => {
    const width = 300;
    const height = 140;
    if (currentMonthRecords.length === 0) return "";
    const range = maxVal - minVal || 1;
    
    return currentMonthRecords.map((item) => {
      const day = parseInt(item.date.split('-')[2], 10);
      const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      
      const x = ((day - 1) / (daysInCurrentMonth - 1)) * (width - 40) + 20;
      const val = item[dataKey] || minVal;
      const y = height - 25 - ((val - minVal) / range) * (height - 50);
      return `${x},${y}`;
    }).join(" ");
  };

  // 달력 날짜 배열 계산
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${viewYear}-${monthStr}-${dayStr}`;
    calendarDays.push(dateStr);
  }

  const selectedRecord = historyList.find(item => item.date === inputDate);

  // Y축 눈금 (체중/근육량용: 50~100kg)
  const yAxisTicksKg = [100, 90, 80, 70, 60, 50];
  // Y축 눈금 (체지방률용: 5~40%)
  const yAxisTicksFat = [40, 32, 24, 16, 8];

  return (
    <div className="container">
      <h2>🏋️ AI 스마트 피트니스 코치 & 도감</h2>
      
      <div className="tab-menu">
        <button className={activeTab === 'record' ? 'active' : ''} onClick={() => setActiveTab('record')}>📊 캘린더 & 그래프</button>
        <button className={activeTab === 'dictionary' ? 'active' : ''} onClick={() => setActiveTab('dictionary')}>📖 운동 도감</button>
        <button className={activeTab === 'routine' ? 'active' : ''} onClick={() => setActiveTab('routine')}>맞춤 루틴</button>
        <button className={activeTab === 'equipment' ? 'active' : ''} onClick={() => setActiveTab('equipment')}>기구 인식</button>
      </div>

      {/* 탭 1: 캘린더 & Y축 눈금이 명확한 그래프 */}
      {activeTab === 'record' && (
        <div className="form-box">
          <h3>📅 인터랙티브 캘린더 & 체성분 추이</h3>
          <p className="desc">화살표를 눌러 월을 변경하고 날짜를 클릭해 기록을 확인·수정하세요.</p>
          
          <div style={{background: '#0f172a', padding: '12px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '15px'}}>
            <div className="calendar-header-nav">
              <button className="month-nav-btn" onClick={handlePrevMonth}>◀ 이전달</button>
              <span style={{fontWeight: 'bold', fontSize: '15px', color: '#38bdf8'}}>{viewYear}년 {viewMonth + 1}월</span>
              <button className="month-nav-btn" onClick={handleNextMonth}>다음달 ▶</button>
            </div>

            <div className="calendar-grid">
              {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                <div key={i} className="calendar-day-header">{d}</div>
              ))}
              {calendarDays.map((dateStr, idx) => {
                if (!dateStr) return <div key={idx}></div>;
                const dayNum = parseInt(dateStr.split('-')[2], 10);
                const hasRecord = historyList.some(item => item.date === dateStr);
                const isSelected = inputDate === dateStr;

                return (
                  <div 
                    key={idx} 
                    className={`calendar-cell ${isSelected ? 'selected' : ''} ${hasRecord && !isSelected ? 'has-record' : ''}`}
                    onClick={() => handleSelectDate(dateStr)}
                  >
                    <span className="day-number">{dayNum}</span>
                    {hasRecord && <span className="day-dot">●</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSaveRecord} style={{display: 'flex', flexDirection: 'column', gap: '10px', background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '15px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{color: '#38bdf8', fontWeight: 'bold'}}>선택된 날짜: {inputDate}</span>
              <input type="date" value={inputDate} min="2026-01-01" max="2028-12-31" onChange={(e) => handleSelectDate(e.target.value)} style={{width: '140px', padding: '4px', colorScheme: 'dark'}} />
            </div>

            <div className="input-group">
              <input type="number" step="0.1" placeholder="체중 (kg)" value={inputWeight} onChange={(e) => setInputWeight(e.target.value)} />
              <input type="number" step="0.1" placeholder="근육량 (kg)" value={inputMuscle} onChange={(e) => setInputMuscle(e.target.value)} />
            </div>

            <div className="input-group">
              <input type="number" step="0.1" placeholder="체지방률 (%)" value={inputFat} onChange={(e) => setInputFat(e.target.value)} />
              <select value={inputPart} onChange={(e) => setInputPart(e.target.value)}>
                <option value="어깨">어깨</option>
                <option value="가슴">가슴</option>
                <option value="등">등</option>
                <option value="복근">복근</option>
                <option value="이두">이두</option>
                <option value="삼두">삼두</option>
                <option value="전완근">전완근</option>
                <option value="하체">하체</option>
              </select>
            </div>

            <button type="submit" className="action-btn">선택한 날짜 기록 저장 / 수정하기</button>
          </form>

          {/* 체중 & 근육량 그래프 (Y축 숫자, X축 1~31일 명시) */}
          <div className="record-card" style={{background: '#0f172a', padding: '15px', borderRadius: '10px', marginBottom: '15px'}}>
            <h4 style={{margin: '0 0 4px 0', color: '#38bdf8'}}>📈 {viewYear}년 {viewMonth + 1}월 체중 & 근육량 추이</h4>
            <p className="desc" style={{marginBottom: '10px'}}>세로축: 킬로그램(kg) / 가로축: 1일 ~ 말일</p>
            <div style={{display: 'flex', background: '#020617', borderRadius: '8px', padding: '10px 5px', position: 'relative'}}>
              {/* Y축 레이블 */}
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', paddingRight: '8px', textAlign: 'right', width: '35px'}}>
                {yAxisTicksKg.map((t, i) => <span key={i}>{t}kg</span>)}
              </div>
              {/* 그래프 영역 */}
              <div style={{flex: 1, position: 'relative', height: '140px'}}>
                <svg viewBox="0 0 300 140" style={{width: '100%', height: '140px', overflow: 'visible'}}>
                  {yAxisTicksKg.map((_, i) => (
                    <line key={i} x1="0" y1={i * 28} x2="300" y2={i * 28} stroke="#1e293b" strokeWidth="1" />
                  ))}
                  <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" points={renderMonthPolylinePoints('weight', 50, 100)} />
                  <polyline fill="none" stroke="#4ade80" strokeWidth="2.5" points={renderMonthPolylinePoints('muscle', 50, 100)} />
                </svg>
                {/* X축 레이블 */}
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '6px'}}>
                  <span>1일</span>
                  <span>10일</span>
                  <span>20일</span>
                  <span>말일</span>
                </div>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px', marginTop: '8px'}}>
              <span style={{color: '#38bdf8'}}>■ 체중(kg)</span>
              <span style={{color: '#4ade80'}}>■ 근육량(kg)</span>
            </div>
          </div>

          {/* 체지방률 그래프 */}
          <div className="record-card" style={{background: '#0f172a', padding: '15px', borderRadius: '10px', marginBottom: '15px'}}>
            <h4 style={{margin: '0 0 4px 0', color: '#f43f5e'}}>📊 {viewYear}년 {viewMonth + 1}월 체지방률 (%) 추이</h4>
            <p className="desc" style={{marginBottom: '10px'}}>세로축: 백분율(%) / 가로축: 1일 ~ 말일</p>
            <div style={{display: 'flex', background: '#020617', borderRadius: '8px', padding: '10px 5px', position: 'relative'}}>
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', paddingRight: '8px', textAlign: 'right', width: '35px'}}>
                {yAxisTicksFat.map((t, i) => <span key={i}>{t}%</span>)}
              </div>
              <div style={{flex: 1, position: 'relative', height: '140px'}}>
                <svg viewBox="0 0 300 140" style={{width: '100%', height: '140px', overflow: 'visible'}}>
                  {yAxisTicksFat.map((_, i) => (
                    <line key={i} x1="0" y1={i * 35} x2="300" y2={i * 35} stroke="#1e293b" strokeWidth="1" />
                  ))}
                  <polyline fill="none" stroke="#f43f5e" strokeWidth="2.5" points={renderMonthPolylinePoints('fat', 8, 40)} />
                </svg>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '6px'}}>
                  <span>1일</span>
                  <span>10일</span>
                  <span>20일</span>
                  <span>말일</span>
                </div>
              </div>
            </div>
            <div style={{fontSize: '12px', color: '#f43f5e', textAlign: 'center', marginTop: '8px'}}>■ 체지방률(%) 추이</div>
          </div>

          {/* 선택한 날짜 상세 확인 카드 */}
          <div className="record-card" style={{background: '#0f172a', padding: '12px', borderRadius: '8px'}}>
            <h4 style={{margin: '0 0 8px 0', color: '#f8fafc'}}>📌 {inputDate} 상세 기록</h4>
            {selectedRecord ? (
              <div style={{fontSize: '13px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', padding: '4px 0'}}>
                <span>부위: <strong style={{color: '#38bdf8'}}>{selectedRecord.part}</strong></span>
                <span>체중: <strong style={{color: '#f8fafc'}}>{selectedRecord.weight}kg</strong></span>
                <span>근육: <strong style={{color: '#f8fafc'}}>{selectedRecord.muscle}kg</strong></span>
                <span>체지방: <strong style={{color: '#f43f5e'}}>{selectedRecord.fat}%</strong></span>
              </div>
            ) : (
              <p className="desc" style={{margin: 0}}>이 날짜에 저장된 기록이 없습니다. 위에서 입력 후 저장해 보세요!</p>
            )}
          </div>
        </div>
      )}

      {/* 탭 2: 완전판 운동 도감 */}
      {activeTab === 'dictionary' && (
        <div className="form-box">
          <h3>📖 부위별 & 기구 운동 도감</h3>
          <p className="desc">어깨, 가슴, 등, 복근, 이두, 삼두, 전완근, 하체 등 모든 운동법과 기구를 확인하세요.</p>
          
          <input 
            type="text" 
            placeholder="🔍 찾고 싶은 운동이나 기구 이름 검색 (예: 벤치, 스쿼트)" 
            value={dictSearch}
            onChange={(e) => setDictSearch(e.target.value)}
            style={{width: '100%', padding: '10px', marginBottom: '15px', background: '#020617', border: '1px solid #334155', borderRadius: '8px', color: '#fff'}}
          />

          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            {Object.entries(FITNESS_DICTIONARY).map(([partName, exercises]) => {
              // 검색어 필터링
              const filteredExercises = exercises.filter(ex => 
                ex.name.toLowerCase().includes(dictSearch.toLowerCase()) || 
                ex.desc.toLowerCase().includes(dictSearch.toLowerCase()) ||
                partName.toLowerCase().includes(dictSearch.toLowerCase())
              );

              if (filteredExercises.length === 0) return null;

              return (
                <div key={partName} style={{background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '12px'}}>
                  <h4 style={{color: '#38bdf8', borderBottom: '1px solid #1e293b', paddingBottom: '6px', margin: '0 0 10px 0'}}>💪 {partName} 운동 모음</h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    {filteredExercises.map((ex, idx) => (
                      <div key={idx} style={{background: '#020617', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #38bdf8'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                          <strong style={{color: '#f8fafc', fontSize: '14px'}}>{ex.name}</strong>
                          <span style={{fontSize: '11px', background: '#1e293b', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px'}}>{ex.type}</span>
                        </div>
                        <p style={{margin: 0, fontSize: '12px', color: '#94a3b8'}}>{ex.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 탭 3: 맞춤 루틴 */}
      {activeTab === 'routine' && (
        <div className="form-box">
          <h3>🏋️ 맞춤 루틴 설정</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            await new Promise(r => setTimeout(r, 1000));
            setAiResponse(`[AI 맞춤 루틴 제안]\n\n선택 부위(${bodyInfo.targetPart}) 집중 프로그램:\n- 목표: ${bodyInfo.goal}\n- 1번 운동: 메인 복합 관절 운동 (4세트)\n- 2번 운동: 고립 머신/덤벨 운동 (4세트)\n- 3번 운동: 마무리 펌핑 운동 (3세트)\n\n오늘 컨디션과 피드백을 반영한 최적의 강도로 수행해 보세요!`);
            setLoading(false);
          }}>
            <div className="input-group">
              <input type="number" placeholder="키 (cm)" value={bodyInfo.height} onChange={(e) => setBodyInfo({...bodyInfo, height: e.target.value})} />
              <input type="number" placeholder="체중 (kg)" value={bodyInfo.weight} onChange={(e) => setBodyInfo({...bodyInfo, weight: e.target.value})} />
              <input type="number" placeholder="나이" value={bodyInfo.age} onChange={(e) => setBodyInfo({...bodyInfo, age: e.target.value})} />
            </div>
            <div className="input-group">
              <select value={bodyInfo.goal} onChange={(e) => setBodyInfo({...bodyInfo, goal: e.target.value})}>
                <option value="다이어트">다이어트</option>
                <option value="근비대">근비대</option>
              </select>
              <select value={bodyInfo.targetPart} onChange={(e) => setBodyInfo({...bodyInfo, targetPart: e.target.value})}>
                <option value="어깨">어깨</option>
                <option value="가슴">가슴</option>
                <option value="등">등</option>
                <option value="복근">복근</option>
                <option value="이두">이두</option>
                <option value="삼두">삼두</option>
                <option value="전완근">전완근</option>
                <option value="하체">하체</option>
              </select>
            </div>
            <button type="submit" disabled={loading}>{loading ? '분석 중...' : '맞춤 루틴 받기'}</button>
          </form>
          {aiResponse && (
            <div className="result-box" style={{marginTop: '15px'}}>
              <h3>💡 AI 코칭 결과</h3>
              <div style={{whiteSpace: 'pre-line', color: '#cbd5e1'}}>{aiResponse}</div>
            </div>
          )}
        </div>
      )}

      {/* 탭 4: 기구 인식 */}
      {activeTab === 'equipment' && (
        <div className="form-box">
          <h3>📸 헬스장 기구 인식 가이드</h3>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setEquipmentImage(reader.result);
              reader.readAsDataURL(file);
            }
          }} style={{display: 'none'}} />
          <button type="button" onClick={() => fileInputRef.current.click()} className="cam-btn">사진 촬영/업로드</button>
          {equipmentImage && (
            <div className="preview-container" style={{marginTop: '10px', textAlign: 'center'}}>
              <img src={equipmentImage} alt="기구" className="preview-img" style={{maxHeight: '180px', borderRadius: '8px'}} />
              <button type="button" onClick={async () => {
                setLoading(true);
                await new Promise(r => setTimeout(r, 1200));
                setEquipmentResponse('분석된 기구: 펙 덱 플라이\n\n사용법: 손잡이가 가슴 높이에 오도록 맞춘 뒤 가슴 안쪽 힘으로 모아줍니다.');
                setLoading(false);
              }} disabled={loading} style={{marginTop: '10px'}}>기구 설명 보기</button>
            </div>
          )}
          {equipmentResponse && (
            <div className="result-box" style={{marginTop: '15px'}}>
              <h3>🛠️ 기구 가이드</h3>
              <div style={{whiteSpace: 'pre-line', color: '#cbd5e1'}}>{equipmentResponse}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
