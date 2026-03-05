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
      <!-- Project Progress Breakdown -->
      <div class="bg-app-surface border border-app-border p-8 rounded-3xl">
        <h3 class="text-xl font-black mb-6 text-app-text">Progreso por Proyecto</h3>
        <div class="space-y-6">
          <div v-if="!projectStore.stats.proyectosDetalle?.length" class="text-app-text-muted font-medium py-4">
            No hay proyectos registrados aún.
          </div>
          <div 
            v-for="proj in projectStore.stats.proyectosDetalle" 
            :key="proj.id"
            class="group cursor-pointer"
            @click="$router.push(`/projects/${proj.id}`)"
          >
            <div class="flex justify-between items-end mb-2">
              <span class="font-bold text-app-text group-hover:text-blue-500 transition-colors">{{ proj.nombre }}</span>
              <span class="text-xs font-black text-app-text-muted">{{ proj.progreso }}%</span>
            </div>
            <div class="h-2 w-full bg-app-bg rounded-full overflow-hidden border border-app-border">
              <div 
                class="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000"
                :style="{ width: proj.progreso + '%' }"
              ></div>
            </div>
            <div class="flex justify-between mt-1.5">
               <span class="text-[9px] font-black uppercase tracking-tighter text-app-text-muted">{{ proj.estado }}</span>
               <span class="text-[9px] font-black uppercase tracking-tighter text-app-text-muted">{{ proj.tareasFinalizadas }}/{{ proj.totalTareas }} Tareas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-app-surface border border-app-border p-8 rounded-3xl flex flex-col justify-between">
        <div>
           <h3 class="text-xl font-black mb-6 text-app-text">Acciones Rápidas</h3>
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <router-link to="/projects" class="p-6 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-center hover:bg-purple-600/20 transition-all flex flex-col items-center group">
               <span class="text-2xl mb-2 group-hover:scale-110 transition-transform">📂</span>
               + Nuevo Proyecto
             </router-link>
             <router-link to="/tickets" class="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-center hover:bg-blue-600/20 transition-all flex flex-col items-center group">
               <span class="text-2xl mb-2 group-hover:scale-110 transition-transform">🎟️</span>
               + Abrir Ticket
             </router-link>
           </div>
        </div>
        
        <div class="mt-8 pt-8 border-t border-app-border italic text-app-text-muted text-xs">
           "La gestión de proyectos es el arte de convertir una visión en realidad, tarea por tarea."
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
    // Fresh stats from specialized endpoint
    await projectStore.fetchStats()
})

const stats = [
  { label: 'Proyectos Activos', value: computed(() => projectStore.stats.proyectos), color: 'purple', icon: 'ProjectIcon' },
  { label: 'Progreso Global', value: computed(() => projectStore.stats.progresoGlobal + '%'), color: 'emerald', icon: 'ProgressIcon' },
  { label: 'Tickets Abiertos', value: computed(() => projectStore.stats.tickets), color: 'indigo', icon: 'TicketIcon' },
]

const ProjectIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>' }
const ProgressIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>' }
const TicketIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-2-2-2 2-2-2-2 2-2-2-2 2V5z" /></svg>' }
</script>
