<template>
  <div class="space-y-4">
    <div 
      v-for="task in mainTasks" 
      :key="task.id"
      class="bg-white/3 rounded-2xl border border-white/5 overflow-hidden transition-all"
      :class="expandedTasks.includes(task.id) ? 'ring-1 ring-purple-500/30' : ''"
    >
      <!-- Task Header -->
      <div class="flex items-center justify-between p-5 hover:bg-white/5 cursor-pointer" @click="toggleExpand(task.id)">
        <div class="flex items-center space-x-4">
          <button 
            @click.stop="emit('toggleStatus', task)"
            :disabled="projectStatus !== 'ACTIVO'"
            class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
            :class="task.estado === 'Finalizado' ? 'bg-green-500 border-green-500 text-slate-900 shadow-lg shadow-green-500/20' : 'border-slate-600 hover:border-purple-500'"
          >
            <svg v-if="task.estado === 'Finalizado'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
          </button>
          <div>
            <p class="font-bold text-slate-100" :class="task.estado === 'Finalizado' ? 'line-through text-slate-500' : ''">
              {{ task.nombre }}
            </p>
            <div class="flex items-center space-x-3 mt-1.5">
              <span :class="getPriorityClass(task.prioridad)" class="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md border">
                  {{ task.prioridad }}
              </span>
              <span class="text-[10px] text-slate-600 font-bold uppercase">{{ task.estado }}</span>
              
              <!-- Assigned users -->
              <div class="flex -space-x-1.5 ml-2">
                 <div 
                   v-for="user in task.asignados" 
                   :key="user.id"
                   class="w-5 h-5 rounded-full border border-slate-900 bg-slate-700 flex items-center justify-center text-[7px] font-black text-slate-300 uppercase"
                   :title="user.nombre"
                 >
                    {{ user.nombre.slice(0, 2) }}
                 </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
           <div v-if="task.subtareas?.length > 0" class="flex items-center text-slate-500 space-x-1">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-width="2"/></svg>
              <span class="text-xs font-bold">{{ task.subtareas.length }}</span>
           </div>
           <svg :class="expandedTasks.includes(task.id) ? 'rotate-180' : ''" class="w-5 h-5 text-slate-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>

      <!-- Task Content (Expanded) -->
      <div v-if="expandedTasks.includes(task.id)" class="px-5 pb-5 border-t border-white/5 bg-slate-900/40 animate-slide-down">
        <div class="py-4">
          <p class="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Detalle</p>
          <p class="text-sm text-slate-300">{{ task.descripcion || 'Sin detalle adicional.' }}</p>
        </div>

        <!-- Subtasks List -->
        <div class="mt-4">
            <div class="flex items-center justify-between mb-4">
                <p class="text-xs font-black text-slate-500 uppercase tracking-widest">Subtareas</p>
                <button 
                  @click.stop="emit('addSubtask', task.id)"
                  class="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 px-2 py-1 rounded-lg bg-purple-500/5"
                >
                  + Añadir Subtarea
                </button>
            </div>

            <div v-if="task.subtareas?.length > 0" class="space-y-3 pl-4 border-l border-white/5">
                <div 
                  v-for="sub in task.subtareas" 
                  :key="sub.id"
                  class="flex items-center justify-between p-3 bg-white/1 rounded-xl group/sub"
                >
                   <div class="flex items-center space-x-3">
                      <button 
                        @click.stop="emit('toggleStatus', sub)"
                        class="w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all"
                        :class="sub.estado === 'Finalizado' ? 'bg-green-500 border-green-500 text-slate-900' : 'border-slate-700'"
                      >
                        <svg v-if="sub.estado === 'Finalizado'" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="5"><path d="M5 13l4 4L19 7"/></svg>
                      </button>
                      <span class="text-sm font-medium" :class="sub.estado === 'Finalizado' ? 'line-through text-slate-500' : ''">{{ sub.nombre }}</span>
                   </div>
                   <button @click.stop="emit('deleteTask', sub.id)" class="text-slate-600 hover:text-red-400 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" stroke-width="2"/></svg>
                   </button>
                </div>
            </div>
        </div>

        <div class="mt-6 pt-4 border-t border-white/5 flex justify-end space-x-3">
           <button @click.stop="emit('deleteTask', task.id)" class="text-xs font-bold text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-widest">Eliminar Tarea Principal</button>
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

const emit = defineEmits(['toggleStatus', 'addSubtask', 'deleteTask'])

const taskStore = useTaskStore()
const expandedTasks = ref([])

const mainTasks = computed(() => taskStore.tasks.filter(t => !t.esSubtarea))

const toggleExpand = (id) => {
    const idx = expandedTasks.value.indexOf(id)
    if (idx > -1) expandedTasks.value.splice(idx, 1)
    else expandedTasks.value.push(id)
}

const getPriorityClass = (priority) => {
    switch (priority) {
        case 'CRITICA': return 'bg-red-500/10 text-red-500 border-red-500/20';
        case 'ALTA': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        case 'MEDIA': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
}
</script>

<style scoped>
@keyframes slide-down {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-slide-down { animation: slide-down 0.2s ease-out; }
.bg-white\/3 { background-color: rgba(255, 255, 255, 0.03); }
.bg-white\/1 { background-color: rgba(255, 255, 255, 0.01); }
</style>
