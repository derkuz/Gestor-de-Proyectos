import { defineStore } from 'pinia';
import api from '../api';

export const useDocumentationStore = defineStore('documentation', {
    state: () => ({
        documentation: null,
        loading: false,
        error: null,
    }),

    actions: {
        async fetchDocumentation(projectId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get(`/projects/${projectId}/documentation`);
                this.documentation = response.data;
            } catch (error) {
                // If 404, it might not exist yet, which is fine
                if (error.response?.status === 404) {
                    this.documentation = { contenido: '' };
                } else {
                    this.error = 'Error al cargar documentación';
                }
            } finally {
                this.loading = false;
            }
        },

        async updateDocumentation(projectId, contenido) {
            this.loading = true;
            try {
                const response = await api.patch(`/projects/${projectId}/documentation`, { contenido });
                this.documentation = response.data;
                return true;
            } catch (error) {
                this.error = 'Error al guardar documentación';
                console.error(error);
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});
