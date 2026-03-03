import { defineStore } from 'pinia';
import api from '../api';

export const useCategoryStore = defineStore('categories', {
    state: () => ({
        categories: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchCategories() {
            this.loading = true;
            try {
                const { data } = await api.get('/categories');
                this.categories = data;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async createCategory(categoryData) {
            try {
                const { data } = await api.post('/categories', categoryData);
                this.categories.push(data);
                return data;
            } catch (error) {
                this.error = error.message;
                return null;
            }
        },

        async updateCategory(id, updateData) {
            try {
                const { data } = await api.patch(`/categories/${id}`, updateData);
                const index = this.categories.findIndex(c => c.id === id);
                if (index !== -1) this.categories[index] = data;
                return data;
            } catch (error) {
                this.error = error.message;
                return null;
            }
        },

        async deleteCategory(id) {
            try {
                await api.delete(`/categories/${id}`);
                this.categories = this.categories.filter(c => c.id !== id);
                return true;
            } catch (error) {
                this.error = error.message;
                return false;
            }
        }
    }
});
