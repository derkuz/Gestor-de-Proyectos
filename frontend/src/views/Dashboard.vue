<template>
  <div>
    <h2 class="text-3xl font-black mb-8 text-app-text">Resumen General</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div v-for="stat in stats" :key="stat.label" class="bg-app-surface border border-app-border p-8 rounded-3xl hover:shadow-lg transition-all group">
        <p class="text-app-text-muted text-sm font-bold uppercase tracking-widest mb-2">{{ stat.label }}</p>
        <div class="flex items-end justify-between">
          <p class="text-4xl font-black tracking-tighter text-app-text">{{ stat.value }}</p>
          <div :class="`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`">
            <component :is="stat.icon" class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Activity / Placeholder -->
      <div class="bg-app-surface border border-app-border p-8 rounded-3xl">
        <h3 class="text-xl font-black mb-6 text-app-text">Actividad Reciente</h3>
        <div class="space-y-6">
          <p class="text-app-text-muted font-medium">No hay actividad reciente para mostrar.</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-app-surface border border-app-border p-8 rounded-3xl">
        <h3 class="text-xl font-black mb-6 text-app-text">Acciones Rápidas</h3>
        <div class="grid grid-cols-2 gap-4">
          <router-link to="/projects" class="p-4 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-center hover:bg-purple-600/20 transition-all">
            + Nuevo Proyecto
          </router-link>
          <router-link to="/tickets" class="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-center hover:bg-blue-600/20 transition-all">
            + Abrir Ticket
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed, onMounted } from 'vue'
import { useTaskStore } from '../store/tasks'
import { useProjectStore } from '../store/projects'
import { useTicketStore } from '../store/tickets'

const projectStore = useProjectStore()
const ticketStore = useTicketStore()
const taskStore = useTaskStore()

onMounted(async () => {
    // Ensuring all data is fresh
    await projectStore.fetchProjects()
    await ticketStore.fetchTickets()
    // For general count, we might need a general fetch if available, 
    // but usually tasks are project-scoped.
    // For now, let's aggregate if possible or show a general msg.
    // However, the requirement is "Dashboard de Progreso".
})

const stats = [
  { label: 'Proyectos', value: computed(() => projectStore.projects.length), color: 'purple', icon: 'ProjectIcon' },
  { label: 'Tareas Hoy', value: computed(() => taskStore.tasks.length), color: 'blue', icon: 'TaskIcon' },
  { label: 'Tickets', value: computed(() => ticketStore.tickets.length), color: 'indigo', icon: 'TicketIcon' },
]

const ProjectIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>' }
const TaskIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>' }
const TicketIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-2-2-2 2-2-2-2 2-2-2-2 2V5z" /></svg>' }
</script>
