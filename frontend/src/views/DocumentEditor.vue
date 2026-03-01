<template>
  <div class="min-h-screen bg-slate-950 text-white flex flex-col">
    <!-- Header -->
    <header class="h-16 border-b border-white/10 px-8 flex items-center justify-between backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50">
      <div class="flex items-center space-x-6">
        <button @click="goBack" class="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div>
          <h2 class="text-sm font-black uppercase tracking-widest text-slate-500 mb-0.5">Editando Documento</h2>
          <input 
            v-model="docTitle" 
            class="bg-transparent border-none p-0 text-xl font-black focus:ring-0 w-64 text-white"
            placeholder="Título del documento..."
          >
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <button 
          @click="showPreview = !showPreview" 
          class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all"
          :class="showPreview ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-slate-500 hover:text-slate-300'"
        >
          {{ showPreview ? 'Cerrar Vista Previa' : 'Vista Previa' }}
        </button>
        
        <button 
          @click="handleSave"
          :disabled="saving"
          class="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </header>

    <!-- Editor Area -->
    <main class="flex-1 flex overflow-hidden">
      <!-- Textarea (Left/Full) -->
      <div 
        class="flex-1 h-full p-8 transition-all duration-300"
        :class="showPreview ? 'w-1/2 border-r border-white/5' : 'w-full'"
      >
        <textarea 
          v-model="docContent"
          class="w-full h-full bg-transparent border-none focus:ring-0 text-slate-300 font-mono text-base resize-none outline-none leading-relaxed"
          placeholder="Escribe aquí en formato Markdown..."
        ></textarea>
      </div>

      <!-- Preview Area (Right) -->
      <div 
        v-if="showPreview"
        class="w-1/2 h-full p-12 bg-black/20 overflow-y-auto animate-fade-in"
      >
        <div class="prose prose-invert prose-lg max-w-none" v-html="previewHtml"></div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentationStore } from '../store/documentation'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()
const docStore = useDocumentationStore()

const docTitle = ref('')
const docContent = ref('')
const showPreview = ref(true)
const saving = ref(false)

const previewHtml = computed(() => {
    return marked(docContent.value || '*Escribe algo para ver la vista previa...*')
})

onMounted(async () => {
    const doc = await docStore.fetchDocument(route.params.id, route.params.docId)
    if (doc) {
        docTitle.value = doc.titulo
        docContent.value = doc.contenido || ''
    } else {
        router.push(`/projects/${route.params.id}`)
    }
})

const handleSave = async () => {
    saving.value = true
    const success = await docStore.updateDocument(route.params.id, route.params.docId, {
        titulo: docTitle.value,
        contenido: docContent.value
    })
    saving.value = false
    if (success) {
        // Optional: show toast
    }
}

const goBack = () => {
    router.push(`/projects/${route.params.id}`)
}
</script>

<style scoped>
.prose :deep(pre) {
    background: rgba(0, 0, 0, 0.3);
    border: 1px border rgba(255, 255, 255, 0.05);
}
</style>
