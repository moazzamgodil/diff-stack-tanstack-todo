'use client';

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
} from '../../api/todos';

import { useState } from 'react';

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
        }) =>
            updateTodo(id, {
                completed
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['todos']
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTodo,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['todos']
            });
        }
    });

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
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
                Error: {todosQuery.error.message}
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

            <div>
                {todos.map((todo: Todo) => (
                    <div key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() =>
                                updateMutation.mutate({
                                    id: todo.id,
                                    completed: !todo.completed
                                })
                            }
                        />

                        <span>
                            {todo.title}
                        </span>

                        <button
                            onClick={() =>
                                deleteMutation.mutate(todo.id)
                            }
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}