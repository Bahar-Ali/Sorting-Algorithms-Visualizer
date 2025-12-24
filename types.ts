export type AlgorithmType = 
  | 'bubble' 
  | 'selection' 
  | 'insertion' 
  | 'merge' 
  | 'quick' 
  | 'heap';

export interface SortStep {
  type: 'compare' | 'swap' | 'overwrite' | 'sorted' | 'sub-sorted';
  indices: number[];
  value?: number; // Used for overwrite (merge sort)
}

export type SortGenerator = Generator<SortStep, void, unknown>;

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
}

export const ALGORITHMS: AlgorithmInfo[] = [
  { 
    id: 'bubble', 
    name: 'Bubble Sort', 
    description: 'Repeatedly swaps adjacent elements if they are in the wrong order. Large values "bubble" to the top.' 
  },
  { 
    id: 'merge', 
    name: 'Merge Sort', 
    description: 'Divides the list into smaller sub-lists, sorts them, and then merges them back together like a zipper.' 
  },
  { 
    id: 'insertion', 
    name: 'Insertion Sort', 
    description: 'Builds the sorted array one item at a time, picking an element and sliding it into its correct spot.' 
  },
  { 
    id: 'quick', 
    name: 'Quick Sort', 
    description: 'Picks a "pivot" element and partitions the array into smaller elements (left) and larger elements (right).' 
  },
  { 
    id: 'selection', 
    name: 'Selection Sort', 
    description: 'Repeatedly finds the minimum element from the unsorted part and puts it at the beginning.' 
  },
  { 
    id: 'heap', 
    name: 'Heap Sort', 
    description: 'Builds a heap data structure (max-heap) and repeatedly extracts the maximum element.' 
  },
];