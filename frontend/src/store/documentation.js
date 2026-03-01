import { defineStore } from 'pinia';
import api from '../api';

export const useDocumentationStore = defineStore('documentation', {
    state: () => ({
        documents: [],
        currentDocument: null,
        loading: false,
        error: null,
    }),

    actions: {
        async fetchDocuments(projectId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get(`/projects/${projectId}/documentation`);
                this.documents = response.data;
            } catch (error) {
                this.error = 'Error al cargar documentos';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async fetchDocument(projectId, docId) {
            this.loading = true;
            try {
                const response = await api.get(`/projects/${projectId}/documentation/${docId}`);
                this.currentDocument = response.data;
                return response.data;
            } catch (error) {
                this.error = 'Error al cargar el documento';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async createDocument(projectId, docData) {
            this.loading = true;
            try {
                const response = await api.post(`/projects/${projectId}/documentation`, docData);
                this.documents.unshift(response.data);
                return response.data;
            } catch (error) {
                this.error = 'Error al crear el documento';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async updateDocument(projectId, docId, docData) {
            this.loading = true;
            try {
                const response = await api.patch(`/projects/${projectId}/documentation/${docId}`, docData);
                const index = this.documents.findIndex(d => d.id === docId);
                if (index !== -1) {
                    this.documents[index] = response.data;
                }
                if (this.currentDocument?.id === docId) {
                    this.currentDocument = response.data;
                }
                return response.data;
            } catch (error) {
                this.error = 'Error al actualizar el documento';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async deleteDocument(projectId, docId) {
            this.loading = true;
            try {
                await api.delete(`/projects/${projectId}/documentation/${docId}`);
                this.documents = this.documents.filter(d => d.id !== docId);
                return true;
            } catch (error) {
                this.error = 'Error al eliminar el documento';
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});
