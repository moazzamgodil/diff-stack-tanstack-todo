<script setup lang="ts">
import { ref } from "vue";

import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";

import { getTodos, createTodo, updateTodo, deleteTodo } from "../api/todos";

const title = ref("");

const queryClient = useQueryClient();

const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
});

const createMutation = useMutation({
    mutationFn: createTodo,

    onSuccess: () => {
        title.value = "";

        queryClient.invalidateQueries({
            queryKey: ["todos"],
        });
    },
});

const updateMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
        updateTodo(id, {
            completed,
        }),

    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ["todos"],
        });
    },
});

const deleteMutation = useMutation({
    mutationFn: deleteTodo,

    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ["todos"],
        });
    },
});

function handleSubmit() {
    const value = title.value.trim();

    if (!value) {
        return;
    }

    createMutation.mutate(value);
}

function toggleTodo(id: number, completed: boolean) {
    updateMutation.mutate({
        id,
        completed: !completed,
    });
}
</script>


<template>
    <div class="todo-container">
        <h1>Vue Todo</h1>

        <form @submit.prevent="handleSubmit">
            <input v-model="title" placeholder="What needs to be done?" />

            <button type="submit" :disabled="createMutation.isPending.value">
                {{ createMutation.isPending.value ? "Adding..." : "Add" }}
            </button>
        </form>

        <p v-if="todosQuery.isPending.value">Loading...</p>

        <p v-else-if="todosQuery.isError.value">
            Error:
            {{ todosQuery.error.value?.message }}
        </p>

        <div v-else>
            <div
                v-for="todo in todosQuery.data.value"
                :key="todo.id"
                class="todo"
            >
                <label>
                    <input
                        type="checkbox"
                        :checked="todo.completed"
                        @change="toggleTodo(todo.id, todo.completed)"
                    />

                    <span
                        :class="{
                            completed: todo.completed,
                        }"
                    >
                        {{ todo.title }}
                    </span>
                </label>

                <button @click="deleteMutation.mutate(todo.id)">Delete</button>
            </div>
        </div>
    </div>
</template>
