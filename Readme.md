# Todos App in different stacks
Simple todos app with Tanstack implementation in different stacks **(React, Next, Vue & Angular)** including simple APIs in **Express.js** 

# The real comparison

Built the same application four times.

The most useful comparison is not the UI.

It's the **mental model**.

## Fetching data

### React

```tsx
const todosQuery = useQuery({
  queryKey: ['todos'],
  queryFn: getTodos
});
```

### Next.js

```tsx
const todosQuery = useQuery({
  queryKey: ['todos'],
  queryFn: getTodos
});
```

### Vue

```ts
const todosQuery = useQuery({
  queryKey: ['todos'],
  queryFn: getTodos
});
```

### Angular

```ts
readonly todosQuery = injectQuery(() => ({
  queryKey: ['todos'],
  queryFn: getTodos
}));
```

The TanStack concept stays almost identical.

---

# Local state comparison

This is where the frameworks start to differ.

### React

```tsx
const [title, setTitle] = useState('');
```

Update:

```tsx
setTitle('Hello');
```

---

### Vue

```ts
const title = ref('');
```

Update:

```ts
title.value = 'Hello';
```

---

### Angular

```ts
readonly title = signal('');
```

Update:

```ts
this.title.set('Hello');
```

---

### Next.js

Next.js uses React:

```tsx
const [title, setTitle] = useState('');
```

So:

```text
Next.js
   │
   └── React state model
```

---

# Component comparison

### React

```tsx
function TodoList() {
  return (
    <div>
      Todo
    </div>
  );
}
```

### Vue

```vue
<script setup>
</script>

<template>
  <div>
    Todo
  </div>
</template>
```

### Angular

```ts
@Component({
  selector: 'app-todo'
})
export class TodoComponent {}
```

with:

```html
<div>
  Todo
</div>
```

### Next.js

Essentially React:

```tsx
export default function TodoList() {
  return (
    <div>
      Todo
    </div>
  );
}
```

---

# Architecture comparison

Now we can see the bigger picture.

|                      | React                | Next.js     | Vue             | Angular     |
| -------------------- | -------------------- | ----------- | --------------- | ----------- |
| TypeScript           | Excellent            | Excellent   | Excellent       | Excellent   |
| UI model             | JSX                  | JSX         | Templates/SFC   | Templates   |
| Local state          | Hooks                | Hooks       | Refs/reactivity | Signals     |
| Server state         | TanStack             | TanStack    | TanStack        | TanStack    |
| Routing              | External/common      | Built-in    | Vue Router      | Built-in    |
| SSR                  | Libraries/frameworks | First-class | Nuxt            | Angular SSR |
| Full-stack           | No                   | **Yes**     | No              | No          |
| Dependency Injection | No built-in          | No          | No              | **Yes**     |
| Opinionated          | Low                  | Medium      | Medium          | **High**    |
| Learning curve       | Medium               | Medium      | Low/Medium      | High        |

---

# One very important lesson

You don't really have:

```text
React TanStack Query
Vue TanStack Query
Angular TanStack Query
Next.js TanStack Query
```

as completely different concepts.

You have:

```text
                    TanStack Query
                         │
            ┌────────────┼────────────┐
            │            │            │
          React          Vue        Angular
            │            │            │
          Hooks        Reactivity    Signals
```

TanStack Query solves **server-state management**.

The framework solves things like:

```text
Components
Rendering
Reactivity
Routing
Events
Forms
Application architecture
```

That's why the same API layer and query concepts can move between frameworks.

---

# Final architecture

Our learning project:

```text
                    ┌───────────────┐
                    │   SQLite DB   │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │ Express API   │
                    │    :5000      │
                    └───────┬───────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
      React/Vite        Next.js             Vue
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                         Angular
                            │
                            ▼
                    ┌───────────────┐
                    │ TanStack Query│
                    └───────────────┘
```

