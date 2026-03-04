import { defineStore } from 'pinia';
import api from '../api';

export const useAdminStore = defineStore('admin', {
    state: () => ({
        stats: null,
        activityLogs: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchStats() {
            this.loading = true;
            try {
                const response = await api.get('/admin/stats');
                this.stats = response.data;
            } catch (error) {
                this.error = 'Error al cargar estadísticas';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async fetchActivityLogs(limit = 50) {
            this.loading = true;
            try {
                const response = await api.get(`/activity-logs?limit=${limit}`);
                this.activityLogs = response.data;
            } catch (error) {
                this.error = 'Error al cargar logs de actividad';
                console.error(error);
            } finally {
                this.loading = false;
            }
        }
    }
});
