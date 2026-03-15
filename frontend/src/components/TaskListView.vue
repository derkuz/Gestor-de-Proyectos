<template>
  <div class="space-y-4">
    <!-- Controls Header -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
       <!-- Search Input -->
       <div class="relative flex-1">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar tarea por nombre..." 
            class="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-app-text focus:border-purple-500 outline-none transition-all text-sm"
          >
          <svg class="w-4 h-4 text-app-text-muted absolute right-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
       </div>
       
       <!-- Status Filter -->
       <div class="w-full sm:w-40">
          <select 
             v-model="statusFilter" 
             class="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm text-app-text outline-none cursor-pointer focus:border-purple-500 transition-all appearance-none"
          >
             <option value="ALL" class="bg-app-surface text-app-text">Todos los estados</option>
             <option value="Pendiente" class="bg-app-surface text-app-text-muted">Pendiente</option>
             <option value="En Desarrollo" class="bg-app-surface text-blue-400">En Desarrollo</option>
             <option value="Bloqueado" class="bg-app-surface text-red-400">Bloqueado</option>
             <option value="Finalizado" class="bg-app-surface text-green-400">Finalizado</option>
          </select>
       </div>

       <!-- Priority Sort/Filter -->
       <div class="w-full sm:w-44">
          <select 
             v-model="prioritySort" 
             class="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm text-app-text outline-none cursor-pointer focus:border-purple-500 transition-all appearance-none"
          >
             <option value="ALL" class="bg-app-surface text-app-text">Todas las prioridades</option>
             <option value="CRITICA" class="bg-app-surface text-red-400">Sólo Crítica</option>
             <option value="ALTA" class="bg-app-surface text-orange-400">Sólo Alta</option>
             <option value="MEDIA" class="bg-app-surface text-blue-400">Sólo Media</option>
             <option value="BAJA" class="bg-app-surface text-app-text-muted">Sólo Baja</option>
          </select>
       </div>
    </div>
    
    <div v-if="filteredAndSortedTasks.length === 0" class="text-center py-10 bg-app-surface border border-dashed border-app-border rounded-2xl shadow-sm">
       <p class="text-app-text-muted text-sm font-black uppercase tracking-widest">No se encontraron tareas coincidentes.</p>
    </div>

    <div 
      v-for="task in filteredAndSortedTasks" 
      :key="task.id"
      class="bg-app-surface rounded-2xl border border-app-border overflow-hidden transition-all shadow-sm"
      :class="expandedTasks.includes(task.id) ? 'ring-2 ring-purple-600/30 border-purple-600/30' : ''"
    >
      <!-- Task Header -->
      <div class="flex items-center justify-between p-5 hover:bg-app-bg/50 cursor-pointer" @click="toggleExpand(task.id)">
        <div class="flex items-center space-x-4">
          <button 
            @click.stop="emit('toggleStatus', task)"
            :disabled="projectStatus !== 'ACTIVO'"
            class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all bg-app-bg"
            :class="task.estado === 'Finalizado' ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' : 'border-app-border hover:border-purple-500'"
          >
            <svg v-if="task.estado === 'Finalizado'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
          </button>
          <div>
            <p class="font-bold text-app-text" :class="task.estado === 'Finalizado' ? 'line-through text-app-text-muted' : ''">
              {{ task.nombre }}
            </p>
            <div class="flex items-center space-x-3 mt-1.5 text-app-text-muted">
              <span :class="getPriorityClass(task.prioridad)" class="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md border text-app-text">
                  {{ task.prioridad }}
              </span>
              <span class="text-[10px] font-black uppercase tracking-tighter">{{ task.estado }}</span>
              
              <!-- Assigned users -->
              <div class="flex -space-x-1.5 ml-2">
                 <div 
                   v-for="user in task.asignados" 
                   :key="user.id"
                   class="w-5 h-5 rounded-full border border-app-bg bg-app-surface flex items-center justify-center text-[7px] font-black text-app-text uppercase shadow-sm"
                   :title="user?.nombre || 'Usuario'"
                 >
                    {{ (user?.nombre || '??').slice(0, 2) }}
                 </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
           <div v-if="task.subtareas?.length > 0" class="flex items-center text-app-text-muted space-x-1">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-width="2"/></svg>
              <span class="text-xs font-bold">{{ task.subtareas.length }}</span>
           </div>
           <svg :class="expandedTasks.includes(task.id) ? 'rotate-180' : ''" class="w-5 h-5 text-app-text-muted transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>

      <!-- Task Content (Expanded) -->
      <div v-if="expandedTasks.includes(task.id)" class="px-5 pb-5 border-t border-app-border bg-app-bg/10 animate-slide-down">
        <div class="py-4">
          <p class="text-xs font-black text-app-text-muted uppercase tracking-widest mb-2">Detalle de tarea</p>
          <p class="text-sm text-app-text-muted font-medium leading-relaxed">{{ task.descripcion || 'Sin detalle adicional.' }}</p>
        </div>

        <!-- Subtasks List -->
        <div class="mt-4">
            <div class="flex items-center justify-between mb-4">
                <p class="text-xs font-black text-app-text-muted uppercase tracking-widest">Subtareas registradas</p>
                <button 
                  @click.stop="emit('addSubtask', task.id)"
                  class="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 transition-all border border-purple-500/10"
                >
                  + Añadir Subtarea
                </button>
            </div>

            <div v-if="task.subtareas?.length > 0" class="space-y-3 pl-4 border-l-2 border-app-border/50">
                <div 
                  v-for="sub in task.subtareas" 
                  :key="sub.id"
                  class="flex items-center justify-between p-3 bg-app-surface border border-app-border rounded-xl group/sub shadow-sm transition-all hover:bg-app-bg/20"
                >
                   <div class="flex items-center space-x-3">
                      <button 
                        @click.stop="emit('toggleStatus', sub)"
                        class="w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all bg-app-bg"
                        :class="sub.estado === 'Finalizado' ? 'bg-green-500 border-green-500 text-white' : 'border-app-border'"
                      >
                        <svg v-if="sub.estado === 'Finalizado'" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="5"><path d="M5 13l4 4L19 7"/></svg>
                      </button>
                      <span class="text-sm font-bold text-app-text" :class="sub.estado === 'Finalizado' ? 'line-through text-app-text-muted' : ''">{{ sub.nombre }}</span>
                   </div>
                   <div class="flex items-center space-x-2">
                       <button @click.stop="emit('edit-task', sub)" class="text-app-text-muted hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover/sub:opacity-100 transition-opacity" title="Editar Subtarea">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                       </button>
                       <button @click.stop="emit('deleteTask', sub.id)" class="text-app-text-muted hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover/sub:opacity-100 transition-opacity" title="Eliminar">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" stroke-width="2"/></svg>
                       </button>
                   </div>
                </div>
            </div>
        </div>

        <div class="mt-6 pt-4 border-t border-app-border flex justify-end space-x-4">
           <button @click.stop="emit('edit-task', task)" class="text-xs font-black text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity uppercase tracking-widest px-4 py-1.5 bg-blue-600/10 rounded-lg border border-blue-500/10">Editar</button>
           <button @click.stop="emit('deleteTask', task.id)" class="text-xs font-black text-red-600 dark:text-red-400 hover:opacity-80 transition-opacity uppercase tracking-widest px-4 py-1.5 bg-red-600/10 rounded-lg border border-red-500/10">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../store/tasks'

const props = defineProps({
  projectStatus: String
})

const emit = defineEmits(['toggleStatus', 'addSubtask', 'edit-task', 'deleteTask'])

const taskStore = useTaskStore()
const expandedTasks = ref([])
const searchQuery = ref('')
const prioritySort = ref('ALL')
const statusFilter = ref('ALL')

const filteredAndSortedTasks = computed(() => {
    let tasks = taskStore.tasks.filter(t => !t.esSubtarea)
    
    // Search Filter
    if (searchQuery.value) {
        const lowerSearch = searchQuery.value.toLowerCase()
        tasks = tasks.filter(t => (t.nombre || '').toLowerCase().includes(lowerSearch))
    }
    
    // Status Filter
    if (statusFilter.value !== 'ALL') {
        tasks = tasks.filter(t => t.estado === statusFilter.value)
    }

    // Priority Filter
    if (prioritySort.value !== 'ALL') {
        tasks = tasks.filter(t => t.prioridad === prioritySort.value)
    }
    
    return tasks
})

const toggleExpand = (id) => {
    const idx = expandedTasks.value.indexOf(id)
    if (idx > -1) expandedTasks.value.splice(idx, 1)
    else expandedTasks.value.push(id)
}

const getPriorityClass = (priority) => {
    switch (priority) {
        case 'CRITICA': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
        case 'ALTA': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
        case 'MEDIA': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
        default: return 'bg-app-bg text-app-text-muted border-app-border';
    }
}
</script>

<style scoped>
@keyframes slide-down {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-slide-down { animation: slide-down 0.2s ease-out; }
</style>

