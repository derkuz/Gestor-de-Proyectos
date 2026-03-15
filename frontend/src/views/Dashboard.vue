<template>
  <div>
    <h2 class="text-3xl font-black mb-8 text-app-text tracking-widest uppercase">_ DASHBOARD</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div v-for="stat in stats" :key="stat.label" class="pixel-card group">
        <p class="text-app-text-secondary text-xs font-bold uppercase tracking-[0.2em] mb-4">{{ stat.label }}</p>
        <div class="flex items-center justify-between">
          <p class="text-4xl font-black text-app-text">{{ stat.value }}</p>
          <div class="text-app-text opacity-50 text-xl font-bold">
            [STAT]
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Project Progress Breakdown -->
      <div class="pixel-card">
        <h3 class="text-xl font-black mb-6 text-app-text uppercase tracking-widest">> PROGRESO_PROYECTOS</h3>
        <div class="space-y-6">
          <div v-if="!projectStore.stats.proyectosDetalle?.length" class="text-app-text-secondary font-medium py-4">
            [!] SIN DATOS DISPONIBLES
          </div>
          <div 
            v-for="proj in projectStore.stats.proyectosDetalle" 
            :key="proj.id"
            class="group cursor-pointer border-b-2 border-transparent hover:border-app-border pb-2 transition-all"
            @click="$router.push(`/projects/${proj.id}`)"
          >
            <div class="flex justify-between items-end mb-2">
              <span class="font-bold text-app-text uppercase tracking-wider">{{ proj.nombre }}</span>
              <span class="text-xs font-black text-app-text">{{ proj.progreso }}%</span>
            </div>
            <div class="h-4 w-full bg-app-secondary border-2 border-app-border relative overflow-hidden">
              <div 
                class="h-full bg-app-text opacity-80"
                :style="{ width: proj.progreso + '%' }"
              ></div>
            </div>
            <div class="flex justify-between mt-1.5">
               <span class="text-[10px] font-black uppercase tracking-widest text-app-text-secondary">{{ proj.estado }}</span>
               <span class="text-[10px] font-black uppercase tracking-widest text-app-text-secondary">{{ proj.tareasFinalizadas }}/{{ proj.totalTareas }} TAREAS</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="pixel-card flex flex-col justify-between">
        <div>
           <h3 class="text-xl font-black mb-6 text-app-text uppercase tracking-widest">> ACCIONES_RÁPIDAS</h3>
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <router-link to="/projects" class="p-6 border-2 border-app-border text-app-text font-bold text-center hover:bg-app-text hover:text-app-bg transition-all flex flex-col items-center group">
               <span class="text-2xl mb-2">[+]</span>
               NUEVO PROYECTO
             </router-link>
             <router-link to="/tickets" class="p-6 border-2 border-app-border text-app-text font-bold text-center hover:bg-app-text hover:text-app-bg transition-all flex flex-col items-center group">
               <span class="text-2xl mb-2">[!]</span>
               ABRIR TICKET
             </router-link>
           </div>
        </div>
        
        <div class="mt-8 pt-8 border-t-2 border-app-border italic text-app-text-secondary text-xs uppercase tracking-widest">
           "SISTEMA OPERATIVO PRISMA V1.0.0 - LISTO PARA OPERAR"
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
