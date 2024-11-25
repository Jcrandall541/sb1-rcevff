import React, { useState } from 'react';
import { Terminal, Key, Zap, AlertTriangle, ArrowUpRight, Wallet, Ban, RotateCcw, Bot } from 'lucide-react';
import TabPanel from './components/TabPanel';
import ApiSection from './components/ApiSection';
import LogScreen from './components/LogScreen';
import WalletImport from './components/WalletImport';
import AiAssistant from './components/AiAssistant';

function App() {
  const [activeTab, setActiveTab] = useState('wallet');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 inline-block">
            Quantum Trade Interface
          </h1>
        </header>

        {/* Top Grid - Navigation, Main Content, and Log */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Navigation */}
          <div className="col-span-2 bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-gray-800">
            <nav className="space-y-2">
              {[
                { id: 'wallet', icon: Wallet, label: 'Wallet Import' },
                { id: 'api', icon: Terminal, label: 'API Config' },
                { id: 'assistant', icon: Bot, label: 'AI Assistant' },
                { id: 'trade', icon: ArrowUpRight, label: 'Trading' },
                { id: 'frontrun', icon: Zap, label: 'Front Run' },
                { id: 'freeze', icon: Ban, label: 'Freeze Check' },
                { id: 'security', icon: AlertTriangle, label: 'Security' },
                { id: 'recover', icon: RotateCcw, label: 'Recovery' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                    activeTab === item.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="col-span-7 bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
            <TabPanel active={activeTab === 'wallet'}>
              <WalletImport />
            </TabPanel>
            <TabPanel active={activeTab === 'api'}>
              <ApiSection />
            </TabPanel>
            <TabPanel active={activeTab === 'assistant'}>
              <AiAssistant />
            </TabPanel>
          </div>

          {/* Right Panel - Log Screen */}
          <div className="col-span-3">
            <LogScreen />
          </div>
        </div>

        {/* Bottom Section - AI Chat Terminal */}
        <div className="col-span-12 bg-black/40 backdrop-blur-xl rounded-xl border border-gray-800 h-[600px]">
          <AiAssistant />
        </div>
      </div>
    </div>
  );
}

export default App;