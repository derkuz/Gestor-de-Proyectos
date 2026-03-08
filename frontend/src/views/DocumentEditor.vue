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
    <div class="h-12 border-b border-app-border bg-app-surface px-6 flex items-center space-x-1 overflow-visible shrink-0 relative z-[60]">
      <template v-for="(btn, idx) in toolbarButtons" :key="idx">
        <div v-if="btn.type === 'separator'" class="w-px h-6 bg-app-border mx-2"></div>
        
        <!-- Template Select -->
        <div v-else-if="btn.type === 'template-select'" class="relative">
           <button 
             @click="showTemplates = !showTemplates"
             class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all flex items-center space-x-2"
           >
              <span>Plantillas</span>
              <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': showTemplates }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
           </button>
           
           <div v-if="showTemplates" class="absolute left-0 mt-2 w-64 bg-app-surface border border-app-border rounded-2xl shadow-2xl z-[100] p-2 space-y-1 animate-pop-in">
              <div class="absolute inset-0 bg-app-surface/50 backdrop-blur-xl rounded-2xl -z-10"></div>
              <button 
                v-for="tmp in templates" 
                :key="tmp.id"
                @click="handleApplyTemplate(tmp)"
                class="w-full text-left px-4 py-3 rounded-xl hover:bg-app-bg transition-all flex flex-col group/item"
              >
                 <span class="text-xs font-black text-app-text group-hover/item:text-blue-400 transition-colors">{{ tmp.name }}</span>
                 <span class="text-[10px] text-app-text-muted mt-0.5">{{ tmp.desc }}</span>
              </button>
           </div>
        </div>

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
const showTemplates = ref(false)
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
        case 'checklist':
            insertion = `\n- [ ] ${selected || 'Tarea pendiente'}`
            cursorOffset = insertion.length
            break
        case 'table':
            insertion = `\n| Cabecera 1 | Cabecera 2 |\n| :--- | :--- |\n| Celda 1 | Celda 2 |\n`
            cursorOffset = insertion.length
            break
        case 'image':
            insertion = `![Descripción de la imagen](https://url-de-la-imagen.com)`
            cursorOffset = 2
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

const applyTemplate = (template) => {
    if (docContent.value && !confirm('¿Deseas reemplazar el contenido actual con la plantilla?')) return
    docContent.value = template.content
    if (!docTitle.value) docTitle.value = template.name
}

const handleApplyTemplate = (template) => {
    applyTemplate(template)
    showTemplates.value = false
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
const ChecklistIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-6 9l2 2 4-4" /></svg>' }
const TableIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>' }
const ImageIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>' }
const JustifyIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>' }

const toolbarButtons = [
    { type: 'template-select' },
    { type: 'separator' },
    { title: 'Negrita', action: 'bold', icon: BoldIcon },
    { title: 'Itálica', action: 'italic', icon: ItalicIcon },
    { type: 'separator' },
    { title: 'Título 1', action: 'h1', icon: HeadingIcon },
    { title: 'Título 2', action: 'h2', icon: HeadingIcon },
    { type: 'separator' },
    { title: 'Enlace', action: 'link', icon: LinkIcon },
    { title: 'Imagen', action: 'image', icon: ImageIcon },
    { title: 'Tabla', action: 'table', icon: TableIcon },
    { title: 'Bloque de Código', action: 'code', icon: CodeIcon },
    { title: 'Lista', action: 'list', icon: ListIcon },
    { title: 'Lista de Tareas', action: 'checklist', icon: ChecklistIcon },
    { title: 'Justificar (HTML)', action: 'justify', icon: JustifyIcon },
]

const templates = [
    {
        id: 'relevamiento-corporativo',
        name: 'Relevamiento Corporativo (Formal OR/UI)',
        desc: 'Estructura oficial para proyectos corporativos y gubernamentales.',
        content: `# 🏢 Relevamiento de Requerimientos (Estructura OR/UI)

## 1. Introducción (Obligatorio para el OR)
### 1.1 Objetivo
### 1.2 Destinatarios
### 1.3 Alcance
### 1.4 Beneficios y Restricciones
### 1.5 Criticidad

## 2. Documentos de Soporte (Obligatorio para el OR)
*Referencia a leyes, normativas, manuales o documentación previa.*

## 3. Circuitos Administrativos (Obligatorio para el OR)
*Mapeo de los procesos actuales y los cambios propuestos.*

## 4. Requerimientos Funcionales (a completar por la UI)
### 4.1 Lista de Requerimientos
| ID | Descripción | Prioridad |
| :--- | :--- | :--- |
| RF-01 | El sistema debe permitir... | ALTA |

### 4.2 Impacto Presupuestario, Contable y Financiero (a completar por la UI)
### 4.3 Validaciones y Controles (a completar por la UI)
### 4.4 Prototipos de Salidas de Información y/o Pantallas (a completar por la UI)

## 5. Requerimientos de Especificación (a completar por la UI)
*Detalles sobre arquitectura, base de datos y lenguajes.*

## 6. Perfiles de Usuarios (a completar por la UI)
*Definición de roles y permisos en el sistema.*

## 7. Referentes de Consulta (Obligatorio para el OR y UI)
*Expertos en el negocio y/o técnicos para resolver dudas.*

## 8. Firmas Necesarias (Obligatorio para el OR)
| Área | Nombre | Firma | Fecha |
| :--- | :--- | :--- | :--- |
| Responsable OR | | | |
| Responsable UI | | | |

## 9. Control de Cambios del Documento (a completar por la UI y OR)
| Versión | Fecha | Autor | Descripción |
| :--- | :--- | :--- | :--- |
| 1.0 | ${new Date().toLocaleDateString()} | Admin | Versión Inicial |

## 10. Glosario (a completar por la UI y OR)
- **OR:** Organismo Requirente
- **UI:** Unidad de Implementación`
    },
    {
        id: 'entrevista-inicial',
        name: 'Guía de Entrevista (Principiantes)',
        desc: 'Preguntas clave para el primer contacto con el cliente.',
        content: `# 🎤 Guía de Primer Relevamiento (Entrevista Inicial)
## 1. El "Dolor" (El Problema)
> *Pregunta clave: "¿Qué es lo que hoy te quita más tiempo o te genera más errores?" o "¿Por qué decidiste buscarnos ahora?"*
- **Respuesta del cliente:** [Escribe aquí el motivo principal]

## 2. El Proceso Actual (¿Cómo lo hacen hoy?)
> *Dile al cliente: "Cuéntame el paso a paso de cómo se hace esto hoy (aunque sea en Excel o papel)".*
1. **Inicio:** [Ej: Reciben un mail con el pedido]
2. **Proceso:** [Ej: Cargan los datos en un Excel]
3. **Fin:** [Ej: Envían una factura manual]

## 3. Los Protagonistas (Roles)
> *Pregunta clave: "¿Quiénes van a usar el sistema y qué se imagina cada uno haciendo?"*
- **Usuario Tipo A (Ej: Vendedor):** [Ej: Quiere cargar pedidos rápido desde el móvil]
- **Usuario Tipo B (Ej: Dueño):** [Ej: Quiere ver un gráfico con las ventas del mes]

## 4. El "Mínimo Viable" (Lo indispensable)
> *Pregunta clave: "Si tuviéramos que lanzar una versión pequeñita en 15 días, ¿qué es lo único que NO puede faltar?"*
- [ ] **Función 1:** [Lo más importante]
- [ ] **Función 2:** [Lo segundo más importante]

## 5. Restricciones y Miedos
> *Pregunta clave: "¿Hay algo que te preocupe? ¿Alguna tecnología que prefieras usar o evitar? ¿Tienen una fecha límite inamovible?"*
- **Miedos/Riesgos:** [Ej: "Me preocupa que los empleados no lo quieran usar"]
- **Plazos:** [Ej: "Tenemos que estar listos para la temporada de verano"]`
    },
    {
        id: 'requerimientos',
        name: 'Relevamiento de Requerimientos',
        desc: 'Estructura para captura inicial de necesidades.',
        content: `# 📋 Relevamiento de Requerimientos (Norma IEEE 830 - SRS)
## 1. Información del Cliente
- **Stakeholders:** [Nombres y cargos de los interesados]
- **Analista Responsable:** [Tu Nombre]

## 2. Objetivo General
> *Define en un párrafo el propósito principal de este sistema o módulo. ¿Qué problema resuelve?*

## 3. Requerimientos Funcionales (Estándar IEEE 830)
| ID | Descripción | Prioridad | Observaciones |
| :--- | :--- | :--- | :--- |
| RF-01 | El sistema debe permitir... | ALTA | *Esencial para el MVP* |

## 4. Requerimientos No Funcionales (Atributos de Calidad - ISO/IEC 25010)
- **Rendimiento:** *Ej: Carga de reportes en < 2 segundos.*
- **Seguridad:** *Ej: Autenticación mediante JWT y roles.*

## 5. Casos de Uso (Notación UML 2.5)
\`\`\`mermaid
graph LR
    U[Usuario] --> UC1((Ver Tareas))
    U --> UC2((Crear Ticket))
    A[Admin] --> UC3((Gestionar Roles))
\`\`\` 

## 6. Fuera de Alcance (Exclusiones)
> *Es vital definir qué NO hará el sistema para evitar falsas expectativas.*
- **Ejemplo:** El sistema no procesará pagos con tarjeta de crédito en esta fase.
- **Ejemplo:** No se incluye la carga de inventario histórico.`
    },
    {
        id: 'user-manual',
        name: 'Manual de Usuario (Profesional)',
        desc: 'Guía completa de uso para el cliente y usuarios finales.',
        content: `# 📖 Manual de Usuario
> *Este documento guiará a los usuarios en el uso diario del sistema [Nombre].*

## 1. Introducción y Acceso
### 1.1 ¿Qué es [Nombre]?
*Breve explicación del propósito del sistema.*
### 1.2 Requisitos del Sistema
- **Navegador:** Chrome, Firefox o Edge actualizado.
- **Dispositivo:** PC, Tablet o Smartphone.
### 1.3 Inicio de Sesión
1. Ingrese a: \`https://url-del-sistema.com\`
2. Ingrese sus credenciales enviadas por el administrador.
3. Si olvidó su contraseña, use la opción **"Recuperar Contraseña"**.

## 2. Roles y Permisos
*Identifica qué puedes hacer según tu perfil:*
- **Administrador:** Gestión total, reportes y configuración.
- **Operador:** Carga de datos y atención de solicitudes.
- **Consulta:** Solo visualización de reportes.

## 3. Guía de Uso por Módulos
### 3.1 Módulo A: [Nombre]
1. Diríjase a la sección **[Nombre]** en el menú lateral.
2. Haga clic en el botón **"Nuevo"**.
3. Complete los campos obligatorios marcados con asterisco (*).
4. Presione **"Guardar"**.

## 4. Preguntas Frecuentes (FAQ)
- **¿Cómo cambio mi foto de perfil?**
  *Vaya a Mi Perfil -> Editar -> Subir Imagen.*
- **¿Los reportes se pueden descargar?**
  *Sí, en formato PDF y Excel desde la sección de Reportes.*

## 5. Solución de Problemas (Troubleshooting)
| Problema | Soluciones Sugeridas |
| :--- | :--- |
| El sistema no carga | Verifique su conexión y limpie el caché del navegador. |
| Error al guardar | Verifique que todos los campos requeridos tengan datos válidos. |

## 6. Soporte y Contacto
*Si el problema persiste, contacte a soporte:*
- **Email:** soporte@empresa.com
- **Horario:** Lunes a Viernes de 09:00 a 18:00.`
    },
    {
        id: 'data-dictionary',
        name: 'Diccionario de Datos',
        desc: 'Documentación técnica de la Base de Datos.',
        content: `# 🗄️ Diccionario de Datos (Norma ISO/IEC 11179)
## Entidad: [Nombre de la Tabla] (Modelo Entidad-Relación - Notación de Chen/Crow's Foot)
*Descripción: Almacena la información de...*

| Campo | Tipo | Nulo | Descripción | Ejemplo |
| :--- | :--- | :---: | :--- | :--- |
| **id** | UUID | No | Clave primaria autogenerada | \`550e8400...\` |

## Relaciones (Diagrama ER Notación UML/Relacional)
\`\`\`mermaid
erDiagram
    USUARIO ||--o{ TICKET : crea
    PROYECTO ||--|{ TAREA : tiene
\`\`\` `
    },
    {
        id: 'minuta',
        name: 'Minuta de Reunión (Profesional)',
        desc: 'Para documentar acuerdos, decisiones y tareas pendientes.',
        content: `# 📅 Minuta de Reunión
## 1. Información de la Sesión
- **Fecha:** ${new Date().toLocaleDateString()}
- **Hora Inicio/Fin:** [09:00 - 10:30]
- **Lugar/Medio:** [Presencial / Google Meet / Teams]
- **Asistentes:**
  - [Nombre del Asistente 1] - [Rol]
  - [Nombre del Asistente 2] - [Rol]

## 2. Orden del Día (Agenda)
*Temas previstos para tratar en la reunión:*
1. [Tema 1]
2. [Tema 2]

## 3. Resumen de la Discusión
*Breve descripción de los puntos clave conversados y debates:*
- [Punto clave 1]
- [Punto clave 2]

## 4. Acuerdos y Decisiones
> *Registra formalmente lo que se decidió para evitar malentendidos futuros.*
- **Decisión 1:** [Descripción clara de la decisión tomada]
- **Decisión 2:** [Descripción clara de la decisión tomada]

## 5. Compromisos y Tareas Pendientes (Action Items)
| Tarea / Acción | Responsable | Fecha Límite | Estado |
| :--- | :--- | :---: | :---: |
| [Ej: Enviar presupuesto] | [Nombre] | [DD/MM] | ⏳ |
| [Ej: Validar requerimientos] | [Nombre] | [DD/MM] | ⏳ |

## 6. Próxima Reunión (Opcional)
- **Fecha tentativa:** [DD/MM/AAAA]
- **Objetivo:** [Seguimiento de tareas / Nueva fase]`
    },
    {
        id: 'tech-spec',
        name: 'Especificación Técnica (Backend/Arquitectura)',
        desc: 'Para documentar lógica interna, base de datos y APIs.',
        content: `# 🛠️ Especificación Técnica del Sistema
> *Guía para desarrolladores sobre la arquitectura y lógica interna del proyecto.*

## 1. Stack Tecnológico
- **Frontend:** [Ej: Vue 3 + TailwindCSS]
- **Backend:** [Ej: NestJS + TypeORM]
- **Base de Datos:** [Ej: PostgreSQL]
- **Infraestructura:** [Ej: Docker + AWS]

## 2. Modelo de Datos (Esquema)
*Descripción de las entidades principales:*
\`\`\`mermaid
erDiagram
    ENTIDAD_A ||--o{ ENTIDAD_B : "relación"
\`\`\`

## 3. Arquitectura y Lógica de Negocio
### 3.1 Flujo Principal
\`\`\`mermaid
sequenceDiagram
    Cliente->>Servidor: Petición (Request)
    Servidor->>Base de Datos: Consulta
    Base de Datos-->>Servidor: Resultado
    Servidor-->>Cliente: Respuesta (JSON)
\`\`\`
### 3.2 Reglas de Negocio Críticas
- **Regla 1:** [Descripción técnica de la validación o cálculo]

## 4. Documentación de API (Endpoints)
| Método | Ruta | Descripción | Autenticación |
| :--- | :--- | :--- | :---: |
| GET | \`/api/recursos\` | Lista todos los elementos | JWT |
| POST | \`/api/recursos\` | Crea un nuevo elemento | Admin |

## 5. Otros Detalles
- **Seguridad:** [JWT, Hashing de claves, CORS]
- **Observabilidad:** [Sistema de Logs, Métricas]`
    },
    {
        id: 'test-plan',
        name: 'Plan de Pruebas (QA)',
        desc: 'Para asegurar la calidad del software.',
        content: `# 🧪 Plan de Pruebas (Norma IEEE 829 - Standard for Software Test Documentation)
## 1. Alcance de las Pruebas
*¿Qué funcionalidades se van a probar en este ciclo?*

## 2. Casos de Prueba (Estándar IEEE 829)
| ID | Descripción | Entrada | Esperado | Estado |
| :--- | :--- | :--- | :--- | :---: |
| CP-01 | Login exitoso | Credenciales válidas | Redirección al Home | 🟢 |
...`
    },
    {
        id: 'user-stories',
        name: 'Historias de Usuario (Explicado)',
        desc: 'Para definir qué hace el sistema de forma sencilla.',
        content: `# 📋 Historias de Usuario (Agile)
> *Usa este formato para explicar cada función del sistema como si fuera un cuento corto.*

## HU-01: [Nombre de la función]
- **COMO...** (quién lo usa) -> *Ej: Como Vendedor*
- **QUIERO...** (qué hace) -> *Ej: Quiero registrar un pago en efectivo*
- **PARA...** (por qué lo hace) -> *Ej: Para que el sistema descuente el saldo del cliente automáticamente*

### ✅ Criterios de Aceptación (¿Cuándo está terminada?)
- [ ] El sistema me deja elegir el monto.
- [ ] El sistema me pide confirmación antes de guardar.
- [ ] El saldo del cliente se actualiza en tiempo real.`
    },
    {
        id: 'risk-analysis',
        name: 'Análisis de Riesgos (Guía)',
        desc: 'Para identificar y prevenir problemas antes de que ocurran.',
        content: `# ⚠️ Análisis de Riesgos y Plan de Contingencia
> *Usa esta tabla para anticiparte a lo que puede salir mal. "Impacto" y "Probabilidad" se miden de 1 a 5.*

## 1. Matriz de Riesgos Operativos
| Riesgo Identificado | Impacto | Prob. | Nivel | Plan de Mitigación (Prevención) |
| :--- | :---: | :---: | :---: | :--- |
| **Retraso en aprobación:** El cliente no valida a tiempo. | 4 | 3 | 12 | Establecer fechas de validación por contrato. |
| **Problemas técnicos:** Error inesperado en integración. | 5 | 2 | 10 | Tener un entorno de pruebas idéntico al real. |
| **Baja de personal:** Un programador clave se enferma. | 3 | 2 | 6 | Documentar el código y usar Git diariamente. |

## 2. Categorías de Riesgo sugeridas para analizar:
- **Técnicos:** Bugs, servidores, pérdida de datos.
- **Humanos:** Falta de capacitación, mala comunicación, renuncias.
- **Externos:** Cambios legales, inflación, falta de internet.
- **Cronograma:** Tareas que dependen de terceros.

## 3. Plan de Contingencia (¿Qué hacemos si el riesgo ocurre?)
*Si el riesgo "X" sucede, el responsable "Y" activará la acción "Z":*
1. **Riesgo:** [Nombre del riesgo]
2. **Acción inmediata:** [Pasos a seguir para minimizar el daño]
3. **Comunicación:** [A quién se le avisa inmediatamente]`
    },
    {
        id: 'release-notes',
        name: 'Notas de Lanzamiento',
        desc: 'Documentación para despliegues (Releases).',
        content: `# 🚀 Notas de Lanzamiento (Estándar Semantic Versioning - SemVer 2.0.0)
*Basado en el estándar "Keep a Changelog"*
## 🆕 Novedades (What's New)
- **[Módulo A]:** Implementación de...
...`
    },
    {
        id: 'deployment-checklist',
        name: 'Checklist de Despliegue',
        desc: 'Pasos críticos para pasar a producción.',
        content: `# 🚀 Checklist de Despliegue (Norma ISO/IEC 27001 / DevOps Best Practices)
## 1. Pre-Despliegue (Entorno)
- [ ] **Backup:** Backup de BD realizado y verificado.
- [ ] **Env Vars:** Todas las variables de entorno configuradas en el servidor.
- [ ] **Secrets:** Claves API y JWT actualizadas a valores de producción.

## 2. Despliegue (Ejecución)
- [ ] **Build:** Build de Frontend y Backend generado sin errores.
- [ ] **Docker:** Imágenes actualizadas y contenedores reiniciados.
- [ ] **Migrations:** Migraciones de base de datos ejecutadas con éxito.

## 3. Post-Despliegue (Verificación)
- [ ] **Smoke Test:** Las rutas principales (Login, CRUD central) funcionan.
- [ ] **Logs:** No hay errores críticos ("FATAL" / "ERROR") en la consola.
- [ ] **SSL:** Certificados HTTPS renovados y activos.

---
*Aprobado por:* [Nombre/Rol]*`
    },
    {
        id: 'requirements-checklist',
        name: 'Checklist Relevamiento',
        desc: 'Para asegurar que no falte nada al capturar requisitos.',
        content: `# 📋 Checklist de Relevamiento (Basado en BABOK Guide / IIBA)
## 1. Preparación y Contexto
- [ ] **Stakeholders:** Se han identificado todos los interesados clave.
- [ ] **Objetivo:** El "dolor" o problema principal está claramente definido.
- [ ] **Alcance:** Se definió qué NO hará el sistema (Límites).

## 2. Captura de Requerimientos
- [ ] **Procesos:** Se mapeó el proceso actual ("As-Is").
- [ ] **Funcionales:** Se listaron las acciones que el usuario debe realizar.
- [ ] **Seguridad:** Se definieron niveles de acceso y roles.

## 3. Validación y Cierre
- [ ] **Prioridades:** El cliente validó qué es "Básico", "Deseable" y "Futuro".
- [ ] **Conflictos:** No hay requerimientos que se contradigan entre sí.
- [ ] **Firma:** El documento de relevamiento fue validado por el responsable.*`
    }
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

