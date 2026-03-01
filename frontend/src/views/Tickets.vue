<template>
  <div>
    <header class="flex justify-between items-center mb-10">
      <div>
        <h2 class="text-3xl font-black">Soporte técnico</h2>
        <p class="text-slate-400 mt-1">Gestiona los tickets y solicitudes de ayuda</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
      >
        + Abrir Ticket
      </button>
    </header>

    <div v-if="ticketStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="ticketStore.tickets.length === 0" class="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
      <p class="text-slate-500 font-medium">No hay tickets pendientes.</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="ticket in ticketStore.tickets" 
        :key="ticket.id"
        class="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl hover:bg-white/8 transition-all flex items-center justify-between group"
      >
        <div class="flex items-center space-x-6">
          <div :class="ticket.estado === 'ABIERTO' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'" class="p-4 rounded-2xl">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-2-2-2 2-2-2-2 2-2-2-2 2V5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <h3 class="text-lg font-bold">{{ ticket.asunto }}</h3>
            <p class="text-slate-400 text-sm mt-1">{{ ticket.descripcion }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <span :class="ticket.estado === 'ABIERTO' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-green-500/30 text-green-400 bg-green-500/5'" class="px-4 py-1.5 rounded-full text-xs font-black tracking-widest border">
            {{ ticket.estado }}
          </span>
          <button 
            v-if="ticket.estado === 'ABIERTO'"
            @click="handleSolve(ticket.id)"
            class="px-4 py-2 rounded-xl bg-green-600/10 text-green-400 font-bold text-sm hover:bg-green-600/20 transition-all opacity-0 group-hover:opacity-100"
          >
            Resolver
          </button>
        </div>
      </div>
    </div>

    <!-- Create Ticket Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="showCreateModal = false"></div>
      <div class="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-2xl">
        <h3 class="text-2xl font-black mb-6">Nuevo Ticket de Soporte</h3>
        <form @submit.prevent="handleCreate" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-400 mb-2">Asunto</label>
            <input v-model="newTicket.asunto" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="¿En qué podemos ayudarte?">
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-400 mb-2">Descripción detallada</label>
            <textarea v-model="newTicket.descripcion" rows="3" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"></textarea>
          </div>
          <div class="flex space-x-4 pt-4">
            <button type="button" @click="showCreateModal = false" class="flex-1 py-3 font-bold text-slate-400 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" class="flex-1 py-3 bg-blue-600 rounded-2xl font-bold hover:bg-blue-500 transition-all">Enviar Ticket</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTicketStore } from '../store/tickets'

const ticketStore = useTicketStore()
const showCreateModal = ref(false)
const newTicket = ref({ asunto: '', descripcion: '' })

onMounted(() => {
  ticketStore.fetchTickets()
})

const handleCreate = async () => {
  const success = await ticketStore.createTicket(newTicket.value)
  if (success) {
    showCreateModal.value = false
    newTicket.value = { asunto: '', descripcion: '' }
  }
}

const handleSolve = async (id) => {
  await ticketStore.solveTicket(id)
}
</script>
