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
          class="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          + Nueva Tarea
        </button>
      </div>
    </header>

    <!-- Project Content -->
    <main class="space-y-8 animate-fade-in">
      <!-- Full Width Description -->
      <section class="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl">
        <h3 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Descripción del Proyecto</h3>
        <p class="text-slate-200 text-lg leading-relaxed">{{ projectStore.currentProject.descripcion || 'Sin descripción disponible.' }}</p>
      </section>

      <!-- Progress & Documentation Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Progress Section (Left) -->
        <section class="lg:col-span-5 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl flex flex-col justify-center">
          <div class="flex items-center justify-between mb-8">
             <h3 class="text-xl font-black">Estado del Progreso</h3>
             <span class="text-3xl font-black text-purple-400">{{ completionPercentage }}%</span>
          </div>
          
          <div class="relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 mb-4">
            <div 
              class="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-1000 ease-out"
              :style="{ width: `${completionPercentage}%` }"
            ></div>
          </div>
          <p class="text-xs text-slate-500 font-bold uppercase tracking-widest text-right">Basado en tareas principales finalizadas</p>
        </section>

        <!-- Documentation Section (Right) -->
        <section class="lg:col-span-12 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl flex flex-col min-h-[400px]">
          <div class="flex items-center justify-between mb-8">
             <h3 class="text-xl font-black flex items-center space-x-3">
                <svg class="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2"/></svg>
                <span>Documentos & Recursos</span>
             </h3>
             <button 
                @click="showAddDocModal = true"
                class="px-6 py-3 bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600/20 transition-all flex items-center space-x-2"
              >
                <span>+ Agregar Documento</span>
              </button>
          </div>

          <!-- Documents List (Compact) -->
          <div class="space-y-3">
             <div 
              v-for="doc in docStore.documents" 
              :key="doc.id"
              @click="handleDocumentAction(doc)"
              class="group bg-white/3 backdrop-blur-md border border-white/5 p-4 rounded-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all cursor-pointer flex items-center justify-between"
             >
                <div class="flex items-center space-x-4">
                   <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 group-hover:bg-purple-500/20 transition-all">
                      <svg v-if="doc.tipo === 'MD'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2"/></svg>
                      <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-width="2"/></svg>
                   </div>
                   <div>
                      <h4 class="font-bold text-slate-300 group-hover:text-white transition-colors">
                        {{ doc.titulo }}{{ doc.tipo === 'MD' && !doc.titulo.toLowerCase().endsWith('.md') ? '.md' : '' }}
                      </h4>
                      <p class="text-[9px] text-slate-600 font-black uppercase tracking-[0.1em] mt-0.5">
                        {{ doc.tipo === 'MD' ? 'Documento Interno' : 'Recurso Externo' }} • {{ formatDate(doc.ultimaActualizacion) }}
                      </p>
                   </div>
                </div>

                <div class="flex items-center space-x-2">
                   <span class="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black uppercase text-purple-400 tracking-widest mr-4">Abrir</span>
                   <button 
                    @click.stop="handleDeleteDoc(doc.id)"
                    class="p-2 text-slate-700 hover:text-red-400 transition-colors"
                   >
                     <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
                   </button>
                </div>
             </div>

             <!-- Placeholder empty -->
             <div v-if="docStore.documents.length === 0" class="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
                <p class="text-slate-500 font-medium">No hay documentos todavía.</p>
                <p class="text-xs text-slate-600 mt-1 uppercase font-black tracking-widest">Añade guías o recursos del proyecto</p>
             </div>
          </div>
        </section>
      </div>

      <!-- Unified Tasks Section -->
      <section class="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl min-h-[500px] flex flex-col">
          <h3 class="text-xl font-black mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <span>Gestión de Actividades</span>
            
            <!-- Tab Navigation -->
            <div class="flex p-1 bg-white/5 rounded-2xl border border-white/5 self-start md:self-auto">
               <button 
                v-for="tab in ['kanban', 'list', 'gantt']" 
                :key="tab"
                @click="activeTab = tab"
                class="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                :class="activeTab === tab ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-500 hover:text-slate-300'"
               >
                 {{ tab }}
               </button>
            </div>
          </h3>
          
          <div class="flex-1">
            <KanbanBoard 
              v-if="activeTab === 'kanban'" 
              :project-status="projectStore.currentProject.estado" 
            />
            
            <TaskListView 
              v-else-if="activeTab === 'list'"
              :project-status="projectStore.currentProject.estado"
              @toggle-status="toggleTaskStatus"
              @add-subtask="openTaskModal"
              @delete-task="handleDeleteTask"
            />

            <GanttPlaceholder 
              v-else
            />
          </div>
        </section>
    </main>

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

          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Asignar a Colaboradores</label>
            <div class="flex flex-wrap gap-2 mb-4">
               <div 
                v-for="user in usersStore.users" 
                :key="user.id"
                @click="toggleUser(user.id)"
                class="px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center space-x-2"
                :class="newTask.asignados.includes(user.id) 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-white/5 border-white/10 text-slate-500 hover:border-purple-500/50 hover:text-slate-300'"
               >
                 <span>{{ user.nombre }}</span>
                 <svg v-if="newTask.asignados.includes(user.id)" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="4"/></svg>
               </div>
            </div>
            <p class="text-[10px] text-slate-600 font-bold uppercase tracking-widest pl-1">Puedes seleccionar uno o varios usuarios</p>
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
            <div class="flex items-end pb-4">
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
    <!-- Add Document Modal -->
    <div v-if="showAddDocModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md" @click="showAddDocModal = false"></div>
      <div class="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 w-full max-w-lg relative z-10 shadow-2xl animate-pop-in">
        <h3 class="text-3xl font-black mb-1">Agregar Documento</h3>
        <p class="text-slate-400 mb-8 font-medium">Añade guías MD o enlaces externos al proyecto.</p>
        
        <form @submit.prevent="handleAddDocument" class="space-y-6">
          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Título del Documento</label>
            <input v-model="newDoc.titulo" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all" placeholder="Ej: Manual de Instalación">
          </div>

          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Tipo de Recurso</label>
            <div class="grid grid-cols-2 gap-4">
               <button 
                type="button"
                @click="newDoc.tipo = 'MD'"
                class="px-6 py-4 rounded-2xl border text-xs font-bold transition-all"
                :class="newDoc.tipo === 'MD' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 border-white/10 text-slate-500'"
               >
                 Markdown (.md)
               </button>
               <button 
                type="button"
                @click="newDoc.tipo = 'LINK'"
                class="px-6 py-4 rounded-2xl border text-xs font-bold transition-all"
                :class="newDoc.tipo === 'LINK' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-slate-500'"
               >
                 Enlace Externo
               </button>
            </div>
          </div>

          <div v-if="newDoc.tipo === 'LINK'">
             <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">URL del Recurso</label>
             <input v-model="newDoc.url" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all" placeholder="https://google.com/docs/...">
          </div>

          <div class="flex space-x-4 pt-6">
            <button type="button" @click="showAddDocModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" class="flex-1 py-4 bg-purple-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/30">
               Crear Recurso
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '../store/projects'
import { useTaskStore } from '../store/tasks'
import { useUsersStore } from '../store/users'
import { useDocumentationStore } from '../store/documentation'
import { marked } from 'marked'
import KanbanBoard from '../components/KanbanBoard.vue'
import TaskListView from '../components/TaskListView.vue'
import GanttPlaceholder from '../components/GanttPlaceholder.vue'

const route = useRoute()
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const usersStore = useUsersStore()
const docStore = useDocumentationStore()

const showModal = ref(false)
const isSubtask = ref(false)
const parentTaskId = ref(null)
const expandedTasks = ref([])
const activeTab = ref('kanban')
const showAddDocModal = ref(false)
const newDoc = ref({ titulo: '', tipo: 'MD', url: '' })
const newTask = ref({ nombre: '', descripcion: '', prioridad: 'MEDIA', asignados: [] })

const mainTasks = computed(() => taskStore.tasks.filter(t => !t.esSubtarea))
const parentTaskName = computed(() => {
    if (!parentTaskId.value) return ''
    return taskStore.tasks.find(t => t.id === parentTaskId.value)?.nombre
})

onMounted(async () => {
  await projectStore.fetchProjectById(route.params.id)
  await taskStore.fetchTasksByProject(route.params.id)
  await usersStore.fetchUsers()
  await docStore.fetchDocuments(route.params.id)
})

const handleAddDocument = async () => {
    const success = await docStore.createDocument(route.params.id, newDoc.value)
    if (success) {
        showAddDocModal.value = false
        newDoc.value = { titulo: '', tipo: 'MD', url: '' }
    }
}

const handleDocumentAction = (doc) => {
    if (doc.tipo === 'MD') {
        router.push(`/projects/${route.params.id}/documentation/${doc.id}`)
    } else if (doc.url) {
        window.open(doc.url, '_blank')
    }
}

const handleDeleteDoc = async (docId) => {
    if (confirm('¿Estás seguro de eliminar este documento?')) {
        await docStore.deleteDocument(route.params.id, docId)
    }
}

const toggleUser = (userId) => {
    const idx = newTask.value.asignados.indexOf(userId)
    if (idx > -1) newTask.value.asignados.splice(idx, 1)
    else newTask.value.asignados.push(userId)
}

const completionPercentage = computed(() => {
    const mainOnly = taskStore.tasks.filter(t => !t.esSubtarea)
    if (mainOnly.length === 0) return 0
    const completed = mainOnly.filter(t => t.estado === 'Finalizado').length
    return Math.round((completed / mainOnly.length) * 100)
})

const openTaskModal = (pid = null) => {
    isSubtask.value = !!pid
    parentTaskId.value = pid
    newTask.value = { nombre: '', descripcion: '', prioridad: 'MEDIA', asignados: [] }
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
