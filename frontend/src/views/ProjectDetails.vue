<template>
  <div v-if="projectStore.loading || taskStore.loading && taskStore.tasks.length === 0" class="flex justify-center py-20">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>

  <div v-else-if="!projectStore.currentProject" class="text-center py-20">
    <p class="text-slate-500 font-medium">No se encontró el proyecto.</p>
    <router-link to="/projects" class="text-purple-400 mt-4 inline-block font-bold underline">Volver a Proyectos</router-link>
  </div>

  <div v-else>
    <header class="mb-10 flex flex-col md:flex-row justify-between items-start gap-4">
      <div>
        <router-link to="/projects" class="text-slate-500 hover:text-white transition-colors flex items-center space-x-2 mb-4 text-sm font-bold uppercase tracking-widest">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Volver a proyectos</span>
        </router-link>
        <h2 class="text-4xl font-black tracking-tight">{{ projectStore.currentProject.nombre }}</h2>
        <div class="flex items-center space-x-4 mt-3">
          <span :class="getStatusClass(projectStore.currentProject.estado)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border">
            {{ projectStore.currentProject.estado }}
          </span>
          <p class="text-slate-400 text-sm font-medium">Desde {{ formatDate(projectStore.currentProject.fechaCreacion) }}</p>
        </div>
      </div>

      <!-- Error Toast (Static for now) -->
      <div v-if="taskStore.error" class="fixed top-24 right-8 z-[60] animate-bounce">
         <div class="bg-red-500/20 backdrop-blur-xl border border-red-500/30 px-6 py-3 rounded-2xl text-red-400 font-bold shadow-2xl flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"/></svg>
            <span>{{ taskStore.error }}</span>
         </div>
      </div>
      
      <div class="flex space-x-3 w-full md:w-auto">
        <button 
          @click="openTaskModal()"
          :disabled="projectStore.currentProject.estado !== 'ACTIVO'"
          class="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          + Nueva Tarea
        </button>
        <router-link 
          :to="`/projects/${route.params.id}/kanban`"
          class="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all active:scale-95 text-center"
        >
          Ver Kanban
        </router-link>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-8">
        <section class="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl">
          <h3 class="text-xl font-black mb-4">Descripción del Proyecto</h3>
          <p class="text-slate-300 leading-relaxed">{{ projectStore.currentProject.descripcion || 'Sin descripción disponible.' }}</p>
        </section>

        <section class="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl min-h-[400px]">
          <h3 class="text-xl font-black mb-6 flex items-center justify-between">
            <span>Tareas y Subtareas</span>
            <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-bold text-slate-400">{{ mainTasks.length }} principales</span>
            </div>
          </h3>
          
          <div v-if="mainTasks.length > 0" class="space-y-4">
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
                    @click.stop="toggleTaskStatus(task)"
                    :disabled="projectStore.currentProject.estado !== 'ACTIVO'"
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
                          @click.stop="openTaskModal(task.id)"
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
                                @click.stop="toggleTaskStatus(sub)"
                                class="w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all"
                                :class="sub.estado === 'Finalizado' ? 'bg-green-500 border-green-500 text-slate-900' : 'border-slate-700'"
                              >
                                <svg v-if="sub.estado === 'Finalizado'" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="5"><path d="M5 13l4 4L19 7"/></svg>
                              </button>
                              <span class="text-sm font-medium" :class="sub.estado === 'Finalizado' ? 'line-through text-slate-500' : ''">{{ sub.nombre }}</span>
                           </div>
                           <button @click.stop="handleDeleteTask(sub.id)" class="text-slate-600 hover:text-red-400 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" stroke-width="2"/></svg>
                           </button>
                        </div>
                    </div>
                </div>

                <div class="mt-6 pt-4 border-t border-white/5 flex justify-end space-x-3">
                   <button @click.stop="handleDeleteTask(task.id)" class="text-xs font-bold text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-widest">Eliminar Tarea Principal</button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-20 bg-white/1 rounded-3xl border border-dashed border-white/10">
            <p class="text-slate-500 font-bold">Sin tareas asignadas.</p>
          </div>
        </section>
      </div>

      <!-- Right Column -->
      <div class="space-y-8">
        <section class="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/10 p-8 rounded-3xl relative overflow-hidden group">
           <h3 class="text-xl font-black mb-6">Progreso</h3>
           <div class="space-y-6">
              <div>
                <div class="flex justify-between text-sm font-bold mb-2">
                    <span class="text-slate-400 uppercase tracking-widest">Proyecto</span>
                    <span class="text-purple-400">{{ completionPercentage }}%</span>
                </div>
                <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div :style="{ width: completionPercentage + '%' }" class="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"></div>
                </div>
              </div>
              <p class="text-xs text-slate-500 font-medium leading-relaxed">El progreso se calcula basándose únicamente en las tareas principales finalizadas.</p>
           </div>
        </section>
      </div>
    </div>

    <!-- Enhanced Task/Subtask Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md" @click="showModal = false"></div>
      <div class="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 w-full max-w-xl relative z-10 shadow-2xl animate-pop-in">
        <h3 class="text-3xl font-black mb-1">{{ isSubtask ? 'Nueva Subtarea' : 'Nueva Tarea Principal' }}</h3>
        <p class="text-slate-400 mb-8 font-medium">{{ isSubtask ? 'Añadiendo a: ' + parentTaskName : 'Define una actividad principal para el proyecto.' }}</p>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Título de la {{ isSubtask ? 'subtarea' : 'tarea' }}</label>
            <input v-model="newTask.nombre" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all" :placeholder="isSubtask ? 'Nombre de la subtarea' : 'Nombre de la tarea principal'">
          </div>

          <div>
             <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Detalles / Descripción</label>
             <textarea v-model="newTask.descripcion" rows="3" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all" placeholder="Explica brevemente de qué trata esta actividad..."></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Prioridad</label>
              <select v-model="newTask.prioridad" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none cursor-pointer">
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>
            <div class="flex items-end pb-1 pb-4">
               <div class="w-full h-12 bg-white/3 border border-white/5 rounded-2xl flex items-center px-4">
                  <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Estado: Pendiente</span>
               </div>
            </div>
          </div>

          <div class="flex space-x-4 pt-6">
            <button type="button" @click="showModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" class="flex-1 py-4 bg-purple-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/30">
               {{ isSubtask ? 'Crear Subtarea' : 'Crear Tarea' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '../store/projects'
import { useTaskStore } from '../store/tasks'

const route = useRoute()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const showModal = ref(false)
const isSubtask = ref(false)
const parentTaskId = ref(null)
const expandedTasks = ref([])
const newTask = ref({ nombre: '', descripcion: '', prioridad: 'MEDIA' })

const mainTasks = computed(() => taskStore.tasks.filter(t => !t.esSubtarea))
const parentTaskName = computed(() => {
    if (!parentTaskId.value) return ''
    return taskStore.tasks.find(t => t.id === parentTaskId.value)?.nombre
})

onMounted(async () => {
  await projectStore.fetchProjectById(route.params.id)
  await taskStore.fetchTasksByProject(route.params.id)
})

const completionPercentage = computed(() => {
    const mainOnly = taskStore.tasks.filter(t => !t.esSubtarea)
    if (mainOnly.length === 0) return 0
    const completed = mainOnly.filter(t => t.estado === 'Finalizado').length
    return Math.round((completed / mainOnly.length) * 100)
})

const openTaskModal = (pid = null) => {
    isSubtask.value = !!pid
    parentTaskId.value = pid
    newTask.value = { nombre: '', descripcion: '', prioridad: 'MEDIA' }
    showModal.value = true
}

const handleSubmit = async () => {
    let success = false
    if (isSubtask.value) {
        const res = await taskStore.createSubtask(parentTaskId.value, newTask.value)
        if (res) {
            success = true
            // Importante: Recargar para asegurar que las relaciones se vean bien
            await taskStore.fetchTasksByProject(route.params.id)
        }
    } else {
        const res = await taskStore.createTask(route.params.id, newTask.value)
        if (res) success = true
    }
    
    if (success) {
        showModal.value = false
    }
}

const toggleExpand = (id) => {
    const idx = expandedTasks.value.indexOf(id)
    if (idx > -1) expandedTasks.value.splice(idx, 1)
    else expandedTasks.value.push(id)
}

const toggleTaskStatus = async (task) => {
    const newStatus = task.estado === 'Finalizado' ? 'Pendiente' : 'Finalizado'
    await taskStore.updateTask(task.id, { estado: newStatus })
    
    // Refresh parent if it was a subtarea to ensure state consistency (optional depending on UX)
    if (task.esSubtarea) {
       await taskStore.fetchTasksByProject(route.params.id)
    }
}

const handleDeleteTask = async (taskId) => {
    if (confirm('¿Estás seguro de eliminar esta actividad?')) {
        await taskStore.deleteTask(taskId)
    }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'ACTIVO': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'PAUSADO': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'FINALIZADO': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
}

const getPriorityClass = (priority) => {
    switch (priority) {
        case 'CRITICA': return 'bg-red-500/10 text-red-500 border-red-500/20';
        case 'ALTA': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        case 'MEDIA': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
}
</script>

<style scoped>
@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes slide-down {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-pop-in { animation: pop-in 0.3s cubic-bezier(0, 0, 0.2, 1); }
.animate-slide-down { animation: slide-down 0.2s ease-out; }
.bg-white\/3 { background-color: rgba(255, 255, 255, 0.03); }
.bg-white\/1 { background-color: rgba(255, 255, 255, 0.01); }
</style>
