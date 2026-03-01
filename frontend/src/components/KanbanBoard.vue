<template>
  <div class="h-full flex flex-col">
    <!-- Kanban Board -->
    <div class="flex-1 overflow-x-auto pb-8 scrollbar-hide">
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
            class="flex-1 space-y-4 min-h-[400px] p-2 bg-white/2 rounded-3xl border border-white/5"
            @change="evt => handleDragChange(evt, column.id)"
            :animation="200"
            ghost-class="opacity-50"
            :disabled="projectStatus !== 'ACTIVO'"
          >
            <template #item="{ element }">
              <div class="bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl cursor-grab active:cursor-grabbing hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all group relative overflow-hidden">
                <div :class="getPriorityBarClass(element.prioridad)" class="absolute top-0 left-0 bottom-0 w-1"></div>
                <div class="flex justify-between items-start mb-3">
                  <span :class="getPriorityTextClass(element.prioridad)" class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-current opacity-70">
                    {{ element.prioridad }}
                  </span>
                </div>
                <h4 class="font-bold text-slate-100 text-sm leading-snug group-hover:text-white transition-colors">{{ element.nombre }}</h4>
                <p v-if="element.descripcion" class="text-xs text-slate-500 mt-2 line-clamp-2 italic">{{ element.descripcion }}</p>
                
                <div class="mt-4 flex items-center justify-between">
                   <div class="flex -space-x-2">
                      <div 
                        v-for="user in element.asignados" 
                        :key="user.id"
                        class="w-6 h-6 rounded-full border border-slate-900 bg-purple-600 flex items-center justify-center text-[8px] font-black text-white uppercase"
                        :title="user.nombre"
                      >
                         {{ user.nombre.slice(0, 2) }}
                      </div>
                   </div>
                   <div class="text-[9px] text-slate-700 font-bold uppercase tracking-tight">
                      #{{ element.id.slice(0, 4) }}
                   </div>
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
import { ref, watch, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { useTaskStore } from '../store/tasks'

const props = defineProps({
  projectStatus: String
})

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

onMounted(() => syncColumns())

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
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.bg-white\/2 { background-color: rgba(255, 255, 255, 0.02); }
</style>
