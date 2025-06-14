/**
 * Options for subscribing to a Vibra store
 */
export interface SubscribeOptions {
  /**
   * If true, the callback will be called immediately with the current value
   * when subscribing. Defaults to false.
   */
  callOnSubscribe?: boolean;
}

/**
 * Type for a store subscriber callback function
 */
export type Subscriber<T> = (value: T) => void;

/**
 * Type for a store unsubscribe function
 */
export type Unsubscribe = () => void;

/**
 * Type for a store's public API
 */
export interface Store<T> {
  /**
   * Get the current value of the store
   */
  get(): T;
  
  /**
   * Set a new value for the store
   * @param value - The new value to set
   */
  set(value: T): void;
  
  /**
   * Subscribe to changes in the store
   * @param callback - Function to call when the value changes
   * @param options - Optional subscription options
   * @returns Function to unsubscribe from the store
   */
  subscribe(callback: Subscriber<T>, options?: SubscribeOptions): Unsubscribe;
}