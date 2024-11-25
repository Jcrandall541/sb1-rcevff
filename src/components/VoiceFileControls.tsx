import React, { useRef, useState } from 'react';
import { Mic, FileUp, StopCircle } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceFileControlsProps {
  onVoiceInput: (text: string) => void;
  onFileContent: (content: string) => void;
  isProcessing?: boolean;
}

const VoiceFileControls: React.FC<VoiceFileControlsProps> = ({
  onVoiceInput,
  onFileContent,
  isProcessing = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      if (transcript) {
        onVoiceInput(transcript);
      }
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsListening(!isListening);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      onFileContent(text);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleListening}
        disabled={isProcessing}
        className={`p-2 rounded-lg transition-all ${
          isListening
            ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isListening ? 'Stop Recording' : 'Start Recording'}
      >
        {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="*/*"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        title="Upload File"
      >
        <FileUp size={20} />
      </button>

      {isListening && transcript && (
        <div className="px-3 py-1 bg-gray-800 rounded-lg text-sm text-gray-300">
          {transcript}
        </div>
      )}
    </div>
  );
};

export default VoiceFileControls;