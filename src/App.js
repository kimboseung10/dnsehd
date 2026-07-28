import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('routine');
  
  const [bodyInfo, setBodyInfo] = useState({ height: '', weight: '', age: '', goal: '다이어트', targetPart: '가슴' });
  const [condition, setCondition] = useState('보통');
  const [feedback, setFeedback] = useState('적당함');
  const [aiResponse, setAiResponse] = useState('');
  
  const [equipmentImage, setEquipmentImage] = useState(null);
  const [equipmentResponse, setEquipmentResponse] = useState('');
  
  // 운동 기록 상태 (체중, 근육량, 체지방률)
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('workout_history_v5');
      return saved ? JSON.parse(saved) : [
        { date: '2026-06-01', weight: 72.0, muscle: 31.5, fat: 18.5, part: '가슴' },
        { date: '2026-06-03', weight: 71.8, muscle: 31.8, fat: 18.0, part: '등' },
        { date: '2026-06-05', weight: 71.5, muscle: 32.0, fat: 17.5, part: '하체' },
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

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('workout_history_v5', JSON.stringify(historyList));
    } catch (e) {
      console.error(e);
    }
  }, [historyList]);

  // 달력에서 특정 날짜를 클릭했을 때 입력폼에 해당 데이터 불러오기
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

  // 기록 저장 및 수정
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

  const handleRoutineSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResponse('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'routine', bodyInfo, condition, feedback }),
      });
      const data = await res.json();
      if (res.ok) setAiResponse(data.result);
      else alert(data.error || '오류 발생');
    } catch (err) {
      alert('서버 통신 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEquipmentImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEquipmentSubmit = async () => {
    if (!equipmentImage) return alert('사진을 올려주세요.');
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'equipment', image: equipmentImage }),
      });
      const data = await res.json();
      if (res.ok) setEquipmentResponse(data.result);
    } catch (err) {
      alert('서버 통신 실패');
    } finally {
      setLoading(false);
    }
  };

  // SVG 꺾은선 좌표 계산
  const renderPolylinePoints = (dataKey, minVal, maxVal) => {
    const width = 300;
    const height = 120;
    if (historyList.length === 0) return "";
    const range = maxVal - minVal || 1;
    return historyList.map((item, index) => {
      const x = (index / (Math.max(historyList.length - 1, 1))) * (width - 40) + 20;
      const val = item[dataKey] || 0;
      const y = height - 20 - ((val - minVal) / range) * (height - 40);
      return `${x},${y}`;
    }).join(" ");
  };

  // 현재 월(2026년 6월 기준 예시 혹은 이번 달) 달력 생성 로직
  const [currentYearMonth] = useState({ year: 2026, month: 5 }); // 5는 6월 (0부터 시작)
  const daysInMonth = new Date(currentYearMonth.year, currentYearMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYearMonth.year, currentYearMonth.month, 1).getDay();

  // 달력 날짜 배열 만들기
  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null); // 빈 칸
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(currentYearMonth.month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYearMonth.year}-${monthStr}-${dayStr}`;
    calendarDays.push(dateStr);
  }

  // 선택한 날짜의 상세 기록 찾기
  const selectedRecord = historyList.find(item => item.date === inputDate);

  return (
    <div className="container">
      <h2>🏋️ AI 스마트 피트니스 코치</h2>
      
      <div className="tab-menu">
        <button className={activeTab === 'routine' ? 'active' : ''} onClick={() => setActiveTab('routine')}>맞춤 루틴</button>
        <button className={activeTab === 'equipment' ? 'active' : ''} onClick={() => setActiveTab('equipment')}>기구 인식</button>
        <button className={activeTab === 'record' ? 'active' : ''} onClick={() => setActiveTab('record')}>캘린더 & 그래프</button>
      </div>

      {activeTab === 'routine' && (
        <form onSubmit={handleRoutineSubmit} className="form-box">
          <h3>신체 정보 및 목표</h3>
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
              <option value="가슴">가슴</option>
              <option value="등">등</option>
              <option value="하체">하체</option>
              <option value="어깨">어깨</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>{loading ? '분석 중...' : '맞춤 루틴 받기'}</button>
        </form>
      )}

      {aiResponse && activeTab === 'routine' && (
        <div className="result-box">
          <h3>💡 AI 코칭 결과</h3>
          <div className="markdown-body">{aiResponse}</div>
        </div>
      )}

      {activeTab === 'equipment' && (
        <div className="form-box">
          <h3>📸 기구 인식</h3>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{display: 'none'}} />
          <button type="button" onClick={() => fileInputRef.current.click()} className="cam-btn">사진 촬영/업로드</button>
          {equipmentImage && (
            <div className="preview-container">
              <img src={equipmentImage} alt="기구" className="preview-img" />
              <button type="button" onClick={handleEquipmentSubmit} disabled={loading}>기구 설명 보기</button>
            </div>
          )}
        </div>
      )}

      {equipmentResponse && activeTab === 'equipment' && (
        <div className="result-box">
          <h3>🛠️ 기구 가이드</h3>
          <div>{equipmentResponse}</div>
        </div>
      )}

      {/* 캘린더 및 꺾은선 그래프 탭 */}
      {activeTab === 'record' && (
        <div className="form-box">
          <h3>📅 인터랙티브 캘린더</h3>
          <p className="desc">달력의 날짜를 클릭하면 해당 날짜의 기록을 확인하거나 수정할 수 있습니다.</p>
          
          {/* 달력 UI 컴포넌트 */}
          <div style={{background: '#0f172a', padding: '12px', borderRadius: '12px', border: '1px solid #334155'}}>
            <div style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '8px', color: '#38bdf8'}}>2026년 6월</div>
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
                    {hasRecord && <span className="day-dot">● 기록</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 선택한 날짜 기록 입력/수정 폼 */}
          <form onSubmit={handleSaveRecord} style={{display: 'flex', flexDirection: 'column', gap: '10px', background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', marginTop: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{color: '#38bdf8', fontWeight: 'bold'}}>선택된 날짜: {inputDate}</span>
              <input type="date" value={inputDate} onChange={(e) => handleSelectDate(e.target.value)} style={{width: '130px', padding: '4px', colorScheme: 'dark'}} />
            </div>

            <div className="input-group">
              <input type="number" step="0.1" placeholder="체중 (kg)" value={inputWeight} onChange={(e) => setInputWeight(e.target.value)} />
              <input type="number" step="0.1" placeholder="근육량 (kg)" value={inputMuscle} onChange={(e) => setInputMuscle(e.target.value)} />
            </div>

            <div className="input-group">
              <input type="number" step="0.1" placeholder="체지방률 (%)" value={inputFat} onChange={(e) => setInputFat(e.target.value)} />
              <select value={inputPart} onChange={(e) => setInputPart(e.target.value)}>
                <option value="가슴">가슴</option>
                <option value="등">등</option>
                <option value="하체">하체</option>
                <option value="어깨">어깨</option>
                <option value="유산소">유산소</option>
              </select>
            </div>

            <button type="submit" className="action-btn">선택한 날짜 기록 저장 / 수정하기</button>
          </form>

          {/* 꺾은선 그래프 1: 체중 & 근육량 */}
          <div className="record-card">
            <h4 style={{margin: '0 0 10px 0', color: '#38bdf8'}}>📈 체중 & 근육량 변화 추이</h4>
            <div style={{background: '#020617', borderRadius: '8px', padding: '10px', textAlign: 'center'}}>
              <svg viewBox="0 0 300 120" style={{width: '100%', height: '140px', overflow: 'visible'}}>
                <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeWidth="1" />
                <line x1="0" y1="70" x2="300" y2="70" stroke="#1e293b" strokeWidth="1" />
                <line x1="0" y1="120" x2="300" y2="120" stroke="#1e293b" strokeWidth="1" />
                
                <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" points={renderPolylinePoints('weight', 50, 100)} />
                <polyline fill="none" stroke="#4ade80" strokeWidth="2.5" points={renderPolylinePoints('muscle', 20, 50)} />
              </svg>
              <div style={{display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px', marginTop: '8px'}}>
                <span style={{color: '#38bdf8'}}>■ 체중(kg)</span>
                <span style={{color: '#4ade80'}}>■ 근육량(kg)</span>
              </div>
            </div>
          </div>

          {/* 꺾은선 그래프 2: 체지방률 */}
          <div className="record-card">
            <h4 style={{margin: '0 0 10px 0', color: '#f43f5e'}}>📊 체지방률(%) 변화 추이</h4>
            <div style={{background: '#020617', borderRadius: '8px', padding: '10px', textAlign: 'center'}}>
              <svg viewBox="0 0 300 120" style={{width: '100%', height: '140px', overflow: 'visible'}}>
                <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeWidth="1" />
                <line x1="0" y1="70" x2="300" y2="70" stroke="#1e293b" strokeWidth="1" />
                <line x1="0" y1="120" x2="300" y2="120" stroke="#1e293b" strokeWidth="1" />
                
                <polyline fill="none" stroke="#f43f5e" strokeWidth="2.5" points={renderPolylinePoints('fat', 5, 40)} />
              </svg>
              <div style={{fontSize: '12px', color: '#f43f5e', marginTop: '8px'}}>■ 체지방률(%) 추이</div>
            </div>
          </div>

          {/* 선택한 날짜 상세 확인 카드 */}
          <div className="record-card">
            <h4 style={{margin: '0 0 8px 0'}}>📌 {inputDate} 상세 기록</h4>
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
    </div>
  );
}

export default App;
