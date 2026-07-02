import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { C } from '../theme';
import { calculateMetrics } from '../utils/financial';
import {
  analyzeBasicQuestions,
  getSimulatedAiAnalysis,
  getFundingAnalysis,
  getGrowthAnalysis,
} from '../utils/advisor';
import type { ChatMessage } from '../types';

export function AiAdvisorPage() {
  const { transactions } = useApp();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '👋 Hello! I am your AI Business Advisor. I can analyze your accounts in real-time. Ask me anything, or use the quick actions below!',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (transactions.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">🤖</div>
          <div className="empty-state-title">No Data Available</div>
          <div className="empty-state-text">
            Add some transactions so the AI can analyze your numbers and
            provide recommendations.
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate('/add-transaction')}>
            + Add Transaction
          </button>
        </div>
      </div>
    );
  }

  const metrics = calculateMetrics(transactions);

  const processMessage = (text: string) => {
    const q = text.toLowerCase();
    const basicStats = analyzeBasicQuestions(metrics, transactions, text);

    let aiResponse: string;
    if (q.includes('health') || q.includes('analyze')) {
      aiResponse = getSimulatedAiAnalysis(metrics);
    } else if (q.includes('funding') || q.includes('options')) {
      aiResponse = getFundingAnalysis(metrics);
    } else if (q.includes('growth') || q.includes('opportunity')) {
      aiResponse = getGrowthAnalysis(metrics);
    } else {
      aiResponse = '';
    }

    let finalResponse = '';
    if (basicStats) {
      finalResponse = basicStats;
      if (aiResponse) {
        finalResponse +=
          '\n\n━━━━━━━━━━━━━━━━━━━━\n\n🤖 AI Strategic Analysis:\n' +
          aiResponse;
      }
    } else if (aiResponse) {
      finalResponse = aiResponse;
    } else {
      finalResponse = `Here are your current core metrics:\n\n💰 Cash: ₹${metrics.cash.toFixed(2)}\n📊 Revenue: ₹${metrics.totalRevenue.toFixed(2)}\n📈 Net Income: ₹${metrics.netIncome.toFixed(2)}\n${
        Math.abs(
          metrics.totalAssets -
            (metrics.totalLiabilities + metrics.totalEquity),
        ) < 0.01
          ? '✅ Equation Balanced'
          : '⚠️ Equation Mismatch'
      }\n\nTry asking about "financial health", "funding options", or "growth opportunities" for detailed analysis!`;
    }

    return finalResponse;
  };

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    const text = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    setMessages(prev => [...prev, { role: 'user', content: text }]);

    setTimeout(() => {
      const response = processMessage(text);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const triggerQuickAction = (action: string) => {
    setMessages(prev => [...prev, { role: 'user', content: action }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = processMessage(action);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-layout">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-dot" />
        <span className="chat-header-title">
          ✨ Financial Intelligence Engine
        </span>
      </div>

      {/* Messages */}
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`message-row ${isUser ? 'user' : 'ai'}`}>
              {!isUser && (
                <div
                  className="avatar"
                  style={{ backgroundColor: C.goldLight, color: C.gold }}>
                  AI
                </div>
              )}
              <div className={`bubble ${isUser ? 'user' : 'ai'}`}>
                {msg.content}
              </div>
              {isUser && (
                <div
                  className="avatar"
                  style={{ backgroundColor: C.textMuted, color: '#fff' }}>
                  U
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="message-row ai">
            <div
              className="avatar"
              style={{ backgroundColor: C.goldLight, color: C.gold }}>
              AI
            </div>
            <div className="bubble ai">
              <span className="typing-dots">● ● ●</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="chat-quick-actions">
        <button
          className="quick-chip"
          onClick={() => triggerQuickAction('Analyze Financial Health')}>
          📊 Health
        </button>
        <button
          className="quick-chip"
          onClick={() => triggerQuickAction('Funding Options')}>
          💰 Funding
        </button>
        <button
          className="quick-chip"
          onClick={() => triggerQuickAction('Growth Opportunities')}>
          📈 Growth
        </button>
        <button
          className="quick-chip"
          onClick={() => setInputValue('How is my cash position?')}>
          💵 Cash
        </button>
        <button
          className="quick-chip"
          onClick={() => setInputValue('What is my current ratio?')}>
          📊 Ratio
        </button>
      </div>

      {/* Input Area */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Ask about your financials..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={isTyping || !inputValue.trim()}>
          ↑
        </button>
      </div>

      {/* Footer */}
      <div className="chat-footer">
        <div className="chat-footer-text">
          ⓘ Simulated Financial AI Engine. Production API endpoints
          configurable.
        </div>
      </div>
    </div>
  );
}
