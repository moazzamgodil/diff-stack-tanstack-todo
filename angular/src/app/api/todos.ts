export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    created_at: string;
}

const API_URL = 'http://localhost:5000/api';

export async function getTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todos`);

    if (!response.ok) {
        throw new Error('Failed to fetch todos');
    }

    return response.json();
}

export async function createTodo(
    title: string
): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
    });

    if (!response.ok) {
        throw new Error('Failed to create todo');
    }

    return response.json();
}

export async function updateTodo(
    id: number,
    data: Partial<Pick<Todo, 'title' | 'completed'>>
): Promise<Todo> {
    const response = await fetch(
        `${API_URL}/todos/${id}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    );

    if (!response.ok) {
        throw new Error('Failed to update todo');
    }

    return response.json();
}

export async function deleteTodo(
    id: number
): Promise<void> {
    const response = await fetch(
        `${API_URL}/todos/${id}`,
        {
            method: 'DELETE'
        }
    );

    if (!response.ok) {
        throw new Error('Failed to delete todo');
    }
}