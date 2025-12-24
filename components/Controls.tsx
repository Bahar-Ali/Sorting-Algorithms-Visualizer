import React from 'react';
import { AlgorithmType, ALGORITHMS } from '../types';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';

interface ControlsProps {
  algorithm: AlgorithmType;
  setAlgorithm: (algo: AlgorithmType) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onGenerate: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  arraySize: number;
  setArraySize: (size: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  algorithm,
  setAlgorithm,
  isPlaying,
  onPlayPause,
  onReset,
  onGenerate,
  speed,
  setSpeed,
  arraySize,
  setArraySize
}) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 w-full max-w-6xl mx-auto mb-6">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
        
        {/* Algorithm Selection */}
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start w-full lg:w-auto">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => !isPlaying && setAlgorithm(algo.id)}
              disabled={isPlaying}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                algorithm === algo.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={onGenerate}
            disabled={isPlaying}
            className="p-3 rounded-full bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Generate New Array"
          >
            <Shuffle size={20} />
          </button>
          
          <button
            onClick={onReset}
            disabled={isPlaying}
            className="p-3 rounded-full bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Reset Current Array"
          >
            <RotateCcw size={20} />
          </button>

          <button
            onClick={onPlayPause}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95 ${
              isPlaying 
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' 
                : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={20} fill="currentColor" /> Pause
              </>
            ) : (
              <>
                <Play size={20} fill="currentColor" /> Play
              </>
            )}
          </button>
        </div>

        {/* Sliders */}
        <div className="flex flex-col gap-4 w-full lg:w-64">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>Speed</span>
              <span>{Math.round((101 - speed)/10)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={101 - speed}
              onChange={(e) => setSpeed(101 - Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
             <div className="flex justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>Size</span>
              <span>{arraySize} Items</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

      </div>

      {/* Description */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <h3 className="text-blue-400 font-bold mb-1 flex items-center gap-2">
          {ALGORITHMS.find(a => a.id === algorithm)?.name}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          {ALGORITHMS.find(a => a.id === algorithm)?.description}
        </p>
      </div>
    </div>
  );
};

export default Controls;