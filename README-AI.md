# README-AI: Vibra

## Visión General
Vibra es una librería de manejo de estado minimalista, reactiva y type-safe para TypeScript y JavaScript. Su API es simple (`get`, `set`, `subscribe`) y está diseñada para ser predecible, fácil de testear y sin dependencias externas.

## Patrones Recomendados
- **Siempre usar tipos explícitos** al crear stores para máxima seguridad.
- **Separar lógica de estado** en stores independientes para cada dominio.
- **Desuscribirse siempre** cuando un componente o lógica ya no necesite el valor reactivo.
- **Evitar mutar objetos directamente**: usa `set` con un nuevo objeto para asegurar la reactividad.

## Ejemplo de Integración
```typescript
import vibra from 'vibra';

// Estado global
const themeStore = vibra<'light' | 'dark'>('light');

// En un componente React
useEffect(() => {
  const unsubscribe = themeStore.subscribe(theme => {
    // Actualiza el estado local o UI
  });
  return unsubscribe;
}, []);
```

## Edge Cases
- `set` con el mismo valor no notifica a los suscriptores.
- Al suscribirse, el callback se llama inmediatamente con el valor actual.
- Si usas objetos/arrays, siempre pasa una nueva referencia a `set` para disparar la reactividad.

## Testing
- Usa mocks/spies para verificar notificaciones a los suscriptores.
- Testea edge cases: suscripción/desuscripción, valores primitivos y objetos, valores nulos/undefined.
- Ejemplo:
```typescript
test('notifica solo en cambios', () => {
  const store = vibra(0);
  const cb = jest.fn();
  store.subscribe(cb);
  store.set(0); // No notifica
  store.set(1); // Notifica
  expect(cb).toHaveBeenCalledTimes(2); // inicial + cambio
});
```

## Colaboración AI-Dev
- Propón mejoras de API solo si mantienen la simplicidad y predictibilidad.
- Sugiere tests para nuevos edge cases o integraciones.
- Mantén la documentación y ejemplos claros y actualizados.
