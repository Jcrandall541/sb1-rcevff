import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Zap, AlertCircle } from 'lucide-react';
import { useAIStore } from '../store/aiStore';
import MediaCapture from './MediaCapture';
import VoiceFileControls from './VoiceFileControls';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'speech' | 'ocr' | 'screen_recording' | 'file';
}

const AiAssistant: React.FC = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [powerMode, setPowerMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isProcessing,
    apiKeys,
    error,
    initializeAssistant,
    sendMessage
  } = useAIStore();

  useEffect(() => {
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      initializeAssistant();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSendMessage = async (text: string = message, type: Message['type'] = 'text') => {
    if (!text.trim() || isProcessing) return;

    const userMessage = text;
    setMessage('');
    
    setConversation(prev => [...prev, { role: 'user', content: userMessage, type }]);

    if (!apiKeys.openai) {
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: 'Please configure the OpenAI API key in the API Configuration section first.'
      }]);
      return;
    }

    const response = await sendMessage(userMessage);
    
    // Convert response to speech if it's not a screen recording or file
    if (type !== 'screen_recording' && type !== 'file') {
      const utterance = new SpeechSynthesisUtterance(response);
      window.speechSynthesis.speak(utterance);
    }

    setConversation(prev => [...prev, { role: 'assistant', content: response }]);
  };

  const handleMediaData = (data: { type: string; content: string }) => {
    handleSendMessage(data.content, data.type as Message['type']);
  };

  const handleVoiceInput = (text: string) => {
    handleSendMessage(text, 'speech');
  };

  const handleFileContent = (content: string) => {
    handleSendMessage(content, 'file');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Bot className="text-blue-400" size={24} />
          <h2 className="text-2xl font-bold">Unrestricted AI Terminal</h2>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}
          <button
            onClick={() => setPowerMode(!powerMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              powerMode 
                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                : 'bg-black/30 border border-gray-800 hover:bg-black/50'
            }`}
          >
            <Zap size={16} />
            <span>{powerMode ? 'Unrestricted Mode' : 'Basic Mode'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto space-y-4">
        <MediaCapture onDataCaptured={handleMediaData} />
        
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-500/20 text-blue-100'
                  : 'bg-purple-500/20 text-purple-100'
              }`}
            >
              {msg.type && <span className="text-xs opacity-50">[{msg.type}]</span>}
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isProcessing ? 'Processing...' : 'Enter your command or question...'}
            disabled={isProcessing}
            className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
          />
          <VoiceFileControls
            onVoiceInput={handleVoiceInput}
            onFileContent={handleFileContent}
            isProcessing={isProcessing}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;