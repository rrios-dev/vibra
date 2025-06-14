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

    it('should not trigger subscribers when setting the same value (except initial call)', () => {
      const store = vibra(1);
      const callback = jest.fn();
      store.subscribe(callback);
      store.set(1);
      // Debe llamarse solo una vez con el valor inicial
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
      const unsubscribe = store.subscribe(callback);
      unsubscribe();
      store.set(1);
      // Solo debe llamarse una vez con el valor inicial
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(0);
    });

    it('should call subscribers with initial value immediately', () => {
      const store = vibra(42);
      const callback = jest.fn();
      store.subscribe(callback);
      expect(callback).toHaveBeenCalledWith(42);
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

      const unsubscribe1 = store.subscribe(callback1);
      const unsubscribe2 = store.subscribe(callback2);
      const unsubscribe3 = store.subscribe(callback3);

      store.set(1);
      expect(callback1).toHaveBeenCalledWith(1);
      expect(callback2).toHaveBeenCalledWith(1);
      expect(callback3).toHaveBeenCalledWith(1);

      unsubscribe1();
      unsubscribe2();
      unsubscribe3();

      store.set(2);
      // Cada callback debe haberse llamado solo dos veces: inicial y primer set
      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(2);
      expect(callback3).toHaveBeenCalledTimes(2);
    });
  });
});
