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
  
  // 3. 운동 기록 및 통계 상태 (로컬 스토리지 연동으로 안전하게 유지)
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('workout_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inputWeight, setInputWeight] = useState('');
  const [inputMuscle, setInputMuscle] = useState('');
  const [inputPart, setInputPart] = useState('가슴');

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('workout_history', JSON.stringify(historyList));
    } catch (e) {
      console.error(e);
    }
  }, [historyList]);

  // 운동 기록 추가 핸들러
  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!inputWeight || !inputMuscle) {
      alert('체중과 근육량을 입력해주세요.');
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const newRecord = {
      id: Date.now(),
      date: todayDate,
      part: inputPart,
      weight: parseFloat(inputWeight),
      muscle: parseFloat(inputMuscle),
    };

    setHistoryList([newRecord, ...historyList]);
    setInputWeight('');
    setInputMuscle('');
    alert('오늘의 운동 기록이 저장되었습니다!');
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

  // 최근 체중 및 근육량 추이 계산
  const latestRecord = historyList.length > 0 ? historyList[0] : null;

  return (
    <div className="container">
      <h2>🏋️ AI 스마트 피트니스 코치</h2>
      
      {/* 탭 메뉴 */}
      <div className="tab-menu">
        <button 
          className={activeTab === 'routine' ? 'active' : ''} 
          onClick={() => setActiveTab('routine')}
        >
          맞춤 루틴
        </button>
        <button 
          className={activeTab === 'equipment' ? 'active' : ''} 
          onClick={() => setActiveTab('equipment')}
        >
          기구 인식
        </button>
        <button 
          className={activeTab === 'record' ? 'active' : ''} 
          onClick={() => setActiveTab('record')}
        >
          운동 기록 & 추이
        </button>
      </div>

      {/* 탭 1: 맞춤 운동 추천 */}
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

      {/* 탭 2: 기구 인식 */}
      {activeTab === 'equipment' && (
        <div className="form-box">
          <h3>📸 헬스장 기구 촬영 및 업로드</h3>
          <p className="desc">기구 사진을 촬영하거나 업로드하여 올바른 사용법을 확인하세요.</p>
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            style={{ display: 'none' }}
          />

          <button type="button" onClick={() => fileInputRef.current.click()} className="cam-btn">
            📷 기구 사진 찍기 / 업로드하기
          </button>

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

      {/* 탭 3: 운동 기록 및 체중/근육량 추이 (캘린더 대체 리스트 및 대시보드) */}
      {activeTab === 'record' && (
        <div className="form-box">
          <h3>📈 나의 체성분 및 운동 부위 기록</h3>
          <p className="desc">오늘 운동한 부위와 현재 체중, 골격근량 기록을 남겨 변화 추이를 확인하세요.</p>
          
          <form onSubmit={handleAddRecord} style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px'}}>
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

            <div>
              <label className="desc" style={{display: 'block', marginBottom: '4px'}}>오늘 주요 운동 부위</label>
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

            <button type="submit" className="action-btn">오늘의 기록 저장하기</button>
          </form>

          {/* 요약 통계 카드 */}
          {latestRecord && (
            <div className="record-card" style={{marginTop: '16px'}}>
              <h3>📊 최근 측정 데이터 요약</h3>
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-label">최근 체중</div>
                  <div className="stat-value">{latestRecord.weight} kg</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">최근 근육량</div>
                  <div className="stat-value">{latestRecord.muscle} kg</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">기록 횟수</div>
                  <div className="stat-value">{historyList.length} 회</div>
                </div>
              </div>
            </div>
          )}

          <div className="record-card">
            <h3>📅 캘린더 및 운동 수행 히스토리</h3>
            {historyList.length === 0 ? (
              <p className="desc" style={{textAlign: 'center', padding: '20px 0'}}>아직 저장된 기록이 없습니다. 위에서 기록을 추가해 보세요!</p>
            ) : (
              <div className="history-list">
                {historyList.map((item) => (
                  <div key={item.id} className="history-item">
                    <div>
                      <strong style={{color: '#38bdf8'}}>{item.date}</strong>
                      <span style={{marginLeft: '10px', background: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '11px'}}>{item.part}</span>
                    </div>
                    <div style={{color: '#94a3b8', fontSize: '12px'}}>
                      체중: <strong style={{color: '#f8fafc'}}>{item.weight}kg</strong> / 근육량: <strong style={{color: '#f8fafc'}}>{item.muscle}kg</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
