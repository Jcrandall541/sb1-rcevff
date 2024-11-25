import React, { useState } from 'react';
import { Key, Shield } from 'lucide-react';

const WalletImport: React.FC = () => {
  const [privateKey, setPrivateKey] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Key className="text-blue-400" size={24} />
        <h2 className="text-2xl font-bold">Wallet Import</h2>
      </div>

      <div className="bg-black/30 rounded-xl p-6 border border-gray-800">
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-2">Private Key</label>
            <input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your private key"
            />
          </div>

          <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-lg">
            <Shield size={16} />
            <span className="text-sm">Your private key is encrypted and never stored</span>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
            Import Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletImport;