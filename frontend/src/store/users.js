import { defineStore } from 'pinia';
import api from '../api';

export const useUsersStore = defineStore('users', {
    state: () => ({
        users: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchUsers() {
            this.loading = true;
            try {
                const response = await api.get('/users');
                this.users = response.data;
            } catch (error) {
                this.error = 'Error al cargar usuarios';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async adminResetPassword(userId, newPassword) {
            this.loading = true;
            try {
                await api.patch(`/users/${userId}/password`, { password: newPassword });
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al resetear contraseña';
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});
