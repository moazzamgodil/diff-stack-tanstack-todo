import { useState } from 'react';
import {
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';

import {
    createTodo,
    deleteTodo,
    getTodos,
    updateTodo,
    type Todo
} from '../api/todos';

export default function TodoList() {
    const [title, setTitle] = useState('');

    const queryClient = useQueryClient();

    const todosQuery = useQuery({
        queryKey: ['todos'],
        queryFn: getTodos
    });

    const createMutation = useMutation({
        mutationFn: createTodo,

        onSuccess: () => {
            setTitle('');

            queryClient.invalidateQueries({
                queryKey: ['todos']
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            completed
        }: {
            id: number;
            completed: boolean;
        }) => updateTodo(id, { completed }),

        // 1. Before the request
        onMutate: async ({ id, completed }) => {
            await queryClient.cancelQueries({
                queryKey: ['todos']
            });

            // Save current data for rollback
            const previousTodos =
                queryClient.getQueryData<Todo[]>([
                    'todos'
                ]);

            // Update UI immediately
            queryClient.setQueryData<Todo[]>(
                ['todos'],
                old =>
                    old?.map(todo =>
                        todo.id === id
                            ? {
                                ...todo,
                                completed
                            }
                            : todo
                    ) ?? []
            );

            return {
                previousTodos
            };
        },

        // 2. Request failed
        onError: (_error, _variables, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(
                    ['todos'],
                    context.previousTodos
                );
            }
        },

        // 3. Request finished
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['todos']
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTodo,

        onMutate: async id => {
            await queryClient.cancelQueries({
                queryKey: ['todos']
            });

            const previousTodos =
                queryClient.getQueryData<Todo[]>([
                    'todos'
                ]);

            queryClient.setQueryData<Todo[]>(
                ['todos'],
                old =>
                    old?.filter(todo => todo.id !== id) ?? []
            );

            return {
                previousTodos
            };
        },

        onError: (_error, _id, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(
                    ['todos'],
                    context.previousTodos
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['todos']
            });
        }
    });

    function handleSubmit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        const value = title.trim();

        if (!value) {
            return;
        }

        createMutation.mutate(value);
    }

    if (todosQuery.isPending) {
        return <p>Loading...</p>;
    }

    if (todosQuery.isError) {
        return (
            <p>
                Failed to load todos:
                {' '}
                {todosQuery.error.message}
            </p>
        );
    }

    const todos = todosQuery.data ?? [];

    return (
        <div className="todo-container">
            <h1>Todo App</h1>

            <form onSubmit={handleSubmit}>
                <input
                    value={title}
                    onChange={event =>
                        setTitle(event.target.value)
                    }
                    placeholder="What needs to be done?"
                />

                <button
                    type="submit"
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending
                        ? 'Adding...'
                        : 'Add'}
                </button>
            </form>

            <div className="todos">
                {todos.map(todo => (
                    <div
                        key={todo.id}
                        className="todo"
                    >
                        <label>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                disabled={
                                    updateMutation.isPending &&
                                    updateMutation.variables?.id === todo.id
                                }
                                onChange={() =>
                                    updateMutation.mutate({
                                        id: todo.id,
                                        completed: !todo.completed
                                    })
                                }
                            />

                            <span
                                className={
                                    todo.completed
                                        ? 'completed'
                                        : ''
                                }
                            >
                                {todo.title}
                            </span>
                        </label>

                        <button
                            onClick={() =>
                                deleteMutation.mutate(todo.id)
                            }
                            disabled={deleteMutation.isPending}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}