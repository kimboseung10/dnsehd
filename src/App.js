import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('routine');
  
  // 1. 맞춤 루틴 상태
  const [bodyInfo, setBodyInfo] = useState({ 
    height: '', 
    weight: '', 
    age: '', 
    goal: '다이어트',
    targetPart: '가슴'
  });
  const [condition, setCondition] = useState('보통');
  const [feedback, setFeedback] = useState('적당함');
  const [aiResponse, setAiResponse] = useState('');
  
  // 2. 기구 인식 상태
  const [equipmentImage, setEquipmentImage] = useState(null);
  const [equipmentResponse, setEquipmentResponse] = useState('');
  
  // 3. 운동 기록 상태 (로컬 스토리지 연동)
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('workout_history_v3');
      return saved ? JSON.parse(saved) : [
        { date: '2026-06-01', weight: 72.0, muscle: 31.5, part: '가슴', volume: 2500 },
        { date: '2026-06-03', weight: 71.8, muscle: 31.8, part: '등', volume: 3000 },
        { date: '2026-06-05', weight: 71.5, muscle: 32.0, part: '하체', volume: 4200 },
      ];
    } catch {
      return [];
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const [inputDate, setInputDate] = useState(todayStr);
  const [inputWeight, setInputWeight] = useState('');
  const [inputMuscle, setInputMuscle] = useState('');
  const [inputVolume, setInputVolume] = useState('');
  const [inputPart, setInputPart] = useState('가슴');

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('workout_history_v3', JSON.stringify(historyList));
    } catch (e) {
      console.error(e);
    }
  }, [historyList]);

  // 기록 저장 및 수정
  const handleSaveRecord = (e) => {
    e.preventDefault();
    if (!inputWeight || !inputMuscle) {
      alert('체중과 근육량은 필수 입력 항목입니다.');
      return;
    }

    const numericWeight = parseFloat(inputWeight);
    const numericMuscle = parseFloat(inputMuscle);
    const numericVolume = inputVolume ? parseFloat(inputVolume) : 0;

    setHistoryList((prevList) => {
      const existingIndex = prevList.findIndex(item => item.date === inputDate);
      if (existingIndex >= 0) {
        const updated = [...prevList];
        updated[existingIndex] = {
          date: inputDate,
          weight: numericWeight,
          muscle: numericMuscle,
          volume: numericVolume,
          part: inputPart
        };
        return updated.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else {
        const newItem = {
          date: inputDate,
          weight: numericWeight,
          muscle: numericMuscle,
          volume: numericVolume,
          part: inputPart
        };
        return [...prevList, newItem].sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    });

    alert(`${inputDate} 자 기록이 저장되었습니다!`);
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
      if (res.ok) {
        setAiResponse(data.result);
      } else {
        alert(data.error || '오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버와의 통신에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEquipmentImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEquipmentSubmit = async () => {
    if (!equipmentImage) {
      alert('운동 기구 사진을 업로드하거나 촬영해주세요.');
      return;
    }

    setLoading(true);
    setEquipmentResponse('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'equipment', image: equipmentImage }),
      });

      const data = await res.json();
      if (res.ok) {
        setEquipmentResponse(data.result);
      } else {
        alert(data.error || '오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버와의 통신에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>🏋️ AI 스마트 피트니스 코치</h2>
      
      <div className="tab-menu">
        <button className={activeTab === 'routine' ? 'active' : ''} onClick={() => setActiveTab('routine')}>맞춤 루틴</button>
        <button className={activeTab === 'equipment' ? 'active' : ''} onClick={() => setActiveTab('equipment')}>기구 인식</button>
        <button className={activeTab === 'record' ? 'active' : ''} onClick={() => setActiveTab('record')}>캘린더 & 추이</button>
      </div>

      {activeTab === 'routine' && (
        <form onSubmit={handleRoutineSubmit} className="form-box">
          <h3>신체 정보 및 목표 설정</h3>
          <div className="input-group">
            <input type="number" placeholder="키 (cm)" value={bodyInfo.height} onChange={(e) => setBodyInfo({...bodyInfo, height: e.target.value})} />
            <input type="number" placeholder="체중 (kg)" value={bodyInfo.weight} onChange={(e) => setBodyInfo({...bodyInfo, weight: e.target.value})} />
            <input type="number" placeholder="나이" value={bodyInfo.age} onChange={(e) => setBodyInfo({...bodyInfo, age: e.target.value})} />
          </div>
          
          <div className="input-group">
            <div style={{flex: 1}}>
              <label className="desc" style={{display: 'block', marginBottom: '4px'}}>운동 목표</label>
              <select value={bodyInfo.goal} onChange={(e) => setBodyInfo({...bodyInfo, goal: e.target.value})}>
                <option value="다이어트">다이어트</option>
                <option value="근비대">근비대 (근육 증가)</option>
                <option value="체형 교정">체형 교정</option>
              </select>
            </div>
            
            <div style={{flex: 1}}>
              <label className="desc" style={{display: 'block', marginBottom: '4px'}}>오늘 운동 부위</label>
              <select value={bodyInfo.targetPart} onChange={(e) => setBodyInfo({...bodyInfo, targetPart: e.target.value})}>
                <option value="가슴">가슴</option>
                <option value="등">등</option>
                <option value="어깨">어깨</option>
                <option value="삼두">삼두</option>
                <option value="이두">이두</option>
                <option value="전완근">전완근</option>
                <option value="하체">하체</option>
                <option value="코어">코어</option>
              </select>
            </div>
          </div>

          <h3>오늘의 컨디션</h3>
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="최상">최상 (에너지 넘침)</option>
            <option value="보통">보통 (평소와 같음)</option>
            <option value="피곤함">피곤함 (컨디션 저조)</option>
          </select>

          <h3>1세트 수행 후 피드백</h3>
          <select value={feedback} onChange={(e) => setFeedback(e.target.value)}>
            <option value="너무 쉬움">너무 쉬움 (더 어렵게 해줘요)</option>
            <option value="적당함">적당함 (지금 난이도 유지)</option>
            <option value="너무 힘듦">너무 힘듦 (더 쉽게 해줘요)</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? 'AI가 분석 중...' : '맞춤 루틴 및 난이도 조절 받기'}
          </button>
        </form>
      )}

      {aiResponse && activeTab === 'routine' && (
        <div className="result-box">
          <h3>💡 AI 트레이너의 코칭 피드백</h3>
          <div className="markdown-body">{aiResponse}</div>
        </div>
      )}

      {activeTab === 'equipment' && (
        <div className="form-box">
          <h3>📸 헬스장 기구 촬영 및 업로드</h3>
          <p className="desc">기구 사진을 촬영하거나 업로드하여 올바른 사용법을 확인하세요.</p>
          
          <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
          <button type="button" onClick={() => fileInputRef.current.click()} className="cam-btn">📷 기구 사진 찍기 / 업로드하기</button>

          {equipmentImage && (
            <div className="preview-container">
              <img src={equipmentImage} alt="선택한 기구" className="preview-img" />
              <button type="button" onClick={handleEquipmentSubmit} disabled={loading} className="analyze-btn">
                {loading ? 'AI가 기구를 분석하는 중...' : '이 기구 설명 보기'}
              </button>
            </div>
          )}
        </div>
      )}

      {equipmentResponse && activeTab === 'equipment' && (
        <div className="result-box">
          <h3>🛠️ AI 기구 가이드 및 사용법</h3>
          <div className="markdown-body">{equipmentResponse}</div>
        </div>
      )}

      {/* 캘린더 선택 및 순수 HTML 기반 꺾은선 시각화 카드 */}
      {activeTab === 'record' && (
        <div className="form-box">
          <h3>📅 날짜 선택 및 운동·체성분 기록</h3>
          <p className="desc">날짜를 지정해 과거/미래 기록을 추가하거나 수정할 수 있습니다.</p>
          
          <form onSubmit={handleSaveRecord} style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px'}}>
            <div>
              <label className="desc" style={{display: 'block', marginBottom: '4px'}}>날짜 선택</label>
              <input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} style={{colorScheme: 'dark'}} />
            </div>

            <div className="input-group">
              <div style={{flex: 1}}>
                <label className="desc" style={{display: 'block', marginBottom: '4px'}}>체중 (kg)</label>
                <input type="number" step="0.1" placeholder="예: 70.5" value={inputWeight} onChange={(e) => setInputWeight(e.target.value)} />
              </div>
              <div style={{flex: 1}}>
                <label className="desc" style={{display: 'block', marginBottom: '4px'}}>골격근량 (kg)</label>
                <input type="number" step="0.1" placeholder="예: 32.0" value={inputMuscle} onChange={(e) => setInputMuscle(e.target.value)} />
              </div>
            </div>

            <div className="input-group">
              <div style={{flex: 1}}>
                <label className="desc" style={{display: 'block', marginBottom: '4px'}}>운동 부위</label>
                <select value={inputPart} onChange={(e) => setInputPart(e.target.value)}>
                  <option value="가슴">가슴</option>
                  <option value="등">등</option>
                  <option value="어깨">어깨</option>
                  <option value="삼두">삼두</option>
                  <option value="이두">이두</option>
                  <option value="전완근">전완근</option>
                  <option value="하체">하체</option>
                  <option value="코어">코어</option>
                </select>
              </div>
              <div style={{flex: 1}}>
                <label className="desc" style={{display: 'block', marginBottom: '4px'}}>총 운동량 (볼륨 kg)</label>
                <input type="number" placeholder="예: 3500" value={inputVolume} onChange={(e) => setInputVolume(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="action-btn">선택한 날짜 기록 저장 / 수정</button>
          </form>

          {/* 순수 UI 꺾은선 대체 바 그래프 추이 대시보드 */}
          <div className="record-card" style={{marginTop: '20px'}}>
            <h3>📈 날짜별 체중 및 근육량 변화 추이</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px'}}>
              {historyList.map((item) => (
                <div key={item.date} style={{background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155'}}>
                  <div style={{display: 'flex', justifyContent: 'between', fontSize: '13px', marginBottom: '6px'}}>
                    <span style={{color: '#38bdf8', fontWeight: 'bold'}}>{item.date} ({item.part})</span>
                    <span style={{color: '#94a3b8'}}>체중: {item.weight}kg | 근육: {item.muscle}kg | 운동량: {item.volume || 0}kg</span>
                  </div>
                  {/* 시각적 바 형태 표현 */}
                  <div style={{display: 'flex', height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden'}}>
                    <div style={{width: `${Math.min(item.weight, 100)}%`, background: '#38bdf8'}} title="체중"></div>
                    <div style={{width: `${Math.min(item.muscle * 2, 100)}%`, background: '#4ade80'}} title="근육량"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
