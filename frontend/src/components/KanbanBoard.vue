<template>
  <div class="h-full flex flex-col">
    <!-- Kanban Board -->
    <div class="flex-1 overflow-x-auto pb-8 scrollbar-hide">
      <div class="flex space-x-6 min-w-max h-full">
        <div v-for="column in columns" :key="column.id" class="w-80 flex flex-col">
          <!-- Column Header -->
          <div class="flex items-center justify-between mb-4 px-2">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-app-text-muted flex items-center space-x-2">
              <span :class="`w-2 h-2 rounded-full ${column.color}`"></span>
              <span>{{ column.title }}</span>
            </h3>
            <div class="flex items-center space-x-2">
               <button 
                  @click="$emit('add-task')"
                  class="p-1.5 rounded-lg text-app-text-muted hover:text-purple-600 dark:hover:text-purple-400 hover:bg-app-surface transition-all"
                  title="Añadir Tarea"
               >
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
               </button>
               <span class="text-[10px] font-black text-app-text-muted bg-app-surface border border-app-border px-2 py-1 rounded-lg shadow-sm">
                 {{ getTasksByStatus(column.id).length }}
               </span>
            </div>
          </div>

          <!-- Draggable Column -->
          <draggable
            v-model="columnsTasks[column.id]"
            group="tasks"
            item-key="id"
            class="flex-1 space-y-4 min-h-[400px] p-3 bg-app-surface/30 rounded-[2rem] border border-app-border"
            @change="evt => handleDragChange(evt, column.id)"
            :animation="200"
            ghost-class="opacity-50"
            :disabled="projectStatus !== 'ACTIVO'"
            :list="columnsTasks[column.id] || []"
          >
            <template #item="{ element }">
              <div class="bg-app-surface backdrop-blur-md border border-app-border p-5 rounded-2xl cursor-grab active:cursor-grabbing hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all group relative overflow-hidden">
                <div :class="getPriorityBarClass(element.prioridad)" class="absolute top-0 left-0 bottom-0 w-1"></div>
                <div class="flex justify-between items-start mb-3">
                  <span :class="getPriorityTextClass(element.prioridad)" class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-current opacity-70">
                    {{ element.prioridad }}
                  </span>
                  <div v-if="element.ticketLigado" class="text-[9px] font-black text-white bg-blue-600 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md" title="Proviene de un Ticket">
                     <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-2-2-2 2-2-2-2 2-2-2-2 2V5z"/></svg>
                     <span>TK-{{ (element.ticketLigado?.id || '').substring(0,4) }}</span>
                  </div>
                </div>
                <h4 class="font-bold text-app-text text-sm leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{{ element.nombre }}</h4>
                <button 
                  @click.stop="openTaskDetails(element)"
                  class="mt-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:underline transition-colors block text-left"
                >
                  Ver Detalle
                </button>
                
                <div class="mt-4 flex items-center justify-between pt-3 border-t border-app-border">
                   <div class="flex -space-x-2">
                      <div 
                        v-for="user in element.asignados" 
                        :key="user.id"
                        class="w-6 h-6 rounded-full border-2 border-app-surface bg-purple-600 flex items-center justify-center text-[8px] font-black text-white uppercase shadow-sm"
                         :title="user?.nombre || 'Usuario'"
                      >
                         {{ (user?.nombre || '??').slice(0, 2) }}
                      </div>
                   </div>
                   <div class="flex items-center space-x-3">
                     <button 
                       @click.stop="$emit('add-subtask', element.id)" 
                       class="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 hover:opacity-70 flex items-center space-x-1"
                     >
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        <span>Subtarea</span>
                     </button>
                     <div class="text-[9px] text-app-text-muted font-bold uppercase tracking-tight">
                        #{{ (element?.id || '----').slice(0, 4) }}
                     </div>
                   </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        
        <!-- Add Column Button -->
        <div class="w-80 flex flex-col pt-8">
           <button 
             @click="addColumn"
             class="w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed border-app-border rounded-3xl text-app-text-muted font-bold hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500/30 transition-all group"
           >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              <span>Añadir Estado</span>
           </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Reusable Input Modal for generic prompts -->
  <InputModal 
    v-model="showAddStateModal"
    title="Nuevo Estado"
    description="Define un nuevo estado para clasificar las tareas en tu tablero Kanban."
    inputLabel="Nombre del estado"
    placeholder="Ej: En QA, Pendiente de revisión..."
    confirmText="Agregar columna"
    @confirm="handleConfirmAddColumn"
  />

  <!-- Task Detail Modal -->
  <div v-if="showDetailModal && selectedTask" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-app-bg/80 backdrop-blur-md" @click="closeTaskDetails"></div>
    <div class="bg-app-surface border border-app-border rounded-[2.5rem] p-10 w-full max-w-2xl relative z-10 shadow-2xl animate-pop-in flex flex-col max-h-[90vh]">
      <div class="flex justify-between items-start mb-6 shrink-0">
         <div>
            <div class="flex items-center space-x-3 mb-2">
               <span :class="getPriorityTextClass(selectedTask.prioridad)" class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-current opacity-80">
                 {{ selectedTask.prioridad }}
               </span>
                <span class="text-[10px] text-app-text-muted font-bold uppercase tracking-widest">
                 #{{ (selectedTask?.id || '').substring(0,6) }}
               </span>
            </div>
            <h3 class="text-3xl font-black text-app-text">{{ selectedTask.nombre }}</h3>
         </div>
         <div class="flex items-center space-x-2">
           <button @click="emit('edit-task', selectedTask); closeTaskDetails()" class="p-2 text-blue-600 dark:text-blue-400 hover:opacity-70 transition-colors" title="Editar Tarea">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
           </button>
           <button @click="closeTaskDetails" class="p-2 text-app-text-muted hover:text-app-text transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
         </div>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
         <!-- Description -->
         <div>
            <h4 class="text-[10px] font-black text-app-text-muted uppercase tracking-widest mb-2">Descripción</h4>
            <div class="text-app-text text-sm leading-relaxed bg-app-bg/50 p-4 rounded-2xl border border-app-border whitespace-pre-wrap">{{ selectedTask.descripcion || 'Sin descripción detallada.' }}</div>
         </div>

         <!-- Assigned Users -->
         <div v-if="selectedTask.asignados && selectedTask.asignados.length > 0">
            <h4 class="text-[10px] font-black text-app-text-muted uppercase tracking-widest mb-2">Asignados</h4>
            <div class="flex flex-wrap gap-2">
               <div v-for="user in selectedTask.asignados" :key="user.id" class="px-3 py-1.5 bg-app-bg/50 border border-app-border rounded-xl text-xs font-bold text-app-text">
                  {{ user.nombre }}
               </div>
            </div>
         </div>

         <!-- Subtasks List -->
         <div>
            <div class="flex items-center justify-between mb-3">
               <h4 class="text-[10px] font-black text-app-text-muted uppercase tracking-widest">Subtareas</h4>
               <span class="text-[10px] font-bold text-app-text-muted bg-app-bg/50 px-2 py-0.5 rounded-full">{{ selectedTask.subtareas?.length || 0 }}</span>
            </div>
            
            <div v-if="selectedTask.subtareas?.length > 0" class="space-y-2">
               <div 
                 v-for="sub in selectedTask.subtareas" 
                 :key="sub.id"
                 class="flex items-center space-x-3 p-3 bg-app-bg/50 border border-app-border rounded-xl hover:border-purple-500/30 transition-colors group cursor-pointer"
                 @click="toggleSubtaskStatus(sub)"
               >
                 <div class="w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all"
                      :class="sub.estado === 'Finalizado' ? 'bg-purple-600 border-purple-500 text-white' : 'border-app-border text-transparent'">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                 </div>
                 <span class="text-sm font-medium transition-colors" :class="sub.estado === 'Finalizado' ? 'text-app-text-muted line-through' : 'text-app-text'">{{ sub.nombre }}</span>
                 
                 <button @click.stop="emit('edit-task', sub); closeTaskDetails()" class="ml-auto text-app-text-muted hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Editar Subtarea">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                 </button>
               </div>
            </div>
            <div v-else class="text-xs text-app-text-muted italic p-4 bg-app-bg/30 rounded-xl border border-dashed border-app-border text-center">
               Esta tarea no tiene subtareas.
            </div>
         </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, watch, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { useTaskStore } from '../store/tasks'
import { useProjectStore } from '../store/projects'
import InputModal from './InputModal.vue'

const props = defineProps({
  projectStatus: String
})

const emit = defineEmits(['add-subtask', 'add-task', 'edit-task'])
const taskStore = useTaskStore()
const projectStore = useProjectStore()

const showDetailModal = ref(false)
const selectedTask = ref(null)

const openTaskDetails = (task) => {
    // Populate with fresh data if possible
    const freshTask = taskStore.tasks.find(t => t.id === task.id)
    selectedTask.value = freshTask || task
    showDetailModal.value = true
}

const closeTaskDetails = () => {
    showDetailModal.value = false
    selectedTask.value = null
}

const toggleSubtaskStatus = async (subtask) => {
    const newStatus = subtask.estado === 'Finalizado' ? 'Pendiente' : 'Finalizado'
    const res = await taskStore.updateTask(subtask.id, { estado: newStatus })
    if (res && selectedTask.value) {
        // Optimistically update the subtask in the local view
        const target = selectedTask.value.subtareas.find(s => s.id === subtask.id)
        if (target) {
           target.estado = newStatus
        }
    }
}

const defaultColumns = [
  { id: 'Pendiente', title: 'Pendiente', color: 'bg-slate-400' },
  { id: 'En Desarrollo', title: 'En Desarrollo', color: 'bg-blue-400' },
  { id: 'Bloqueado', title: 'Bloqueado', color: 'bg-red-400' },
  { id: 'Finalizado', title: 'Finalizado', color: 'bg-green-400' }
]

const columns = ref(
   projectStore.currentProject?.columnasKanban && Array.isArray(projectStore.currentProject.columnasKanban) && projectStore.currentProject.columnasKanban.length > 0
   ? [...projectStore.currentProject.columnasKanban]
   : [...defaultColumns]
)

const columnsTasks = ref({})
// Initial initialization
const initColumnsTasks = () => {
    columns.value.forEach(c => {
        if (!columnsTasks.value[c.id]) {
            columnsTasks.value[c.id] = []
        }
    })
}
initColumnsTasks()

const showAddStateModal = ref(false)

const addColumn = () => {
    // Open the reusable modal instead of a native prompt
    showAddStateModal.value = true
}

const handleConfirmAddColumn = async (name) => {
    if (name && !columns.value.find(c => c.id.toLowerCase() === name.toLowerCase())) {
        columns.value.push({
            id: name,
            title: name,
            color: 'bg-purple-400'
        })
        columnsTasks.value[name] = []
        if (projectStore.currentProject) {
            await projectStore.updateProject(projectStore.currentProject.id, { columnasKanban: columns.value })
        }
    }
}

const getTasksByStatus = (status) => {
  return taskStore.tasks.filter(t => !t.esSubtarea && t.estado === status)
}

const syncColumns = () => {
  columns.value.forEach(col => {
    columnsTasks.value[col.id] = getTasksByStatus(col.id)
  })
}

onMounted(() => syncColumns())

watch(() => taskStore.tasks, () => {
    syncColumns()
}, { deep: true, immediate: true })

watch(() => columns.value, () => {
    initColumnsTasks()
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
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.bg-white\/2 { background-color: rgba(255, 255, 255, 0.02); }

@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-pop-in { animation: pop-in 0.3s cubic-bezier(0, 0, 0.2, 1); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.3); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.6); }
</style>
