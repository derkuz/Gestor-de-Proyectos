<template>
  <div v-if="projectStore.loading || taskStore.loading" class="flex justify-center py-20">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>

  <div v-else-if="!projectStore.currentProject" class="text-center py-20">
    <p class="text-slate-500 font-medium">No se encontró el proyecto.</p>
    <router-link to="/projects" class="text-purple-400 mt-4 inline-block font-bold">Volver a Proyectos</router-link>
  </div>

  <div v-else class="h-full flex flex-col">
    <header class="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
      <div>
        <router-link :to="`/projects/${route.params.id}`" class="text-slate-500 hover:text-white transition-colors flex items-center space-x-2 mb-4 text-sm font-bold uppercase tracking-widest">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Volver al detalle</span>
        </router-link>
        <h2 class="text-3xl font-black tracking-tight flex items-center space-x-3">
            <span>Tablero Kanban</span>
            <span class="text-slate-600 font-medium px-3 py-1 bg-white/5 rounded-xl text-lg">{{ projectStore.currentProject.nombre }}</span>
        </h2>
      </div>
      
      <div class="flex items-center space-x-4 bg-white/5 border border-white/10 p-2 rounded-2xl">
          <div class="px-4 py-2 bg-purple-600/10 text-purple-400 text-xs font-black uppercase tracking-widest rounded-xl border border-purple-500/20">
             Viendo tareas principales
          </div>
      </div>
    </header>

    <!-- Kanban Board -->
    <div class="flex-1 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide">
      <div class="flex space-x-6 min-w-max h-full">
        <div v-for="column in columns" :key="column.id" class="w-80 flex flex-col">
          <!-- Column Header -->
          <div class="flex items-center justify-between mb-4 px-2">
            <h3 class="text-sm font-black uppercase tracking-[0.2em] text-slate-500 flex items-center space-x-2">
              <span :class="`w-2 h-2 rounded-full ${column.color}`"></span>
              <span>{{ column.title }}</span>
            </h3>
            <span class="text-xs font-bold text-slate-700 bg-white/5 px-2 py-1 rounded-lg">
              {{ getTasksByStatus(column.id).length }}
            </span>
          </div>

          <!-- Draggable Column -->
          <draggable
            v-model="columnsTasks[column.id]"
            group="tasks"
            item-key="id"
            class="flex-1 space-y-4 min-h-[500px] p-2 bg-white/2 rounded-3xl border border-white/5"
            @change="evt => handleDragChange(evt, column.id)"
            :animation="200"
            ghost-class="opacity-50"
          >
            <template #item="{ element }">
              <div class="bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl cursor-grab active:cursor-grabbing hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all group relative overflow-hidden">
                <div :class="getPriorityBarClass(element.prioridad)" class="absolute top-0 left-0 bottom-0 w-1"></div>
                <div class="flex justify-between items-start mb-3">
                  <span :class="getPriorityTextClass(element.prioridad)" class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-current opacity-70">
                    {{ element.prioridad }}
                  </span>
                  <div v-if="element.subtareas?.length" class="flex items-center space-x-1 text-slate-600">
                     <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-width="2"/></svg>
                     <span class="text-[10px] font-bold">{{ element.subtareas.length }}</span>
                  </div>
                </div>
                <h4 class="font-bold text-slate-100 text-sm leading-snug group-hover:text-white transition-colors">{{ element.nombre }}</h4>
                <p v-if="element.descripcion" class="text-xs text-slate-500 mt-2 line-clamp-2">{{ element.descripcion }}</p>
                
                <div class="mt-4 flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase tracking-tight">
                   <span>ID: {{ element.id.slice(0, 8) }}</span>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '../store/projects'
import { useTaskStore } from '../store/tasks'
import draggable from 'vuedraggable'

const route = useRoute()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const columns = [
  { id: 'Pendiente', title: 'Pendiente', color: 'bg-slate-400' },
  { id: 'En Desarrollo', title: 'En Desarrollo', color: 'bg-blue-400' },
  { id: 'Bloqueado', title: 'Bloqueado', color: 'bg-red-400' },
  { id: 'Finalizado', title: 'Finalizado', color: 'bg-green-400' }
]

const columnsTasks = ref({
  'Pendiente': [],
  'En Desarrollo': [],
  'Bloqueado': [],
  'Finalizado': []
})

const getTasksByStatus = (status) => {
  return taskStore.tasks.filter(t => !t.esSubtarea && t.estado === status)
}

const syncColumns = () => {
  columns.forEach(col => {
    columnsTasks.value[col.id] = getTasksByStatus(col.id)
  })
}

onMounted(async () => {
  await projectStore.fetchProjectById(route.params.id)
  await taskStore.fetchTasksByProject(route.params.id)
  syncColumns()
})

// Update columns if tasks change externally (e.g. after a fetch)
watch(() => taskStore.tasks, () => {
  syncColumns()
}, { deep: true })

const handleDragChange = async (evt, newStatus) => {
  if (evt.added) {
    const task = evt.added.element
    if (task.estado !== newStatus) {
      await taskStore.updateTask(task.id, { estado: newStatus })
    }
  }
}

const getPriorityBarClass = (priority) => {
  switch (priority) {
    case 'CRITICA': return 'bg-red-500';
    case 'ALTA': return 'bg-orange-500';
    case 'MEDIA': return 'bg-blue-500';
    default: return 'bg-slate-500';
  }
}

const getPriorityTextClass = (priority) => {
  switch (priority) {
    case 'CRITICA': return 'text-red-400';
    case 'ALTA': return 'text-orange-400';
    case 'MEDIA': return 'text-blue-400';
    default: return 'text-slate-400';
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.bg-white\/2 { background-color: rgba(255, 255, 255, 0.02); }
</style>
