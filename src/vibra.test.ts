import vibra from './vibra';

describe('vibra', () => {
  describe('initialization', () => {
    it('should initialize with the provided value', () => {
      const store = vibra(42);
      expect(store.get()).toBe(42);
    });

    it('should initialize with complex objects', () => {
      const initialValue = { name: 'test', count: 0 };
      const store = vibra(initialValue);
      expect(store.get()).toEqual(initialValue);
    });

    it('should initialize with null', () => {
      const store = vibra(null);
      expect(store.get()).toBeNull();
    });
  });

  describe('get and set', () => {
    it('should update and retrieve values correctly', () => {
      const store = vibra(0);
      store.set(1);
      expect(store.get()).toBe(1);
    });

    it('should not trigger subscribers when setting the same value', () => {
      const store = vibra(1);
      const callback = jest.fn();
      store.subscribe(callback, { callOnSubscribe: true });
      store.set(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(1);
    });

    it('should handle multiple set operations', () => {
      const store = vibra(0);
      store.set(1);
      store.set(2);
      store.set(3);
      expect(store.get()).toBe(3);
    });
  });

  describe('subscriptions', () => {
    it('should call subscribers when value changes', () => {
      const store = vibra(0);
      const callback = jest.fn();
      store.subscribe(callback);
      store.set(1);
      expect(callback).toHaveBeenCalledWith(1);
    });

    it('should support multiple subscribers', () => {
      const store = vibra(0);
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      store.subscribe(callback1);
      store.subscribe(callback2);
      store.set(1);
      expect(callback1).toHaveBeenCalledWith(1);
      expect(callback2).toHaveBeenCalledWith(1);
    });

    it('should allow unsubscribing', () => {
      const store = vibra(0);
      const callback = jest.fn();
      const unsubscribe = store.subscribe(callback, { callOnSubscribe: true });
      expect(callback).toHaveBeenCalledWith(0);
      unsubscribe();
      store.set(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call subscribers with initial value by default', () => {
      const store = vibra(42);
      const callback = jest.fn();
      store.subscribe(callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should respect callOnSubscribe option', () => {
      const store = vibra(42);
      const callback = jest.fn();
      
      // Without callOnSubscribe
      store.subscribe(callback);
      expect(callback).not.toHaveBeenCalled();
      
      // With callOnSubscribe
      const callback2 = jest.fn();
      store.subscribe(callback2, { callOnSubscribe: true });
      expect(callback2).toHaveBeenCalledWith(42);
    });

    it('should handle callOnSubscribe with multiple subscribers', () => {
      const store = vibra(42);
      const callbacks = Array.from({ length: 3 }, () => jest.fn());
      
      // Subscribe with different options
      store.subscribe(callbacks[0], { callOnSubscribe: true });
      store.subscribe(callbacks[1], { callOnSubscribe: false });
      store.subscribe(callbacks[2], { callOnSubscribe: true });
      
      expect(callbacks[0]).toHaveBeenCalledWith(42);
      expect(callbacks[1]).not.toHaveBeenCalled();
      expect(callbacks[2]).toHaveBeenCalledWith(42);
    });

    it('should maintain subscription behavior after callOnSubscribe', () => {
      const store = vibra(42);
      const callback = jest.fn();
      
      store.subscribe(callback, { callOnSubscribe: true });
      expect(callback).toHaveBeenCalledWith(42);
      
      store.set(43);
      expect(callback).toHaveBeenCalledWith(43);
    });
  });

  describe('type safety', () => {
    it('should maintain type safety with different types', () => {
      const numberStore = vibra(0);
      const stringStore = vibra('');
      const booleanStore = vibra(false);
      const arrayStore = vibra<number[]>([]);
      const objectStore = vibra<{ id: number }>({ id: 1 });

      expect(typeof numberStore.get()).toBe('number');
      expect(typeof stringStore.get()).toBe('string');
      expect(typeof booleanStore.get()).toBe('boolean');
      expect(Array.isArray(arrayStore.get())).toBe(true);
      expect(typeof objectStore.get()).toBe('object');
    });

    it('should maintain type safety with SubscribeOptions', () => {
      const store = vibra(42);
      const callback = (value: number) => {
        // Use value to avoid linter error
        expect(typeof value).toBe('number');
      };
      
      // These should compile without type errors
      store.subscribe(callback);
      store.subscribe(callback, {});
      store.subscribe(callback, { callOnSubscribe: true });
      store.subscribe(callback, { callOnSubscribe: false });
    });
  });

  describe('edge cases', () => {
    it('should handle undefined values', () => {
      const store = vibra<number | undefined>(undefined);
      expect(store.get()).toBeUndefined();
      store.set(1);
      expect(store.get()).toBe(1);
    });

    it('should handle empty arrays and objects', () => {
      const arrayStore = vibra<number[]>([]);
      const objectStore = vibra<Record<string, never>>({});

      expect(arrayStore.get()).toEqual([]);
      expect(objectStore.get()).toEqual({});
    });

    it('should handle multiple subscriptions and unsubscriptions', () => {
      const store = vibra(0);
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const callback3 = jest.fn();

      const unsubscribe1 = store.subscribe(callback1, { callOnSubscribe: true });
      const unsubscribe2 = store.subscribe(callback2, { callOnSubscribe: true });
      const unsubscribe3 = store.subscribe(callback3, { callOnSubscribe: true });

      expect(callback1).toHaveBeenCalledWith(0);
      expect(callback2).toHaveBeenCalledWith(0);
      expect(callback3).toHaveBeenCalledWith(0);

      store.set(1);
      expect(callback1).toHaveBeenCalledWith(1);
      expect(callback2).toHaveBeenCalledWith(1);
      expect(callback3).toHaveBeenCalledWith(1);

      unsubscribe1();
      unsubscribe2();
      unsubscribe3();

      store.set(2);
      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(2);
      expect(callback3).toHaveBeenCalledTimes(2);
    });
  });
});
