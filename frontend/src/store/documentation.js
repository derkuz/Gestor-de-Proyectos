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
            // Limpiamos el estado actual para evitar "fantasmas" de otros proyectos o sesiones
            this.documents = [];
            try {
                const response = await api.get(`/projects/${projectId}/documentation`);
                // Aseguramos que sea un array y filtramos posibles nulos o vacíos
                const rawData = Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
                this.documents = rawData.filter(d => d && d.id);
                console.log('Documentos cargados (vistos):', this.documents.length);
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
            console.log('Solicitando eliminar documento:', docId, 'del proyecto:', projectId);
            if (!docId) {
                this.error = 'Error: ID de documento no válido';
                console.error('ID de documento nulo o indefinido');
                return false;
            }
            this.loading = true;
            try {
                await api.delete(`/projects/${projectId}/documentation/${docId}`);
                this.documents = this.documents.filter(d => d.id !== docId);
                console.log('Documento eliminado del estado local');
                return true;
            } catch (error) {
                this.error = 'Error al eliminar el documento';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async uploadDocument(projectId, file, titulo) {
            console.log('Store: Subiendo archivo...', { projectId, fileName: file.name, titulo });
            this.loading = true;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('titulo', titulo);
            try {
                const response = await api.post(`/projects/${projectId}/documentation/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log('Store: Respuesta subida:', response.data);
                this.documents.unshift(response.data);
                return response.data;
            } catch (error) {
                console.error('Store: Error subida:', error.response?.data || error.message);
                this.error = 'Error al subir el archivo';
                return null;
            } finally {
                this.loading = false;
            }
        }
    }
});
