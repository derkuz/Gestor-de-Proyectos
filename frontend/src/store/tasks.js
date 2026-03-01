import { defineStore } from 'pinia';
import api from '../api';

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        tasks: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchTasksByProject(projectId) {
            this.loading = true;
            try {
                const response = await api.get(`/projects/${projectId}/tasks`);
                this.tasks = response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al cargar tareas';
            } finally {
                this.loading = false;
            }
        },

        async createTask(projectId, taskData) {
            this.loading = true;
            try {
                const response = await api.post(`/projects/${projectId}/tasks`, taskData);
                this.tasks.push(response.data);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al crear tarea';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async createSubtask(padreId, taskData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post(`/tasks/${padreId}/subtasks`, taskData);
                // Add to flat list
                this.tasks.push(response.data);
                // Update parent relationship locally
                const parent = this.tasks.find(t => t.id === padreId);
                if (parent) {
                    if (!parent.subtareas) parent.subtareas = [];
                    // Check if it's already there (defensive)
                    if (!parent.subtareas.find(s => s.id === response.data.id)) {
                        parent.subtareas.push(response.data);
                    }
                }
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al crear subtarea';
                console.error('Error creating subtask:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async updateTask(taskId, updateData) {
            this.loading = true;
            try {
                const response = await api.patch(`/tasks/${taskId}`, updateData);
                const index = this.tasks.findIndex(t => t.id === taskId);
                if (index !== -1) {
                    this.tasks[index] = { ...this.tasks[index], ...response.data };
                }
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al actualizar tarea';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async deleteTask(taskId) {
            this.loading = true;
            try {
                await api.delete(`/tasks/${taskId}`);
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al eliminar tarea';
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});
