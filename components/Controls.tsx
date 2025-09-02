import React from 'react';
import { MicrophoneIcon, StopIcon, ProcessingIcon, PauseIcon, PlayIcon } from './IconComponents';

interface ControlsProps {
  sessionActive: boolean;
  isListening: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
  onTogglePause: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  sessionActive,
  isListening,
  isPaused,
  isProcessing,
  onStart,
  onStop,
  onTogglePause
}) => {
  let statusText = 'Click "Start Listening" to begin';
  if (isProcessing) statusText = 'AI is thinking...';
  else if (isPaused) statusText = 'Paused...';
  else if (isListening) statusText = 'Listening... Speak now';
  else if (sessionActive) statusText = 'Click Resume or Stop';

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center h-24">
        {!sessionActive ? (
          <button
            onClick={onStart}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-105 active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed"
            aria-label="Start listening"
          >
            <MicrophoneIcon />
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={onTogglePause}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transform transition-all hover:scale-105 active:scale-95 ${
                isPaused ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              aria-label={isPaused ? "Resume listening" : "Pause listening"}
            >
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </button>
            <button
              onClick={onStop}
              className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-105 active:scale-95"
              aria-label="Stop listening"
            >
              <StopIcon />
            </button>
          </div>
        )}
      </div>
      <p className="text-center text-gray-400 h-6 flex items-center">
        {isProcessing && <ProcessingIcon />}
        {statusText}
      </p>
    </div>
  );
};

export default Controls;
