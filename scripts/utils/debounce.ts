// Debounce utility: delays invocation until after `delay` ms have elapsed since the last call.
// Call `.cancel()` on the returned function to clear any pending timeout.
export type DebouncedFn<T extends (...args: unknown[]) => void> = T & { cancel(): void };

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number,
): DebouncedFn<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const debounced = ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as DebouncedFn<T>;
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
}
