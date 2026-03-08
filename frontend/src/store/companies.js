
import { defineStore } from 'pinia';
import api from '../api';

export const useCompaniesStore = defineStore('companies', {
    state: () => ({
        companies: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchCompanies() {
            this.loading = true;
            try {
                const response = await api.get('/admin/companies');
                this.companies = response.data;
            } catch (error) {
                this.error = 'Error al cargar empresas';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async createCompany(companyData) {
            try {
                const response = await api.post('/admin/companies', companyData);
                this.companies.push(response.data);
                return response.data;
            } catch (error) {
                this.error = 'Error al crear empresa';
                throw error;
            }
        },

        async toggleCompanyStatus(id) {
            try {
                const response = await api.patch(`/admin/companies/${id}/toggle-status`);
                const index = this.companies.findIndex(c => c.id === id);
                if (index !== -1) {
                    this.companies[index] = response.data;
                    // Refetch stats because simple toggle might not return populated stats if backend doesn't include it in toggle response
                    // Actually, let's just refresh the whole list to be safe or update manually
                    await this.fetchCompanies();
                }
            } catch (error) {
                this.error = 'Error al cambiar estado';
            }
        }
    }
});
