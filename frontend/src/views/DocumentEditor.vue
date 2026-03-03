<template>
  <div class="h-screen bg-app-bg text-app-text flex flex-col overflow-hidden transition-colors">
    <!-- Header -->
    <header class="h-16 border-b border-app-border px-8 flex items-center justify-between backdrop-blur-xl bg-app-surface/50 sticky top-0 z-50">
      <div class="flex items-center space-x-6">
        <button @click="goBack" class="p-2 hover:bg-app-bg rounded-xl transition-all text-app-text-muted hover:text-app-text border border-transparent hover:border-app-border">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div>
          <h2 class="text-[10px] font-black uppercase tracking-widest text-app-text-muted mb-0.5">Editando Documento</h2>
          <input 
            v-model="docTitle" 
            class="bg-transparent border-none p-0 text-xl font-black focus:ring-0 w-80 text-app-text placeholder-app-text-muted/30"
            placeholder="Título del documento..."
          >
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <button 
          @click="showMermaidHelper = !showMermaidHelper"
          class="p-2.5 rounded-xl text-app-text-muted hover:text-app-text transition-all border border-app-border bg-app-bg"
          title="Ayuda de Mermaid"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </button>

        <button 
          @click="showPreview = !showPreview" 
          class="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all"
          :class="showPreview ? 'bg-blue-600/10 border-blue-600/20 text-blue-600 dark:text-blue-400' : 'border-app-border text-app-text-muted hover:text-app-text'"
        >
          {{ showPreview ? 'Cerrar Vista Previa' : 'Vista Previa' }}
        </button>
        
        <button 
          @click="handleSave"
          :disabled="saving"
          class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </header>
    
    <!-- Error Toast -->
    <div v-if="docStore.error" class="fixed top-20 right-8 z-[60]">
       <div class="bg-red-500/20 backdrop-blur-xl border border-red-500/30 px-6 py-3 rounded-2xl text-red-400 font-bold shadow-2xl flex items-center space-x-3 group relative">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"/></svg>
          <span class="flex-1">{{ docStore.error }}</span>
          <button @click="docStore.error = null" class="w-6 h-6 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center transition-colors">
             <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
       </div>
    </div>

    <!-- Toolbar -->
    <div class="h-12 border-b border-app-border bg-app-surface px-6 flex items-center space-x-1 overflow-x-auto no-scrollbar shrink-0">
      <template v-for="(btn, idx) in toolbarButtons" :key="idx">
        <div v-if="btn.type === 'separator'" class="w-px h-6 bg-app-border mx-2"></div>
        <button 
          v-else
          @click="insertMarkdown(btn.action)"
          class="p-2 rounded-lg text-app-text-muted hover:text-app-text hover:bg-app-bg transition-all"
          :title="btn.title"
        >
          <component :is="btn.icon" class="w-5 h-5" />
        </button>
      </template>
    </div>

    <!-- Editor Area -->
    <main class="flex-1 flex overflow-hidden relative">
      <!-- Textarea (Left/Full) -->
      <div 
        class="flex-1 h-full p-0 transition-all duration-300 relative group"
        :class="showPreview ? 'w-1/2 border-r border-app-border' : 'w-full'"
      >
        <textarea 
          ref="editorRef"
          v-model="docContent"
          class="w-full h-full bg-app-bg border-none focus:ring-0 text-app-text font-mono text-base resize-none outline-none leading-relaxed p-10 custom-scrollbar"
          placeholder="Escribe aquí en formato Markdown..."
        ></textarea>
        
        <div class="absolute bottom-6 right-8 text-[10px] font-black text-app-text-muted uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Markdown Editor
        </div>
      </div>

      <!-- Preview Area (Right) -->
      <div 
        v-if="showPreview"
        class="w-1/2 h-full p-12 bg-app-bg/30 overflow-y-auto animate-fade-in custom-scrollbar"
      >
        <div class="prose dark:prose-invert prose-blue max-w-none prose-sm md:prose-base" v-html="previewHtml"></div>
      </div>

      <!-- Mermaid Side Panel -->
      <transition name="slide-panel">
        <div v-if="showMermaidHelper" class="absolute right-0 top-0 bottom-0 w-80 bg-app-surface border-l border-app-border shadow-2xl z-40 flex flex-col">
          <div class="p-6 border-b border-app-border flex justify-between items-center bg-app-bg/50">
            <h3 class="text-xs font-black uppercase tracking-widest text-app-text">Ayuda de Mermaid</h3>
            <button @click="showMermaidHelper = false" class="text-app-text-muted hover:text-app-text">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            <!-- Flowchart Section -->
            <section>
              <h4 class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Diagrama de Flujo</h4>
              <p class="text-[11px] text-app-text-muted mb-4 leading-relaxed font-medium">Usa bloques de código con la etiqueta <code class="bg-app-bg px-1 rounded text-app-text">mermaid</code>.</p>
              
              <div class="bg-app-bg rounded-xl border border-app-border p-4 relative group cursor-pointer" @click="insertMarkdown('flowchart')">
                <pre class="text-[10px] font-mono text-app-text-muted leading-tight">
graph TD
    A[Inicio] --> B{¿Procesar?}
    B -- Sí --> C[Tarea]
    B -- No --> D[Fin]
    C --> D</pre>
                <div class="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-xl">
                  <span class="text-[9px] font-black uppercase tracking-widest text-blue-600">Click para insertar</span>
                </div>
              </div>
            </section>

            <!-- Mermaid Intro -->
            <section class="bg-blue-600/5 p-4 rounded-xl border border-blue-500/10">
              <h4 class="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Tipos de Nodos</h4>
              <ul class="text-[11px] text-app-text-muted space-y-2 font-medium">
                <li><code class="text-blue-500">[Rect]</code> - Nodo rectangular</li>
                <li><code class="text-blue-500">(Round)</code> - Nodo redondeado</li>
                <li><code class="text-blue-500">{Diamond}</code> - Nodo de decisión</li>
                <li><code class="text-blue-500">((Circle))</code> - Nodo circular</li>
              </ul>
            </section>
            
            <section class="pt-4">
              <p class="text-[10px] text-app-text-muted font-bold italic">Selecciona un tipo de diagrama para copiar el ejemplo básico al editor.</p>
            </section>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentationStore } from '../store/documentation'
import { marked } from 'marked'
import mermaid from 'mermaid'

const route = useRoute()
const router = useRouter()
const docStore = useDocumentationStore()

const docTitle = ref('')
const docContent = ref('')
const showPreview = ref(true)
const showMermaidHelper = ref(false)
const saving = ref(false)
const editorRef = ref(null)

// Initialize Mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'default',
    securityLevel: 'loose',
    fontFamily: 'Inter'
})

// Custom renderer for marked to handle mermaid blocks
const renderer = new marked.Renderer()
const originalCode = renderer.code.bind(renderer)
renderer.code = (token) => {
    const { text, lang } = token
    if (lang === 'mermaid') {
        return `<div class="mermaid-container my-8 flex justify-center bg-app-surface p-6 rounded-2xl border border-app-border">
                  <pre class="mermaid">${text}</pre>
                </div>`
    }
    return originalCode(token)
}
marked.setOptions({ renderer })

const previewHtml = computed(() => {
    return marked(docContent.value || '*Escribe algo para ver la vista previa...*')
})

// Function to render mermaid diagrams in the preview
const renderDiagrams = async () => {
    if (!showPreview.value) return
    await nextTick()
    try {
        // We target the pre.mermaid inside our container
        const elements = document.querySelectorAll('.mermaid')
        if (elements.length > 0) {
            await mermaid.run({
                nodes: elements
            })
        }
    } catch (e) {
        // Some errors are expected during fast typing
        console.warn('Mermaid rendering notice:', e)
    }
}

// Watch for changes in content or preview toggle to re-render diagrams
watch([previewHtml, showPreview], () => {
    renderDiagrams()
}, { immediate: true })

onMounted(async () => {
    const doc = await docStore.fetchDocument(route.params.id, route.params.docId)
    if (doc) {
        docTitle.value = doc.titulo
        docContent.value = doc.contenido || ''
    } else {
        router.push(`/projects/${route.params.id}`)
    }
})

const insertMarkdown = (action) => {
    const el = editorRef.value
    if (!el) return

    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = docContent.value.substring(start, end)
    let before = docContent.value.substring(0, start)
    let after = docContent.value.substring(end)
    let insertion = ''
    let cursorOffset = 0

    switch (action) {
        case 'bold':
            insertion = `**${selected || 'texto'}**`
            cursorOffset = selected ? insertion.length : 2
            break
        case 'italic':
            insertion = `*${selected || 'texto'}*`
            cursorOffset = selected ? insertion.length : 1
            break
        case 'h1':
            insertion = `# ${selected || 'Título'}`
            cursorOffset = insertion.length
            break
        case 'h2':
            insertion = `## ${selected || 'Subtítulo'}`
            cursorOffset = insertion.length
            break
        case 'link':
            insertion = `[${selected || 'texto'}](https://example.com)`
            cursorOffset = selected ? insertion.length : 1
            break
        case 'code':
            insertion = `\n\`\`\`\n${selected || 'código aquí'}\n\`\`\`\n`
            cursorOffset = insertion.length - 4
            break
        case 'justify':
            insertion = `\n<div align="justify">\n${selected || 'Tu texto justificado aquí.'}\n</div>\n`
            cursorOffset = insertion.length - 7
            break
        case 'list':
            insertion = `\n- ${selected || 'Item'}`
            cursorOffset = insertion.length
            break
        case 'flowchart':
            insertion = `\n\`\`\`mermaid\ngraph TD\n    A[Inicio] --> B{¿Procesar?}\n    B -- Sí --> C[Tarea]\n    B -- No --> D[Fin]\n    C --> D\n\`\`\`\n`
            cursorOffset = insertion.length
            break
    }

    docContent.value = before + insertion + after
    
    nextTick(() => {
        el.focus()
        el.setSelectionRange(start + cursorOffset, start + cursorOffset)
    })
}

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

// Icons
const BoldIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>' }
const ItalicIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M10 20l4-16m-7 0h8m-10 16h8" /></svg>' }
const HeadingIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M7 4v16M17 4v16M7 12h10" /></svg>' }
const LinkIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>' }
const CodeIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>' }
const ListIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>' }
const JustifyIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>' }

const toolbarButtons = [
    { title: 'Negrita', action: 'bold', icon: BoldIcon },
    { title: 'Itálica', action: 'italic', icon: ItalicIcon },
    { type: 'separator' },
    { title: 'Título 1', action: 'h1', icon: HeadingIcon },
    { title: 'Título 2', action: 'h2', icon: HeadingIcon },
    { type: 'separator' },
    { title: 'Enlace', action: 'link', icon: LinkIcon },
    { title: 'Bloque de Código', action: 'code', icon: CodeIcon },
    { title: 'Lista', action: 'list', icon: ListIcon },
    { title: 'Justificar (HTML)', action: 'justify', icon: JustifyIcon },
]
</script>

<style scoped>
.prose :deep(pre) {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.prose :deep(code) {
    color: #6366f1;
    background: rgba(99, 102, 241, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 0.4rem;
}

.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.3s cubic-bezier(0, 0, 0.2, 1);
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.prose :deep(.mermaid) {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    color: inherit;
    font-family: inherit;
}

.prose :deep(.mermaid svg) {
    max-width: 100%;
    height: auto;
}
</style>

