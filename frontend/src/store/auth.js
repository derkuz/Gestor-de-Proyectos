import { defineStore } from 'pinia';
import api from '../api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.rol === 'ADMIN',
    },

    actions: {
        async login(email, password) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/auth/login', { email, password });
                const { access_token, user } = response.data;

                this.token = access_token;
                this.user = user;

                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(user));

                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al iniciar sesión';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post('/auth/register', userData);
                const { access_token, user } = response.data;

                this.token = access_token;
                this.user = user;

                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(user));

                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al registrarse';
                return false;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});
