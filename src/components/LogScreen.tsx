import React from 'react';
import { Terminal } from 'lucide-react';

const LogScreen: React.FC = () => {
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl h-full border border-gray-800 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center gap-2">
        <Terminal size={18} className="text-blue-400" />
        <h3 className="font-medium">Transaction Log</h3>
      </div>
      
      <div className="flex-1 p-4 font-mono text-sm overflow-auto space-y-2">
        <div className="text-green-400">[SUCCESS] Wallet connected</div>
        <div className="text-yellow-400">[PENDING] Checking contract safety...</div>
        <div className="text-blue-400">[INFO] API configuration loaded</div>
        {/* Add more log entries as needed */}
      </div>

      <div className="p-4 border-t border-gray-800 bg-black/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">System Online</span>
        </div>
      </div>
    </div>
  );
};

export default LogScreen;