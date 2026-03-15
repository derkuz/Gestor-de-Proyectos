<template>
  <div class="space-y-10">
    <header class="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h2 class="text-3xl font-black">Gestión de Categorías</h2>
        <p class="text-slate-400 mt-1">Configura los tipos de ticket y define quién puede responderlos</p>
      </div>
      <button 
        @click="openCreateModal"
        class="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
      >
        + Nueva Categoría
      </button>
    </header>

    <div v-if="categoryStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div 
        v-for="category in categoryStore.categories" 
        :key="category.id"
        class="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group relative overflow-hidden"
      >
        <div class="flex justify-between items-start mb-6">
          <div class="space-y-1">
            <h3 class="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
              {{ category.nombre }} 
              <span v-if="category.prefijo" class="ml-2 text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md border border-emerald-500/20">PRE: {{ category.prefijo }}</span>
            </h3>
            <p class="text-sm text-slate-400 leading-relaxed">{{ category.descripcion || 'Sin descripción' }}</p>
          </div>
          <div class="flex space-x-2 opacity-10 group-hover:opacity-100 transition-opacity">
            <button @click="openEditModal(category)" class="p-2 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600/40 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button @click="handleDelete(category.id)" class="p-2 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/40 transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-white/5">
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Colaboradores Autorizados</h4>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="user in category.usuariosAutorizados" 
              :key="user.id"
              class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300"
            >
              {{ user.nombre }}
            </span>
            <span v-if="!category.usuariosAutorizados?.length" class="text-xs text-slate-600 italic">No hay especialistas asignados</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md" @click="showModal = false"></div>
      <div class="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 w-full max-w-2xl relative z-10 shadow-2xl animate-pop-in">
        <h3 class="text-3xl font-black mb-1">{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
        <p class="text-slate-400 mb-8 font-medium">Define el nombre y qué especialistas pueden resolverla.</p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="md:col-span-3">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nombre de la Categoría</label>
              <input 
                v-model="form.nombre" 
                required 
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all" 
                placeholder="Ej: Facturación, Soporte Técnico N1..."
              >
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Prefijo ID</label>
              <input 
                v-model="form.prefijo" 
                maxlength="5"
                required
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:border-emerald-500 outline-none transition-all text-center font-black uppercase" 
                placeholder="EJ: TEC"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Descripción</label>
            <textarea 
              v-model="form.descripcion" 
              rows="3" 
              class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all custom-scrollbar" 
              placeholder="¿De qué trata esta categoría?..."
            ></textarea>
          </div>

          <div>
             <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Especialistas / Colaboradores Autorizados</label>
             <div class="bg-white/5 border border-white/10 rounded-2xl p-4 max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                <label 
                  v-for="user in selectableUsers" 
                  :key="user.id"
                  class="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                   <input 
                    type="checkbox" 
                    :value="user.id" 
                    v-model="form.usuariosIds"
                    class="w-5 h-5 rounded-lg bg-slate-800 border-white/10 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                   >
                   <div class="ml-4 flex-1">
                      <p class="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{{ user.nombre }}</p>
                      <p class="text-[10px] text-slate-500 uppercase font-black">{{ user.rol }}</p>
                   </div>
                </label>
             </div>
          </div>

          <div class="flex space-x-4 pt-6">
            <button type="button" @click="showModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" class="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/30">
               {{ editingCategory ? 'Guardar Cambios' : 'Crear Categoría' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCategoryStore } from '../store/categories'
import { useUsersStore } from '../store/users'

const categoryStore = useCategoryStore()
const usersStore = useUsersStore()

const showModal = ref(false)
const editingCategory = ref(null)
const form = ref({
  nombre: '',
  descripcion: '',
  prefijo: '',
  usuariosIds: []
})

onMounted(() => {
  categoryStore.fetchCategories()
  usersStore.fetchUsers()
})

const selectableUsers = computed(() => {
    // Solo permitimos elegir especialistas (COLABORADOR o PROJECT_MANAGER o ADMIN)
    return usersStore.users.filter(u => u.rol !== 'EXTERNO')
})

const openCreateModal = () => {
  editingCategory.value = null
  form.value = { nombre: '', descripcion: '', prefijo: '', usuariosIds: [] }
  showModal.value = true
}

const openEditModal = (category) => {
  editingCategory.value = category
  form.value = { 
    nombre: category.nombre, 
    descripcion: category.descripcion, 
    prefijo: category.prefijo || '',
    usuariosIds: category.usuariosAutorizados?.map(u => u.id) || [] 
  }
  showModal.value = true
}

const handleSubmit = async () => {
  // Convertimos IDs a objetos de usuario para el backend (TypeORM relations)
  const usersPayload = form.value.usuariosIds.map(id => ({ id }))
  
  const payload = {
    nombre: form.value.nombre,
    descripcion: form.value.descripcion,
    prefijo: form.value.prefijo.toUpperCase(),
    usuariosAutorizados: usersPayload
  }

  let success
  if (editingCategory.value) {
    success = await categoryStore.updateCategory(editingCategory.value.id, payload)
  } else {
    success = await categoryStore.createCategory(payload)
  }

  if (success) {
    showModal.value = false
  }
}

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta categoría? Esto podría afectar a tickets existentes.')) {
    await categoryStore.deleteCategory(id)
  }
}
</script>

<style scoped>
@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-pop-in { animation: pop-in 0.3s cubic-bezier(0, 0, 0.2, 1); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.4); }
</style>
