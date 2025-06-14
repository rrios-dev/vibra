import { SubscribeOptions, Subscriber, Unsubscribe, Store } from './types';
/**
 * Vibra - A Simple Yet Powerful State Management Solution
 *
 * Vibra is a lightweight state management library that provides a simple and efficient
 * way to handle reactive state in your applications.
 * It follows the observer pattern to create a
 * reactive data store that can be used across your application.
 *
 * Key Features:
 * - Type-safe with TypeScript support
 * - Minimal API surface (get, set, subscribe)
 * - Reactive updates through subscription system
 * - Memory efficient with automatic cleanup
 * - Zero dependencies
 *
 * @template T - The type of the state value
 * @param initialValue - The initial value for the state
 * @returns A store object implementing the Store interface
 *
 * @example
 * ```typescript
 * const counter = vibra(0);
 *
 * // Subscribe to changes
 * const unsubscribe = counter.subscribe((value) => {
 *   console.log(`Counter changed to: ${value}`);
 * });
 *
 * // Update the state
 * counter.set(1);
 *
 * // Get current value
 * console.log(counter.get()); // 1
 *
 * // Cleanup subscription
 * unsubscribe();
 * ```
 */

function vibra<T>(initialValue: T): Store<T> {
  let data = initialValue;
  const subscribers = new Set<Subscriber<T>>();

  function subscribe(
    callback: Subscriber<T>,
    { callOnSubscribe = false }: SubscribeOptions = {},
  ): Unsubscribe {
    subscribers.add(callback);
    // Call the callback immediately with the current value
    if (callOnSubscribe) callback(data);

    return () => subscribers.delete(callback);
  }

  function set(value: T): void {
    if (data !== value) {
      data = value;
      subscribers.forEach((callback) => callback(data));
    }
  }

  function get(): T {
    return data;
  }

  return {
    get,
    set,
    subscribe,
  };
}

export type Vibra<T> = Store<T>;

export default vibra;
