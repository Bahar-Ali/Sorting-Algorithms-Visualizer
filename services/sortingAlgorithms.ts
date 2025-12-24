import { SortStep } from '../types';

/**
 * Bubble Sort Generator
 */
export function* bubbleSort(array: number[]): Generator<SortStep> {
  const arr = [...array];
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', indices: [j, j + 1] };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { type: 'swap', indices: [j, j + 1] };
      }
    }
    yield { type: 'sorted', indices: [n - i - 1] };
  }
  // Ensure all are marked sorted at the end (for 0th index)
  yield { type: 'sorted', indices: [0] };
}

/**
 * Selection Sort Generator
 */
export function* selectionSort(array: number[]): Generator<SortStep> {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', indices: [minIdx, j] };
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { type: 'swap', indices: [i, minIdx] };
    }
    yield { type: 'sorted', indices: [i] };
  }
}

/**
 * Insertion Sort Generator
 */
export function* insertionSort(array: number[]): Generator<SortStep> {
  const arr = [...array];
  const n = arr.length;

  yield { type: 'sorted', indices: [0] }; // First element is trivially sorted

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    
    yield { type: 'compare', indices: [i, j] };

    while (j >= 0 && arr[j] > key) {
      yield { type: 'compare', indices: [j + 1, j] }; // Visual compare
      arr[j + 1] = arr[j];
      yield { type: 'overwrite', indices: [j + 1], value: arr[j] };
      j = j - 1;
    }
    arr[j + 1] = key;
    yield { type: 'overwrite', indices: [j + 1], value: key };
    
    // Mark 0 to i as sorted
    for(let k=0; k<=i; k++) yield { type: 'sub-sorted', indices: [k] };
  }
  // Final cleanup pass to mark all green
  for(let k=0; k<n; k++) yield { type: 'sorted', indices: [k] };
}

/**
 * Merge Sort Generator
 */
export function* mergeSort(array: number[]): Generator<SortStep> {
  const arr = [...array];
  yield* mergeSortHelper(arr, 0, arr.length - 1);
  // Mark all as sorted at the end
  for (let i = 0; i < arr.length; i++) {
    yield { type: 'sorted', indices: [i] };
  }
}

function* mergeSortHelper(arr: number[], left: number, right: number): Generator<SortStep> {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  yield* mergeSortHelper(arr, left, mid);
  yield* mergeSortHelper(arr, mid + 1, right);
  yield* merge(arr, left, mid, right);
}

function* merge(arr: number[], left: number, mid: number, right: number): Generator<SortStep> {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);
  
  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    yield { type: 'compare', indices: [left + i, mid + 1 + j] };
    
    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      yield { type: 'overwrite', indices: [k], value: arr[k] };
      i++;
    } else {
      arr[k] = rightArr[j];
      yield { type: 'overwrite', indices: [k], value: arr[k] };
      j++;
    }
    k++;
  }

  while (i < leftArr.length) {
    arr[k] = leftArr[i];
    yield { type: 'overwrite', indices: [k], value: arr[k] };
    i++;
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j];
    yield { type: 'overwrite', indices: [k], value: arr[k] };
    j++;
    k++;
  }
}

/**
 * Quick Sort Generator
 */
export function* quickSort(array: number[]): Generator<SortStep> {
  const arr = [...array];
  yield* quickSortHelper(arr, 0, arr.length - 1);
  
  // Mark all as sorted
  for (let i = 0; i < arr.length; i++) {
    yield { type: 'sorted', indices: [i] };
  }
}

function* quickSortHelper(arr: number[], low: number, high: number): Generator<SortStep> {
  if (low < high) {
    const pi = yield* partition(arr, low, high);
    yield { type: 'sorted', indices: [pi] }; // Pivot is in correct place
    yield* quickSortHelper(arr, low, pi - 1);
    yield* quickSortHelper(arr, pi + 1, high);
  } else if (low === high) {
     yield { type: 'sorted', indices: [low] };
  }
}

function* partition(arr: number[], low: number, high: number): Generator<any> {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    yield { type: 'compare', indices: [j, high] }; // Compare with pivot
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield { type: 'swap', indices: [i, j] };
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  yield { type: 'swap', indices: [i + 1, high] };
  return i + 1;
}

/**
 * Heap Sort Generator
 */
export function* heapSort(array: number[]): Generator<SortStep> {
  const arr = [...array];
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i);
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    yield { type: 'swap', indices: [0, i] };
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    yield { type: 'sorted', indices: [i] }; // i is now sorted

    // Call max heapify on the reduced heap
    yield* heapify(arr, i, 0);
  }
  yield { type: 'sorted', indices: [0] };
}

function* heapify(arr: number[], n: number, i: number): Generator<SortStep> {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;

  if (l < n) {
    yield { type: 'compare', indices: [l, largest] };
    if (arr[l] > arr[largest]) {
      largest = l;
    }
  }

  if (r < n) {
    yield { type: 'compare', indices: [r, largest] };
    if (arr[r] > arr[largest]) {
      largest = r;
    }
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield { type: 'swap', indices: [i, largest] };
    yield* heapify(arr, n, largest);
  }
}
