<template>
  <div>
    <header class="flex justify-between items-center mb-10">
      <div>
        <h2 class="text-3xl font-black">Proyectos</h2>
        <p class="text-slate-400 mt-1">Gestiona y organiza tus flujos de trabajo</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
      >
        + Nuevo Proyecto
      </button>
    </header>

    <div v-if="projectStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>

    <div v-else-if="projectStore.projects.length === 0" class="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
      <p class="text-slate-500 font-medium">No hay proyectos activos todavía.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="project in projectStore.projects" 
        :key="project.id"
        class="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all group relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4">
           <span :class="getStatusClass(project.estado)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border">
            {{ project.estado }}
           </span>
        </div>

        <h3 class="text-xl font-black mb-3 pr-20">{{ project.nombre }}</h3>
        <p class="text-slate-400 text-sm line-clamp-2 mb-6">{{ project.descripcion }}</p>
        
        <div class="flex items-center justify-between mt-auto">
          <div class="flex -space-x-2">
            <div class="w-8 h-8 rounded-full border-2 border-slate-900 bg-purple-500 flex items-center justify-center text-[10px] font-bold">JD</div>
          </div>
          <router-link 
            :to="{ name: 'ProjectDetails', params: { id: project.id } }"
            class="text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center space-x-2"
          >
            <span>Ver detalles</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Create Modal Wrapper (Simplificado) -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" @click="showCreateModal = false"></div>
      <div class="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-2xl">
        <h3 class="text-2xl font-black mb-6">Nuevo Proyecto</h3>
        <form @submit.prevent="handleCreate" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-400 mb-2">Nombre del Proyecto</label>
            <input v-model="newProject.nombre" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-purple-500/50 outline-none">
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-400 mb-2">Descripción</label>
            <textarea v-model="newProject.descripcion" rows="3" class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"></textarea>
          </div>
          <div class="flex space-x-4">
            <button type="button" @click="showCreateModal = false" class="flex-1 py-3 font-bold text-slate-400 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" class="flex-1 py-3 bg-purple-600 rounded-2xl font-bold hover:bg-purple-500 transition-all">Crear Proyecto</button>
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
