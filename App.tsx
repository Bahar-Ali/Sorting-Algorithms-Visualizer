import React, { useState, useEffect, useRef, useCallback } from 'react';
import Controls from './components/Controls';
import Bar from './components/Bar';
import { AlgorithmType, SortGenerator, SortStep } from './types';
import { 
  bubbleSort, 
  selectionSort, 
  insertionSort, 
  mergeSort, 
  quickSort, 
  heapSort 
} from './services/sortingAlgorithms';

const App: React.FC = () => {
  // --- State ---
  const [arraySize, setArraySize] = useState<number>(50);
  const [array, setArray] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bubble');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50); // Delay in ms (lower is faster)
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // --- Visual State ---
  const [compareIndices, setCompareIndices] = useState<number[]>([]);
  const [swapIndices, setSwapIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
  const [subSortedIndices, setSubSortedIndices] = useState<Set<number>>(new Set());

  // --- Refs ---
  const generatorRef = useRef<SortGenerator | null>(null);
  const timerRef = useRef<number | null>(null);
  const initialArrayRef = useRef<number[]>([]); // To reset to same unsorted state

  // --- Initialization ---
  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 5);
    setArray(newArray);
    initialArrayRef.current = [...newArray];
    resetVisuals();
  }, [arraySize]);

  const resetVisuals = () => {
    setIsPlaying(false);
    setIsFinished(false);
    setCompareIndices([]);
    setSwapIndices([]);
    setSortedIndices(new Set());
    setSubSortedIndices(new Set());
    generatorRef.current = null;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleReset = () => {
    resetVisuals();
    setArray([...initialArrayRef.current]);
  };

  // Generate initial array on mount or size change
  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // --- Sorting Logic ---
  const getGenerator = (type: AlgorithmType, data: number[]): SortGenerator => {
    switch (type) {
      case 'bubble': return bubbleSort(data);
      case 'selection': return selectionSort(data);
      case 'insertion': return insertionSort(data);
      case 'merge': return mergeSort(data);
      case 'quick': return quickSort(data);
      case 'heap': return heapSort(data);
      default: return bubbleSort(data);
    }
  };

  const step = useCallback(() => {
    if (!generatorRef.current) {
      generatorRef.current = getGenerator(algorithm, array);
    }

    const { value, done } = generatorRef.current.next();

    if (done) {
      setIsPlaying(false);
      setIsFinished(true);
      setCompareIndices([]);
      setSwapIndices([]);
      return;
    }

    const stepValue = value as SortStep;

    // Handle visuals
    if (stepValue.type === 'compare') {
      setCompareIndices(stepValue.indices);
      setSwapIndices([]);
    } else if (stepValue.type === 'swap') {
      setSwapIndices(stepValue.indices);
      setCompareIndices([]); // Often beneficial to clear compare, or keep them. 
      // Perform the swap in React state
      setArray((prev) => {
        const newArr = [...prev];
        const [i, j] = stepValue.indices;
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        return newArr;
      });
    } else if (stepValue.type === 'overwrite') {
      setSwapIndices(stepValue.indices); // Use swap color for overwrite
      setArray((prev) => {
        const newArr = [...prev];
        const [idx] = stepValue.indices;
        if (stepValue.value !== undefined) {
          newArr[idx] = stepValue.value;
        }
        return newArr;
      });
    } else if (stepValue.type === 'sorted') {
      setSortedIndices((prev) => {
        const newSet = new Set(prev);
        stepValue.indices.forEach(idx => newSet.add(idx));
        return newSet;
      });
      // Clear transient states
      setCompareIndices([]);
      setSwapIndices([]);
    } else if (stepValue.type === 'sub-sorted') {
       setSubSortedIndices((prev) => {
        const newSet = new Set(prev);
        stepValue.indices.forEach(idx => newSet.add(idx));
        return newSet;
      });
    }

    // Schedule next step
    timerRef.current = window.setTimeout(step, speed);
  }, [algorithm, array, speed]);

  // Handle Play/Pause Toggle
  useEffect(() => {
    if (isPlaying) {
      step();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, step]);

  const togglePlay = () => {
    if (isFinished) {
      handleReset(); // If finished, reset first then play
      setTimeout(() => setIsPlaying(true), 0);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 lg:p-8 flex flex-col items-center">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
          Sorting Visualizer
        </h1>
        <p className="text-slate-400 text-lg">Watch algorithms come to life</p>
      </header>

      {/* Main Controls */}
      <Controls 
        algorithm={algorithm}
        setAlgorithm={(algo) => {
          setAlgorithm(algo);
          handleReset();
        }}
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        onReset={handleReset}
        onGenerate={generateArray}
        speed={speed}
        setSpeed={setSpeed}
        arraySize={arraySize}
        setArraySize={(size) => {
          setArraySize(size);
          // generateArray is triggered by useEffect on arraySize change
        }}
      />

      {/* Visualization Area */}
      <main className="w-full max-w-6xl flex-grow flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 md:p-8 shadow-2xl backdrop-blur-sm min-h-[400px]">
        
        {/* Chart Container */}
        <div className="w-full h-80 md:h-96 flex justify-center items-end gap-[2px] md:gap-1">
          {array.map((value, index) => {
            let state: 'default' | 'compare' | 'swap' | 'sorted' | 'sub-sorted' = 'default';
            
            if (sortedIndices.has(index)) {
              state = 'sorted';
            } else if (swapIndices.includes(index)) {
              state = 'swap';
            } else if (compareIndices.includes(index)) {
              state = 'compare';
            } else if (subSortedIndices.has(index)) {
              state = 'sub-sorted';
            }

            return (
              <Bar 
                key={index}
                value={value}
                maxValue={Math.max(...initialArrayRef.current, 100)} // keep scale consistent
                state={state}
                widthPercentage={100 / arraySize}
              />
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium text-slate-300">
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-blue-500 rounded"></div>
             <span>Unsorted</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-yellow-400 rounded"></div>
             <span>Compare</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-red-500 rounded"></div>
             <span>Swap/Write</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-green-500 rounded"></div>
             <span>Sorted</span>
           </div>
        </div>
      </main>

    </div>
  );
};

export default App;