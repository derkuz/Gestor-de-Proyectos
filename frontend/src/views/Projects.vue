<template>
  <div>
    <header class="flex justify-between items-center mb-10">
      <div>
        <h2 class="text-3xl font-black text-app-text">Proyectos</h2>
        <p class="text-app-text-muted mt-1 font-medium">Gestiona y organiza tus flujos de trabajo</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
      >
        + Nuevo Proyecto
      </button>
    </header>
    
    <!-- Error Toast -->
    <div v-if="projectStore.error" class="fixed top-24 right-8 z-[60]">
       <div class="bg-red-500/20 backdrop-blur-xl border border-red-500/30 px-6 py-3 rounded-2xl text-red-400 font-bold shadow-2xl flex items-center space-x-3 group relative">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"/></svg>
          <span class="flex-1">{{ projectStore.error }}</span>
          <button @click="projectStore.error = null" class="w-6 h-6 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center transition-colors">
             <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
       </div>
    </div>

    <div v-if="projectStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>

    <div v-else-if="projectStore.projects.length === 0" class="text-center py-20 bg-app-surface rounded-3xl border border-dashed border-app-border">
      <p class="text-app-text-muted font-black uppercase tracking-widest text-xs">No hay proyectos activos todavía.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="project in projectStore.projects" 
        :key="project.id"
        class="bg-app-surface border border-app-border p-8 rounded-3xl hover:shadow-xl transition-all group relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4">
           <span :class="getStatusClass(project.estado)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border">
            {{ project.estado }}
           </span>
        </div>

        <h3 class="text-xl font-black mb-3 pr-20 text-app-text">{{ project.nombre }}</h3>
        <p class="text-app-text-muted text-sm line-clamp-2 mb-6 font-medium">{{ project.description || project.descripcion }}</p>
        
        <div class="flex items-center justify-between mt-auto">
          <div class="flex -space-x-2">
            <div class="w-8 h-8 rounded-full border-2 border-app-surface bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm">JD</div>
          </div>
          <router-link 
            :to="{ name: 'ProjectDetails', params: { id: project.id } }"
            class="text-sm font-black uppercase tracking-widest text-app-text-muted hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center space-x-2"
          >
            <span>Detalles</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Create Modal Wrapper -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-app-bg/80 backdrop-blur-md" @click="showCreateModal = false"></div>
      <div class="bg-app-surface border border-app-border rounded-3xl p-10 w-full max-w-lg relative z-10 shadow-2xl animate-pop-in">
        <h3 class="text-2xl font-black mb-6 text-app-text">Nuevo Proyecto</h3>
        <form @submit.prevent="handleCreate" class="space-y-6">
          <div>
            <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2">Nombre del Proyecto</label>
            <input v-model="newProject.nombre" required class="w-full bg-app-bg border border-app-border rounded-2xl px-5 py-4 text-app-text focus:border-purple-500 outline-none transition-all">
          </div>
          <div>
            <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2">Descripción</label>
            <textarea v-model="newProject.descripcion" rows="3" class="w-full bg-app-bg border border-app-border rounded-2xl px-5 py-4 text-app-text focus:border-purple-500 outline-none transition-all"></textarea>
          </div>
          <div class="flex space-x-4 pt-4">
            <button type="button" @click="showCreateModal = false" class="flex-1 py-4 font-black uppercase tracking-widest text-xs text-app-text-muted hover:text-app-text transition-colors">Cancelar</button>
            <button type="submit" class="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20">Crear Proyecto</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useProjectStore } from '../store/projects'

const projectStore = useProjectStore()
const showCreateModal = ref(false)
const newProject = ref({ nombre: '', descripcion: '' })

onMounted(() => {
  projectStore.fetchProjects()
})

const handleCreate = async () => {
  const success = await projectStore.createProject(newProject.value)
  if (success) {
    showCreateModal.value = false
    newProject.value = { nombre: '', descripcion: '' }
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'ACTIVO': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'PAUSADO': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'FINALIZADO': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
}
</script>
