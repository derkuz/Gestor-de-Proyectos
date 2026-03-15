<template>
  <div>
    <header class="flex justify-between items-center mb-10 border-b-2 border-app-border pb-6">
      <div>
        <h2 class="text-3xl font-black text-app-text tracking-widest uppercase">_ PROYECTOS</h2>
        <p class="text-app-text-secondary mt-1 font-medium uppercase tracking-widest text-xs">> ADMINISTRACIÓN_DE_SISTEMAS</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="px-8 py-3 border-2 border-app-border bg-app-secondary text-app-text font-bold hover:bg-app-text hover:text-app-secondary transition-all uppercase tracking-widest"
      >
        [+] NUEVO_PROYECTO
      </button>
    </header>
    
    <!-- Error Toast -->
    <div v-if="projectStore.error" class="fixed top-24 right-8 z-[60]">
       <div class="bg-app-secondary border-2 border-red-500 px-6 py-3 text-red-500 font-bold flex items-center space-x-3 uppercase tracking-widest">
          <span>[!] ERROR: {{ projectStore.error }}</span>
          <button @click="projectStore.error = null" class="border-2 border-red-500 px-2 py-0.5 hover:bg-red-500 hover:text-white transition-colors">
             X
          </button>
       </div>
    </div>

    <div v-if="projectStore.loading" class="flex justify-center py-20">
      <div class="text-app-text font-black text-xl animate-pulse uppercase tracking-[0.5em]">CARGANDO...</div>
    </div>

    <div v-else-if="projectStore.projects.length === 0" class="text-center py-20 bg-app-secondary border-2 border-dashed border-app-border">
      <p class="text-app-text-secondary font-black uppercase tracking-widest text-xs">[!] NO SE ENCONTRARON PROYECTOS ACTIVOS</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="project in projectStore.projects" 
        :key="project.id"
        class="pixel-card group relative overflow-hidden transition-all hover:bg-app-text/5"
      >
        <div class="absolute top-0 right-0 p-4">
           <span :class="getStatusClass(project.estado)" class="px-3 py-1 border-2 text-[10px] font-black uppercase tracking-widest">
            {{ project.estado }}
           </span>
        </div>

        <h3 class="text-xl font-black mb-3 pr-20 text-app-text uppercase tracking-wider">{{ project.nombre }}</h3>
        <p class="text-app-text-secondary text-sm line-clamp-2 mb-6 font-medium uppercase tracking-widest text-[11px] leading-relaxed">{{ project.description || project.descripcion }}</p>
        
        <div class="flex items-center justify-between mt-auto">
          <div class="flex border-2 border-app-border px-2 py-1 bg-app-secondary">
            <span class="text-[10px] font-black text-app-text uppercase">OP: JD</span>
          </div>
          <router-link 
            :to="{ name: 'ProjectDetails', params: { id: project.id } }"
            class="text-sm font-black uppercase tracking-widest text-app-text hover:bg-app-text hover:text-app-bg px-3 py-1 border-2 border-app-border transition-colors flex items-center space-x-2"
          >
            <span>_ VER_MÁS</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Create Modal Wrapper -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-app-bg/90" @click="showCreateModal = false"></div>
      <div class="bg-app-secondary border-4 border-app-border p-8 w-full max-w-lg relative z-10 shadow-[8px_8px_0px_0px_rgba(0,255,65,0.2)]">
        <h3 class="text-2xl font-black mb-6 text-app-text uppercase tracking-widest">> CREAR_NUEVO_REGISTRO</h3>
        <form @submit.prevent="handleCreate" class="space-y-6">
          <div>
            <label class="block text-xs font-black text-app-text uppercase tracking-widest mb-2">NOMBRE_DEL_PROYECTO:</label>
            <input v-model="newProject.nombre" required class="w-full bg-app-secondary border-2 border-app-border px-4 py-3 text-app-text focus:bg-app-text focus:text-app-secondary outline-none transition-all uppercase tracking-widest">
          </div>
          <div>
            <label class="block text-xs font-black text-app-text uppercase tracking-widest mb-2">DESCRIPCIÓN_TÉCNICA:</label>
            <textarea v-model="newProject.descripcion" rows="3" class="w-full bg-app-secondary border-2 border-app-border px-4 py-3 text-app-text focus:bg-app-text focus:text-app-secondary outline-none transition-all uppercase tracking-widest"></textarea>
          </div>
          <div class="flex space-x-4 pt-4">
            <button type="button" @click="showCreateModal = false" class="flex-1 py-3 border-2 border-app-border font-black uppercase tracking-widest text-xs text-app-text hover:bg-app-text hover:text-app-secondary transition-colors">[ CANCELAR ]</button>
            <button type="submit" class="flex-1 py-3 bg-app-text text-app-secondary border-2 border-app-text font-black uppercase tracking-widest text-xs hover:bg-app-secondary hover:text-app-text transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"> [ DISPARAR_CREACIÓN ]</button>
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
    case 'ACTIVO': return 'bg-app-secondary text-green-500 border-green-500';
    case 'PAUSADO': return 'bg-app-secondary text-yellow-500 border-yellow-500';
    case 'FINALIZADO': return 'bg-app-secondary text-blue-500 border-blue-500';
    default: return 'bg-app-secondary text-app-text-secondary border-app-border';
  }
}
</script>
