import { defineStore } from 'pinia';
import api from '../api';

export const useTicketStore = defineStore('tickets', {
    state: () => ({
        tickets: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchTickets() {
            this.loading = true;
            try {
                const response = await api.get('/tickets');
                this.tickets = response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al cargar tickets';
            } finally {
                this.loading = false;
            }
        },

        async createTicket(ticketData) {
            this.loading = true;
            try {
                const response = await api.post('/tickets', ticketData);
                this.tickets.unshift(response.data);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al crear ticket';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async solveTicket(id) {
            this.loading = true;
            try {
                // En el backend, resolver un ticket es cambiar su estado. 
                // Por ahora asumimos que el endpoint update maneja esto.
                const response = await api.patch(`/tickets/${id}`, { estado: 'CERRADO' });
                const index = this.tickets.findIndex(t => t.id === id);
                if (index !== -1) this.tickets[index] = response.data;
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al resolver ticket';
                return null;
            } finally {
                this.loading = false;
            }
        }
    }
});
