import { Component, signal } from '@angular/core';

import {
  injectQuery,
  injectMutation
} from '@tanstack/angular-query-experimental';

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} from '../api/todos';

@Component({
  imports: [],
  selector: 'app-todo-list',
  styleUrl: './todo-list.css',
  templateUrl: './todo-list.html',
  standalone: true,
})
export class TodoList {
  readonly title = signal('');

  readonly todosQuery = injectQuery(() => ({
    queryKey: ['todos'],
    queryFn: getTodos
  }));

  readonly createMutation = injectMutation(() => ({
    mutationFn: createTodo,

    onSuccess: () => {
      this.title.set('');

      this.todosQuery.refetch();
    }
  }));

  readonly updateMutation = injectMutation(() => ({
    mutationFn: ({
      id,
      completed
    }: {
      id: number;
      completed: boolean;
    }) =>
      updateTodo(id, {
        completed
      }),

    onSuccess: () => {
      this.todosQuery.refetch();
    }
  }));

  readonly deleteMutation = injectMutation(() => ({
    mutationFn: deleteTodo,

    onSuccess: () => {
      this.todosQuery.refetch();
    }
  }));

  addTodo() {
    const value = this.title().trim();

    if (!value) {
      return;
    }

    this.createMutation.mutate(value);
  }

  toggleTodo(
    id: number,
    completed: boolean
  ) {
    this.updateMutation.mutate({
      id,
      completed: !completed
    });
  }

  removeTodo(id: number) {
    this.deleteMutation.mutate(id);
  }
}
