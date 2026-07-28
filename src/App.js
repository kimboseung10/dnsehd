import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('routine');
  
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
  
  const [equipmentImage, setEquipmentImage] = useState(null);
  const [equipmentResponse, setEquipmentResponse] = useState('');
  
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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
    const file = e.target.files[0];
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
        <button 
          className={activeTab === 'routine' ? 'active' : ''} 
          onClick={() => setActiveTab('routine')}
        >
          맞춤 운동 추천 & 난이도 조절
        </button>
        <button 
          className={activeTab === 'equipment' ? 'active' : ''} 
          onClick={() => setActiveTab('equipment')}
        >
          카메라 기구 인식 및 설명
        </button>
      </div>

      {activeTab === 'routine' && (
        <form onSubmit={handleRoutineSubmit} className="form-box">
          <h3>1. 신체 정보 및 오늘 운동 부위 입력</h3>
          <div className="input-group">
            <input type="number" placeholder="키 (cm)" value={bodyInfo.height} onChange={(e) => setBodyInfo({...bodyInfo, height: e.target.value})} />
            <input type="number" placeholder="체중 (kg)" value={bodyInfo.weight} onChange={(e) => setBodyInfo({...bodyInfo, weight: e.target.value})} />
            <input type="number" placeholder="나이" value={bodyInfo.age} onChange={(e) => setBodyInfo({...bodyInfo, age: e.target.value})} />
          </div>
          
          <div className="input-group">
            <div style={{flex: 1}}>
              <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>운동 목표</label>
              <select value={bodyInfo.goal} onChange={(e) => setBodyInfo({...bodyInfo, goal: e.target.value})}>
                <option value="다이어트">다이어트</option>
                <option value="근비대">근비대 (근육 증가)</option>
                <option value="체형 교정">체형 교정</option>
              </select>
            </div>
            
            <div style={{flex: 1}}>
              <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>오늘 운동 부위</label>
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

          <h3>2. 오늘의 컨디션</h3>
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="최상">최상 (에너지 넘침)</option>
            <option value="보통">보통 (평소와 같음)</option>
            <option value="피곤함">피곤함 (컨디션 저조)</option>
          </select>

          <h3>3. 1세트 수행 후 피드백 (난이도 조절)</h3>
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
          <p className="desc">모바일 기기에서는 카메라가 직접 실행되며, PC에서는 사진 파일을 선택할 수 있습니다.</p>
          
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
    </div>
  );
}

export default App;
