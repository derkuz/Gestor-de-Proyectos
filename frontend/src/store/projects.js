import { defineStore } from 'pinia';
import api from '../api';

export const useProjectStore = defineStore('projects', {
    state: () => ({
        projects: [],
        currentProject: null,
        loading: false,
        error: null,
    }),

    actions: {
        async fetchProjects() {
            this.loading = true;
            try {
                const response = await api.get('/projects');
                this.projects = response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al cargar proyectos';
            } finally {
                this.loading = false;
            }
        },

        async createProject(projectData) {
            this.loading = true;
            try {
                const response = await api.post('/projects', projectData);
                this.projects.push(response.data);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al crear proyecto';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async fetchProjectById(id) {
            this.loading = true;
            try {
                const response = await api.get(`/projects/${id}`);
                this.currentProject = response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al cargar el proyecto';
            } finally {
                this.loading = false;
            }
        },

        async updateProject(id, updateData) {
            this.loading = true;
            try {
                const response = await api.patch(`/projects/${id}`, updateData);
                const index = this.projects.findIndex(p => p.id === id);
                if (index !== -1) this.projects[index] = response.data;
                if (this.currentProject?.id === id) this.currentProject = response.data;
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al actualizar proyecto';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async assignUser(projectId, userId) {
            this.loading = true;
            try {
                const response = await api.post(`/projects/${projectId}/assign`, { userId });
                if (this.currentProject?.id === projectId) this.currentProject = response.data;
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al asignar usuario';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async removeUser(projectId, userId) {
            this.loading = true;
            try {
                const response = await api.delete(`/projects/${projectId}/users/${userId}`);
                if (this.currentProject?.id === projectId) this.currentProject = response.data;
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al eliminar usuario';
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});
