// Debounce utility: delays invocation until after `delay` ms have elapsed since the last call.
export function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}
