<template>
  <div class="h-full flex flex-col">
    <!-- Kanban Board -->
    <div class="flex-1 overflow-x-auto pb-8 scrollbar-hide">
      <div class="flex space-x-6 min-w-max h-full">
        <div v-for="column in columns" :key="column.id" class="w-80 flex flex-col">
          <!-- Column Header -->
          <div class="flex items-center justify-between mb-4 px-2 border-b-2 border-app-border pb-2">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-app-text flex items-center space-x-2">
              <span>>> {{ column.title }}</span>
            </h3>
            <div class="flex items-center space-x-2">
               <button 
                  @click="$emit('add-task')"
                  class="p-1 border-2 border-app-border text-app-text hover:bg-app-text hover:text-app-bg transition-colors"
                  title="[+]"
               >
                 [+]
               </button>
               <span class="text-[10px] font-black text-app-text bg-app-secondary border-2 border-app-border px-2 py-0.5">
                 {{ getTasksByStatus(column.id).length }}
               </span>
            </div>
          </div>

          <!-- Draggable Column -->
          <draggable
            v-model="columnsTasks[column.id]"
            group="tasks"
            item-key="id"
            class="flex-1 space-y-4 min-h-[400px] p-3 bg-app-secondary border-2 border-app-border"
            @change="evt => handleDragChange(evt, column.id)"
            :animation="0"
            ghost-class="opacity-50"
            :disabled="projectStatus !== 'ACTIVO'"
            :list="columnsTasks[column.id] || []"
          >
            <template #item="{ element }">
              <div class="pixel-card cursor-grab active:cursor-grabbing hover:bg-app-text/5 transition-all group relative overflow-hidden">
                <div :class="getPriorityBarClass(element.prioridad)" class="absolute top-0 left-0 bottom-0 w-1"></div>
                <div class="flex justify-between items-start mb-3">
                  <span :class="getPriorityTextClass(element.prioridad)" class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-2 border-current">
                    {{ element.prioridad }}
                  </span>
                  <div v-if="element.ticketLigado" class="text-[9px] font-black text-app-bg bg-app-text px-2 py-0.5 border-2 border-app-text flex items-center gap-1" title="TK">
                     <span>TK-{{ (element.ticketLigado?.id || '').substring(0,4) }}</span>
                  </div>
                </div>
                <h4 class="font-bold text-app-text text-sm leading-snug uppercase tracking-widest">{{ element.nombre }}</h4>
                <button 
                  @click.stop="openTaskDetails(element)"
                  class="mt-2 text-[10px] font-black uppercase tracking-widest text-app-text hover:underline transition-colors block text-left"
                >
                  _ VER_DETALLE
                </button>
                
                <div class="mt-4 flex items-center justify-between pt-3 border-t-2 border-app-border">
                   <div class="flex -space-x-1">
                      <div 
                        v-for="user in element.asignados" 
                        :key="user.id"
                        class="w-6 h-6 border-2 border-app-border bg-app-text flex items-center justify-center text-[10px] font-black text-app-bg uppercase"
                         :title="user?.nombre || 'USER'"
                      >
                         {{ (user?.nombre || '??').slice(0, 1) }}
                      </div>
                   </div>
                   <div class="flex items-center space-x-3">
                     <button 
                       @click.stop="$emit('add-subtask', element.id)" 
                       class="text-[10px] font-bold uppercase tracking-widest text-app-text hover:bg-app-text hover:text-app-bg px-1 border-2 border-transparent hover:border-app-border transition-colors"
                     >
                        [+] SUB
                     </button>
                     <div class="text-[9px] text-app-text-secondary font-bold uppercase tracking-tight">
                        ID:{{ (element?.id || '----').slice(0, 4) }}
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
             class="w-full h-[100px] flex items-center justify-center space-x-2 border-2 border-dashed border-app-border text-app-text-secondary font-bold hover:text-app-text hover:border-app-text transition-all uppercase tracking-widest "
           >
              <span>[+] AÑADIR_ESTADO</span>
           </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Reusable Input Modal for generic prompts -->
  <InputModal 
    v-model="showAddStateModal"
    title=">> NUEVO_ESTADO"
    description="DEFINE UNA NUEVA COLUMNA PARA EL FLUJO DE TRABAJO."
    inputLabel="NOMBRE_DEL_ESTADO:"
    placeholder="EJ: TEST_QA..."
    confirmText="[ CONFIRMAR ]"
    @confirm="handleConfirmAddColumn"
  />

  <!-- Task Detail Modal -->
  <div v-if="showDetailModal && selectedTask" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-app-bg/90" @click="closeTaskDetails"></div>
    <div class="bg-app-secondary border-4 border-app-border p-10 w-full max-w-2xl relative z-10 shadow-[8px_8px_0px_0px_rgba(0,255,65,0.2)] flex flex-col max-h-[90vh]">
      <div class="flex justify-between items-start mb-6 shrink-0 border-b-2 border-app-border pb-4">
         <div>
            <div class="flex items-center space-x-3 mb-2">
               <span :class="getPriorityTextClass(selectedTask.prioridad)" class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border-2 border-current">
                 {{ selectedTask.prioridad }}
               </span>
                <span class="text-[10px] text-app-text-secondary font-bold uppercase tracking-widest">
                 ID:{{ (selectedTask?.id || '').substring(0,8) }}
               </span>
            </div>
            <h3 class="text-3xl font-black text-app-text uppercase tracking-widest">>> {{ selectedTask.nombre }}</h3>
         </div>
         <div class="flex items-center space-x-2">
           <button @click="emit('edit-task', selectedTask); closeTaskDetails()" class="p-1 border-2 border-app-border text-app-text hover:bg-app-text hover:text-app-bg transition-colors" title="EDIT">
              [EDIT]
           </button>
           <button @click="closeTaskDetails" class="p-1 border-2 border-app-border text-app-text hover:bg-app-text hover:text-app-bg transition-colors">
              [X]
           </button>
         </div>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
         <!-- Description -->
         <div>
            <h4 class="text-[10px] font-black text-app-text-secondary uppercase tracking-widest mb-2">> DESCRIPCIÓN</h4>
            <div class="text-app-text text-sm leading-relaxed bg-app-secondary p-4 border-2 border-app-border whitespace-pre-wrap uppercase tracking-widest">{{ selectedTask.descripcion || 'SIN DATOS.' }}</div>
         </div>
 
         <!-- Assigned Users -->
         <div v-if="selectedTask.asignados && selectedTask.asignados.length > 0">
            <h4 class="text-[10px] font-black text-app-text-secondary uppercase tracking-widest mb-2">> ASIGNADOS</h4>
            <div class="flex flex-wrap gap-2">
               <div v-for="user in selectedTask.asignados" :key="user.id" class="px-3 py-1 bg-app-secondary border-2 border-app-border text-xs font-bold text-app-text uppercase tracking-widest">
                  [ {{ user.nombre }} ]
               </div>
            </div>
         </div>

         <!-- Subtasks List -->
         <div>
            <div class="flex items-center justify-between mb-3 border-b-2 border-app-border pb-1">
               <h4 class="text-[10px] font-black text-app-text-secondary uppercase tracking-widest">> SUBTAREAS</h4>
               <span class="text-[10px] font-bold text-app-text bg-app-secondary border-2 border-app-border px-2">{{ selectedTask.subtareas?.length || 0 }}</span>
            </div>
            
            <div v-if="selectedTask.subtareas?.length > 0" class="space-y-2">
               <div 
                 v-for="sub in selectedTask.subtareas" 
                 :key="sub.id"
                 class="flex items-center space-x-3 p-3 bg-app-secondary border-2 border-app-border hover:bg-app-text/5 transition-colors group cursor-pointer"
                 @click="toggleSubtaskStatus(sub)"
               >
                 <div class="w-5 h-5 border-2 border-app-border flex items-center justify-center shrink-0 transition-all font-black text-xs"
                      :class="sub.estado === 'Finalizado' ? 'bg-app-text text-app-bg' : 'text-transparent'">
                    X
                 </div>
                 <span class="text-sm font-medium transition-colors uppercase tracking-widest" :class="sub.estado === 'Finalizado' ? 'text-app-text-secondary line-through' : 'text-app-text'">{{ sub.nombre }}</span>
                 
                 <button @click.stop="emit('edit-task', sub); closeTaskDetails()" class="ml-auto text-app-text-secondary hover:text-app-text opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs" title="EDIT">
                    [EDIT]
                 </button>
               </div>
            </div>
            <div v-else class="text-xs text-app-text-secondary p-4 bg-app-secondary border-2 border-dashed border-app-border text-center uppercase tracking-widest">
               [ NO SE ENCONTRARON SUBTAREAS ]
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
  return 'bg-current opacity-50'; // Managed by parent text class
}

const getPriorityTextClass = (priority) => {
  switch (priority) {
    case 'CRITICA': return 'text-red-500';
    case 'ALTA': return 'text-yellow-500';
    case 'MEDIA': return 'text-blue-500';
    default: return 'text-app-text-secondary';
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

.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: var(--bg-primary); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--text-secondary); border: 2px solid var(--bg-primary); }
</style>
