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
      
      <div class="flex space-x-3 w-full md:w-auto">
         <button class="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
          Editar
        </button>
        <button 
          @click="showCreateTaskModal = true"
          :disabled="projectStore.currentProject.estado !== 'ACTIVO'"
          class="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          + Nueva Tarea
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Description & Tasks -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Info Card -->
        <section class="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl">
          <h3 class="text-xl font-black mb-4">Descripción del Proyecto</h3>
          <p class="text-slate-300 leading-relaxed">{{ projectStore.currentProject.descripcion || 'Sin descripción disponible.' }}</p>
        </section>

        <!-- Tasks Section -->
        <section class="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl min-h-[400px]">
          <h3 class="text-xl font-black mb-6 flex items-center justify-between">
            <span>Tareas del Proyecto</span>
            <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-bold text-slate-400">{{ taskStore.tasks.length }}</span>
            </div>
          </h3>
          
          <div v-if="taskStore.tasks.length > 0" class="space-y-4">
             <div 
              v-for="task in taskStore.tasks" 
              :key="task.id"
              class="flex items-center justify-between p-5 bg-white/3 hover:bg-white/8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group"
            >
              <div class="flex items-center space-x-4">
                <button 
                  @click="toggleTaskStatus(task)"
                  :disabled="projectStore.currentProject.estado !== 'ACTIVO'"
                  class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
                  :class="task.estado === 'Finalizado' ? 'bg-green-500 border-green-500 text-slate-900 shadow-lg shadow-green-500/20' : 'border-slate-600 hover:border-purple-500'"
                >
                  <svg v-if="task.estado === 'Finalizado'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
                </button>
                <div>
                  <p class="font-bold text-slate-100 group-hover:text-white" :class="task.estado === 'Finalizado' ? 'line-through text-slate-500' : ''">
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
              
              <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button @click="handleDeleteTask(task.id)" class="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-20 bg-white/1 rounded-3xl border border-dashed border-white/10">
            <div class="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-4 text-slate-600">
               <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <p class="text-slate-500 font-bold">No hay tareas creadas.</p>
            <button @click="showCreateTaskModal = true" class="text-purple-400 text-sm mt-2 font-black uppercase tracking-widest hover:text-purple-300">Crear la primera tarea</button>
          </div>
        </section>
      </div>

      <!-- Right Column: Docs & Stats -->
      <div class="space-y-8">
        <!-- Documentation -->
        <section class="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl">
          <h3 class="text-xl font-black mb-6 flex items-center justify-between">
            <span>Documentación</span>
            <button class="text-purple-400 text-xs font-black uppercase tracking-widest p-2 hover:bg-purple-500/10 rounded-xl transition-all">Editar</button>
          </h3>
          <div v-if="projectStore.currentProject.documentacion" class="prose prose-invert prose-sm">
            <div class="text-slate-300">{{ projectStore.currentProject.documentacion.contenido }}</div>
          </div>
          <div v-else class="flex flex-col items-center py-6 text-center">
            <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <p class="text-slate-500 text-sm italic">No hay documentos aún.</p>
          </div>
        </section>

        <!-- Stats Card -->
        <section class="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/10 p-8 rounded-3xl overflow-hidden relative group">
           <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 blur-3xl pointer-events-none group-hover:scale-150 transition-transform"></div>
           <h3 class="text-xl font-black mb-6">Estado de Avance</h3>
           <div class="space-y-6">
              <div>
                <div class="flex justify-between text-sm font-bold mb-2">
                    <span class="text-slate-400 uppercase tracking-widest">Global</span>
                    <span class="text-purple-400">{{ completionPercentage }}%</span>
                </div>
                <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div :style="{ width: completionPercentage + '%' }" class="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"></div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white/3 p-4 rounded-2xl border border-white/5">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Finalizadas</p>
                      <p class="text-2xl font-black">{{ completedTasks }}</p>
                  </div>
                  <div class="bg-white/3 p-4 rounded-2xl border border-white/5">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Pendientes</p>
                      <p class="text-2xl font-black">{{ pendingTasks }}</p>
                  </div>
              </div>
           </div>
        </section>
      </div>
    </div>

    <!-- Create Task Modal -->
    <div v-if="showCreateTaskModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md" @click="showCreateTaskModal = false"></div>
      <div class="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 w-full max-w-xl relative z-10 shadow-2xl animate-pop-in">
        <h3 class="text-3xl font-black mb-2">Nueva Tarea</h3>
        <p class="text-slate-400 mb-8 font-medium">Define los detalles de la actividad a realizar.</p>
        
        <form @submit.prevent="handleCreateTask" class="space-y-6">
          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nombre de la tarea</label>
            <input v-model="newTask.nombre" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none transition-all placeholder:text-slate-700" placeholder="Ej: Implementar Login">
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Prioridad</label>
              <select v-model="newTask.prioridad" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none appearance-none cursor-pointer">
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>
            <div>
               <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Estado inicial</label>
               <input value="Pendiente" disabled class="w-full bg-white/3 border border-white/5 rounded-2xl px-6 py-4 text-slate-600 cursor-not-allowed">
            </div>
          </div>

          <div class="flex space-x-4 pt-6">
            <button type="button" @click="showCreateTaskModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" class="flex-1 py-4 bg-purple-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/30">Crear Tarea</button>
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

const showCreateTaskModal = ref(false)
const newTask = ref({ nombre: '', prioridad: 'MEDIA' })

onMounted(async () => {
  await projectStore.fetchProjectById(route.params.id)
  await taskStore.fetchTasksByProject(route.params.id)
})

const completedTasks = computed(() => taskStore.tasks.filter(t => t.estado === 'Finalizado').length)
const pendingTasks = computed(() => taskStore.tasks.length - completedTasks.value)
const completionPercentage = computed(() => {
    if (taskStore.tasks.length === 0) return 0
    return Math.round((completedTasks.value / taskStore.tasks.length) * 100)
})

const handleCreateTask = async () => {
  const success = await taskStore.createTask(route.params.id, newTask.value)
  if (success) {
    showCreateTaskModal.value = false
    newTask.value = { nombre: '', prioridad: 'MEDIA' }
  }
}

const toggleTaskStatus = async (task) => {
    const newStatus = task.estado === 'Finalizado' ? 'Pendiente' : 'Finalizado'
    await taskStore.updateTask(task.id, { estado: newStatus })
}

const handleDeleteTask = async (taskId) => {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        await taskStore.deleteTask(taskId)
    }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
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
.animate-pop-in {
  animation: pop-in 0.3s cubic-bezier(0, 0, 0.2, 1);
}
.bg-white\/3 { background-color: rgba(255, 255, 255, 0.03); }
.bg-white\/8 { background-color: rgba(255, 255, 255, 0.08); }
</style>
