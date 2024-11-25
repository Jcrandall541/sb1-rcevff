import React, { useState, useEffect } from 'react';
import { Terminal, Bot, Search } from 'lucide-react';
import { useAIStore } from '../store/aiStore';

const ApiSection: React.FC = () => {
  const { setAPIKeys, apiKeys, validateSolscanAPI } = useAIStore();
  const [localKeys, setLocalKeys] = useState({
    openai: '',
    solscan: ''
  });
  const [validationStatus, setValidationStatus] = useState({
    openai: false,
    solscan: false
  });

  useEffect(() => {
    const storedKeys = {
      openai: localStorage.getItem('openai_key') || '',
      solscan: localStorage.getItem('solscan_key') || ''
    };
    setLocalKeys(storedKeys);
    if (storedKeys.openai || storedKeys.solscan) {
      setAPIKeys(storedKeys);
    }
  }, []);

  const handleSave = async () => {
    localStorage.setItem('openai_key', localKeys.openai);
    localStorage.setItem('solscan_key', localKeys.solscan);
    
    await setAPIKeys(localKeys);
    const solscanValid = await validateSolscanAPI();
    
    setValidationStatus({
      openai: localKeys.openai.startsWith('sk-'),
      solscan: solscanValid
    });
  };

  const handleApiKeyChange = (id: string, value: string) => {
    setLocalKeys(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Terminal className="text-blue-400" size={24} />
        <h2 className="text-2xl font-bold">API Configuration</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { id: 'openai', name: 'OpenAI', icon: Bot, placeholder: 'Enter OpenAI API Key' },
          { id: 'solscan', name: 'Solscan', icon: Search, placeholder: 'Enter Solscan API Key' }
        ].map((api) => (
          <div key={api.id} className="bg-black/30 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <api.icon size={18} className="text-blue-400" />
                <h3 className="text-lg font-medium">{api.name}</h3>
              </div>
              {validationStatus[api.id] && (
                <span className="text-green-400 text-sm">Validated</span>
              )}
            </div>
            <input
              type="password"
              value={localKeys[api.id]}
              onChange={(e) => handleApiKeyChange(api.id, e.target.value)}
              className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder={api.placeholder}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Save API Configuration
      </button>
    </div>
  );
};

export default ApiSection;