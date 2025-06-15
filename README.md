# Vibra

[![npm version](https://img.shields.io/npm/v/vibra.svg)](https://www.npmjs.com/package/vibra)

> A blazing fast, type-safe, and minimal state management library for TypeScript and JavaScript. Effortless reactivity, subscriptions, and memory safety in a tiny package.

## 🚀 Features
- **Type-safe**: Full TypeScript support out of the box
- **Minimal API**: Only `get`, `set`, and `subscribe`
- **Reactive**: Efficient observer pattern for instant updates
- **Memory safe**: Automatic cleanup of subscriptions
- **Zero dependencies**: Lightweight and fast
- **Framework agnostic**: Works with any JS/TS project

## 📦 Installation

```bash
npm install vibra
# o
bun add vibra
```

## 🛠️ Basic Usage

```typescript
import vibra from 'vibra';

const counter = vibra(0);

// Subscribe to changes
const unsubscribe = counter.subscribe((value) => {
  console.log(`Counter changed to: ${value}`);
});

// Update the state
counter.set(1);

// Get current value
console.log(counter.get()); // 1

// Cleanup subscription
unsubscribe();
```

## ⚡ Advanced Usage

### Complex State
```typescript
const user = vibra({ name: 'Alice', age: 30 });
user.subscribe((u) => console.log(u));
user.set({ name: 'Bob', age: 25 });
```

### Type Safety
```typescript
const store = vibra<string | null>(null);
store.set('Ready!');
```

### Multiple Subscribers
```typescript
const store = vibra(0);
const unsub1 = store.subscribe(v => console.log('A', v));
const unsub2 = store.subscribe(v => console.log('B', v));
store.set(5);
// Both subscribers are notified
```

### Subscription Options
```typescript
const store = vibra(42);

// Default behavior: callback is not called on subscribe
store.subscribe(value => console.log('Changed:', value));

// With callOnSubscribe: callback is called immediately with current value
store.subscribe(
  value => console.log('Current:', value),
  { callOnSubscribe: true }
);

// Useful for initializing UI or state
const userStore = vibra({ name: 'Alice' });
userStore.subscribe(
  user => updateUI(user),
  { callOnSubscribe: true } // Update UI immediately
);
```

## 🧩 API Reference

### `vibra<T>(initialValue: T)`
Returns a store object with:
- `get(): T` — Get the current value
- `set(value: T): void` — Set a new value (notifies subscribers if changed)
- `subscribe(callback: (value: T) => void, options?: SubscribeOptions): () => void` — Subscribe to changes. Returns an unsubscribe function.

#### SubscribeOptions
```typescript
interface SubscribeOptions {
  callOnSubscribe?: boolean; // If true, callback is called immediately with current value
}
```

## ⚛️ React Integration

For React applications, we provide a dedicated package `vibra-react` that offers React hooks and components for seamless integration with Vibra stores. Check out the [vibra-react documentation](https://www.npmjs.com/package/vibra-react) for more details.

```bash
npm install vibra-react
# or
bun add vibra-react
```

## 💡 Why Vibra?
- **Ultra-lightweight**: No bloat, just state
- **Predictable**: No magic, no proxies, no hidden behaviors
- **Easy to test**: Simple, functional API
- **Perfect for libraries and apps**: Use it anywhere you need reactivity

## 🤝 Contributing
Pull requests and issues are welcome! Please open an issue to discuss your idea or bug before submitting a PR.

## 📄 License
MIT
