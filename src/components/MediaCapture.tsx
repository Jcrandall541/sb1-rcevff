import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Video, Mic, StopCircle } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface MediaCaptureProps {
  onDataCaptured: (data: { type: string; content: string }) => void;
}

const MediaCapture: React.FC<MediaCaptureProps> = ({ onDataCaptured }) => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const chunksRef = useRef<Blob[]>([]);

  // Speech recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startSpeechRecognition = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopSpeechRecognition = () => {
    SpeechRecognition.stopListening();
    if (transcript) {
      onDataCaptured({ type: 'speech', content: transcript });
    }
  };

  // Screen capture
  const captureScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        onDataCaptured({ type: 'screen_recording', content: videoUrl });
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting screen capture:', error);
    }
  };

  // OCR processing
  const processImage = async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(imageUrl);
      await worker.terminate();
      onDataCaptured({ type: 'ocr', content: text });
    } catch (error) {
      console.error('OCR processing error:', error);
    }
    setIsProcessing(false);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        processImage(imageSrc);
      }
    }
  }, [webcamRef]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={capture}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={isProcessing}
        >
          <Camera size={18} />
          <span>Capture Screen Text</span>
        </button>

        <button
          onClick={isRecording ? stopRecording : captureScreen}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isRecording ? <StopCircle size={18} /> : <Video size={18} />}
          <span>{isRecording ? 'Stop Recording' : 'Record Screen'}</span>
        </button>

        <button
          onClick={listening ? stopSpeechRecognition : startSpeechRecognition}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            listening
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {listening ? <StopCircle size={18} /> : <Mic size={18} />}
          <span>{listening ? 'Stop Listening' : 'Start Listening'}</span>
        </button>
      </div>

      {listening && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-300">Listening... {transcript}</p>
        </div>
      )}

      <div className="relative">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default MediaCapture;