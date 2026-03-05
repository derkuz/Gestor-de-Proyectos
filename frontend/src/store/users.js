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

        async createUser(userData) {
            this.loading = true;
            try {
                const response = await api.post('/users', userData);
                this.users.push(response.data);
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al crear usuario';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async updateUser(userId, updateData) {
            this.loading = true;
            try {
                const response = await api.patch(`/users/${userId}`, updateData);
                const index = this.users.findIndex(u => u.id === userId);
                if (index !== -1) this.users[index] = response.data;
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al actualizar usuario';
                return false;
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
