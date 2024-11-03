import { useState } from 'react';

export default function InputForm({ onAnalyze }) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (inputText.trim()) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_NLP_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: inputText })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const analysisResult = data.data.response;
        
        console.log('분석 결과:', analysisResult); // 콘솔에 분석 결과 출력
        
        onAnalyze(analysisResult);
        setInputText('');
      } catch (err) {
        console.error('Fetch error:', err);
        setError('API 요청 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '0.3px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter your text here"
        style={{
          padding: '10px',
          marginRight: '10px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '5px',
          color: '#333',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          background: 'rgba(255, 255, 255, 0.3)',
          border: 'none',
          borderRadius: '3px',
          color: '#333',
          cursor: 'pointer',
          transition: 'background 0.3s ease',
        }}
      >
        Analyze
      </button>
    </form>
  );
}
