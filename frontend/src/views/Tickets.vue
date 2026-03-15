<template>
  <div>
    <header class="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4">
      <div>
        <h2 class="text-3xl font-black text-app-text tracking-widest uppercase">_ SOPORTE_TÉCNICO</h2>
        <p class="text-app-text-secondary mt-1 font-medium uppercase tracking-widest text-xs">> GESTIÓN_DE_INCIDENCIAS</p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          v-if="authStore.isAdmin"
          @click="$router.push('/tickets/categories')"
          class="px-6 py-3 border-2 border-app-border bg-app-secondary text-app-text font-bold hover:bg-app-text hover:text-app-secondary transition-all uppercase tracking-widest text-xs"
        >
          [ CONFIG_CATEGORÍAS ]
        </button>
        <button 
          @click="showCreateModal = true"
          class="px-8 py-3 border-2 border-app-border bg-app-secondary text-app-text font-bold hover:bg-app-text hover:text-app-secondary transition-all uppercase tracking-widest text-xs"
        >
          [+] ABRIR_TICKET
        </button>
      </div>
    </header>
    
    <!-- Error Toast -->
    <div v-if="ticketStore.error" class="fixed top-24 right-8 z-[60]">
       <div class="bg-app-secondary border-4 border-red-500 p-4 text-red-500 font-bold shadow-[8px_8px_0px_0px_rgba(239,68,68,0.2)] flex items-center space-x-4 uppercase tracking-widest">
          <span class="text-xl">[!]</span>
          <span class="flex-1 text-sm">{{ ticketStore.error }}</span>
          <button @click="ticketStore.error = null" class="p-1 border-2 border-red-500 hover:bg-red-500 hover:text-app-bg transition-colors">
             [X]
          </button>
       </div>
    </div>

    <div v-if="ticketStore.loading && ticketStore.tickets.length === 0" class="flex justify-center py-20">
      <div class="text-app-text font-black text-xl animate-pulse tracking-[0.3em]">CARGANDO_DATOS...</div>
    </div>

    <div v-else class="space-y-6">
       <!-- Controls Section -->
        <div class="pixel-card p-6 lg:p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
           
           <!-- Tabs -->
           <div class="flex bg-app-secondary border-2 border-app-border p-1 w-full lg:w-auto">
              <button 
                v-for="tab in ['TODO', 'ABIERTO', 'EN PROCESO', 'CERRADO']" 
                :key="tab"
                @click="activeTab = tab"
                class="flex-1 lg:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                :class="activeTab === tab ? 'bg-app-text text-app-bg' : 'text-app-text-secondary hover:text-app-text'"
              >
                 {{ tab === 'TODO' ? 'Todos' : tab.toLowerCase() }}
              </button>
           </div>
          
          <!-- Filters & Sort -->
           <div class="flex flex-col sm:flex-row w-full lg:w-auto gap-3 text-app-text">
              <div class="relative w-full sm:w-48">
                 <input 
                   v-model="searchQuery" 
                   type="text" 
                   placeholder="BUSCAR_ASUNTO..." 
                   class="w-full bg-app-secondary border-2 border-app-border px-4 py-2 text-app-text focus:bg-app-text focus:text-app-secondary outline-none transition-all uppercase tracking-widest text-xs"
                 >
              </div>
                           <div class="relative w-full sm:w-48">
                  <select 
                     v-model="categoryFilter" 
                     class="w-full bg-app-secondary border-2 border-app-border px-4 py-2 text-app-text outline-none cursor-pointer focus:bg-app-text focus:text-app-secondary transition-all uppercase tracking-widest text-xs appearance-none"
                  >
                     <option value="ALL">TODAS_LAS_CATEGORÍAS</option>
                     <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.nombre">{{ cat.nombre.toUpperCase() }}</option>
                  </select>
               </div>

               <div class="relative w-full sm:w-48">
                  <input 
                     v-model="userSearchQuery" 
                     type="text" 
                     placeholder="USUARIO_SOLICITANTE..." 
                     class="w-full bg-app-secondary border-2 border-app-border px-4 py-2 text-app-text focus:bg-app-text focus:text-app-secondary outline-none transition-all uppercase tracking-widest text-xs"
                  >
               </div>
                          <select 
                 v-model="sortOrder" 
                 class="w-full sm:w-48 bg-app-secondary border-2 border-app-border px-4 py-2 text-app-text outline-none cursor-pointer focus:bg-app-text focus:text-app-secondary transition-all uppercase tracking-widest text-xs appearance-none"
              >
                 <option value="NEWEST">RECIENTES</option>
                 <option value="OLDEST">ANTIGUOS</option>
              </select>
           </div>
       </div>

        <div v-if="filteredTickets.length === 0" class="text-center py-20 bg-app-secondary border-2 border-dashed border-app-border shadow-sm">
          <p class="text-app-text-secondary font-black uppercase tracking-[0.2em] text-xs">[!] NO SE ENCONTRARON TICKETS COINCIDENTES</p>
        </div>

       <div v-else class="space-y-4">
          <!-- Table Header (Desktop) - Only show if there are tickets -->
          <div class="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-app-secondary border-2 border-app-border mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-app-text-secondary">
             <div class="col-span-1">> ID</div>
             <div class="col-span-5">> ASUNTO / MENSAJE</div>
             <div class="col-span-2">> CATEGORÍA</div>
             <div class="col-span-2">> USUARIO</div>
             <div class="col-span-2">> ESTADO</div>
          </div>

          <div class="space-y-3">
            <div 
              v-for="ticket in filteredTickets" 
              :key="ticket.id"
              class="pixel-card hover:bg-app-text/5 px-8 py-4 transition-all flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 group cursor-pointer relative overflow-hidden"
              @click="openTicketDetails(ticket)"
            >
            <!-- ID -->
            <div class="col-span-1">
               <span class="text-[10px] font-black text-app-text-secondary group-hover:text-app-text transition-colors">#{{ ticket.codigo }}</span>
            </div>

            <!-- Subject & Preview -->
            <div class="col-span-5 min-w-0">
               <div class="flex items-center space-x-2">
                  <h3 class="text-sm font-bold text-app-text truncate group-hover:underline uppercase tracking-widest">{{ ticket.titulo }}</h3>
                  <span v-if="ticket.tareaRelacionada" class="text-[9px] font-black bg-app-text text-app-bg px-1 border border-app-text">TK</span>
               </div>
               <p class="text-[11px] text-app-text-secondary truncate mt-0.5 font-medium uppercase tracking-tight">{{ ticket.mensaje }}</p>
            </div>

            <!-- Category -->
            <div class="col-span-2">
               <span class="inline-flex px-2 py-0.5 border-2 border-app-border bg-app-secondary text-[9px] font-bold text-app-text-secondary uppercase tracking-widest">
                  {{ ticket.categoria || 'SOPORTE' }}
               </span>
            </div>

            <!-- User & Date -->
            <div class="col-span-2 flex flex-col">
               <span class="text-xs font-bold text-app-text truncate uppercase tracking-widest">{{ ticket.usuario?.nombre || 'SIST.' }}</span>
               <span class="text-[9px] text-app-text-secondary uppercase font-black tracking-widest mt-1">{{ formatDate(ticket.fechaCreacion).split(',')[0] }}</span>
            </div>

            <!-- Status -->
            <div class="col-span-2 text-right md:text-left">
               <div 
                 class="inline-flex items-center space-x-2 px-3 py-1 border-2 text-[10px] font-black tracking-widest uppercase"
                 :class="getBadgeClass(ticket.estado)"
               >
                  <span>[ {{ ticket.estado }} ]</span>
               </div>
            </div>
        </div> <!-- end space-y-2 list -->
      </div> <!-- end v-else tickets -->
    </div> <!-- end v-else main content -->

    <!-- Create Ticket Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-app-bg/90" @click="showCreateModal = false"></div>
      <div class="bg-app-secondary border-4 border-app-border p-10 w-full max-w-2xl relative z-10 shadow-[8px_8px_0px_0px_rgba(0,255,65,0.2)]">
        <h3 class="text-3xl font-black mb-1 text-app-text uppercase tracking-widest">>> NUEVO_TICKET</h3>
        <p class="text-app-text-secondary mb-8 font-medium uppercase tracking-widest text-xs">> DESCRIBE EL INCIDENTE O SOLICITUD.</p>

        <form @submit.prevent="handleCreate" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-black text-app-text uppercase tracking-widest mb-2">CATEGORÍA / TEMA</label>
              <select v-model="newTicket.categoria" class="w-full bg-app-secondary border-2 border-app-border px-6 py-4 text-app-text focus:bg-app-text focus:text-app-secondary outline-none transition-all cursor-pointer appearance-none uppercase tracking-widest">
                 <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.nombre" class="bg-app-secondary">{{ cat.nombre.toUpperCase() }}</option>
                 <option v-if="categoryStore.categories.length === 0" value="Soporte General" class="bg-app-secondary">SOPORTE GENERAL</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-black text-app-text uppercase tracking-widest mb-2">ASUNTO_ESPECÍFICO</label>
              <input v-model="newTicket.titulo" required class="w-full bg-app-secondary border-2 border-app-border px-6 py-4 text-app-text focus:bg-app-text focus:text-app-secondary outline-none transition-all uppercase tracking-widest" placeholder="EJ: ERROR_CARGA_DIAGRAMA">
            </div>
          </div>
          <div>
            <label class="block text-xs font-black text-app-text uppercase tracking-widest mb-2">DETALLE_DE_LA_SOLICITUD</label>
            <textarea v-model="newTicket.mensaje" rows="4" required class="w-full bg-app-secondary border-2 border-app-border px-6 py-4 text-app-text focus:bg-app-text focus:text-app-secondary outline-none transition-all custom-scrollbar uppercase tracking-widest" placeholder="EXPLICA_DETALLADAMENTE..."></textarea>
          </div>
          <div>
            <label class="block text-xs font-black text-app-text uppercase tracking-widest mb-2">ADJUNTAR_IMAGEN (OPCIONAL)</label>
            <input type="file" @change="handleFileChange" accept="image/*" class="w-full bg-app-secondary border-2 border-dashed border-app-border px-6 py-3 text-app-text focus:bg-app-text focus:text-app-secondary outline-none transition-all text-xs cursor-pointer uppercase tracking-widest">
          </div>
          <div class="flex space-x-4 pt-6">
            <button type="button" @click="showCreateModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-app-text hover:bg-app-text hover:text-app-bg border-2 border-app-border transition-colors bg-app-secondary">[ CANCELAR ]</button>
            <button type="submit" class="flex-1 py-4 bg-app-text border-2 border-app-text text-app-bg font-black uppercase text-xs tracking-widest hover:bg-app-secondary hover:text-app-text transition-all">[ ENVIAR_TICKET ]</button>
          </div>
        </form>
      </div>
    </div>


    <!-- Ticket Detail & Thread Modal -->
    <div v-if="selectedTicket" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-app-bg/90" @click="selectedTicket = null"></div>
      <div class="bg-app-secondary border-4 border-app-border p-8 w-full max-w-3xl relative z-10 shadow-[10px_10px_0px_0px_rgba(0,255,65,0.1)] flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="flex justify-between items-start mb-6 shrink-0 border-b-2 border-app-border pb-4">
           <div>
              <div class="flex items-center space-x-3 mb-2">
                 <span class="text-[10px] bg-app-secondary text-app-text-secondary font-bold uppercase shrink-0 px-2 py-0.5 border-2 border-app-border tracking-widest">{{ selectedTicket.categoria || 'SOPORTE GENERAL' }}</span>
                 <span class="text-[10px] text-app-text-secondary font-bold uppercase tracking-widest">ID:#{{ selectedTicket.codigo }}</span>
              </div>
              <div class="flex flex-col md:flex-row md:items-center md:space-x-3 gap-2">
                 <h3 class="text-2xl font-black text-app-text uppercase tracking-widest">>> {{ selectedTicket.titulo }}</h3>
                 <div v-if="authStore.isAdmin" class="flex">
                     <button 
                        v-if="!selectedTicket.tareaRelacionada" 
                        @click="creatingTaskFromTicket = true"
                        class="bg-app-secondary text-app-text border-2 border-app-border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-app-text hover:text-app-secondary"
                        title="CONVERTIR"
                     >
                        [ CONVERTIR_A_TAREA ]
                     </button>
                     <span v-else class="text-app-text bg-app-text/10 border-2 border-app-text px-3 py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center space-x-1">
                         <span>[ VINCULADO ]</span>
                     </span>
                 </div>
              </div>
           </div>
           <button @click="selectedTicket = null" class="p-2 border-2 border-app-border text-app-text hover:bg-app-text hover:text-app-secondary transition-colors">
              [X]
           </button>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
           <!-- Original Message -->
           <div class="bg-app-secondary p-5 border-2 border-app-border text-app-text">
               <div class="flex items-center justify-between mb-3 border-b-2 border-app-border pb-3">
                  <div class="flex items-center space-x-2">
                     <span class="w-6 h-6 border-2 border-app-border bg-app-text flex items-center justify-center text-[10px] font-black text-app-bg uppercase">{{ selectedTicket.usuario?.nombre?.slice(0, 1) || '?' }}</span>
                     <span class="font-bold text-sm text-app-text uppercase tracking-widest">{{ selectedTicket.usuario?.nombre || 'SISTEMA' }}</span>
                  </div>
                  <span class="text-[10px] font-black text-app-text-secondary uppercase tracking-widest">{{ formatDate(selectedTicket.fechaCreacion) }}</span>
               </div>
               <p class="whitespace-pre-wrap text-sm leading-relaxed text-app-text uppercase tracking-widest">{{ selectedTicket.mensaje }}</p>

               <div v-if="selectedTicket.imagenUrl" class="mt-4">
                 <a :href="`http://localhost:3000${selectedTicket.imagenUrl}`" target="_blank" class="inline-block relative group/img cursor-pointer">
                    <img :src="`http://localhost:3000${selectedTicket.imagenUrl}`" alt="Adjunto" class="h-32 w-auto border-2 border-app-border group-hover:brightness-125 transition-all object-cover">
                 </a>
              </div>
           </div>

           <!-- Thread replies -->
           <div class="space-y-4 pt-4">
              <h4 class="text-[10px] font-black text-app-text-secondary uppercase tracking-[0.2em] mb-4">> HILO_DE_RESPUESTAS</h4>
              
              <div v-if="!selectedTicket.respuestas || selectedTicket.respuestas.length === 0" class="text-center py-8 text-app-text-secondary text-sm font-medium border-2 border-dashed border-app-border bg-app-secondary uppercase tracking-widest">
                 [ SIN RESPUESTAS HASTA EL MOMENTO ]
              </div>

              <div 
                  v-for="(reply, idx) in (selectedTicket.respuestas || [])" 
                  :key="idx"
                  class="bg-app-secondary p-5 border-2 border-app-border flex flex-col transition-all"
                  :class="{'border-app-text bg-app-text/5': reply.isAdmin}"
              >
                  <div class="flex justify-between items-center mb-2">
                     <div class="flex items-center space-x-2">
                        <span class="font-bold text-xs uppercase tracking-widest" :class="reply.isAdmin ? 'text-app-text' : 'text-app-text'">{{ reply.usuarioNombre }}</span>
                        <span v-if="reply.isAdmin" class="bg-app-text text-app-bg text-[8px] px-1.5 py-0.5 font-black tracking-widest uppercase">ADMIN</span>
                     </div>
                     <span class="text-[9px] text-app-text-secondary font-black uppercase tracking-widest">{{ formatDate(reply.fecha) }}</span>
                  </div>
                  <p class="text-sm text-app-text font-medium whitespace-pre-wrap leading-relaxed uppercase tracking-widest">{{ reply.mensaje }}</p>
              </div>
           </div>
        </div>

        <!-- Add Reply Box -->
        <div class="mt-6 pt-6 border-t-2 border-app-border shrink-0">
           <form @submit.prevent="submitReply" class="flex flex-col gap-3">
               <textarea 
                  v-model="newReply" 
                  rows="2" 
                  class="w-full bg-app-secondary border-2 border-app-border px-5 py-3 text-app-text focus:bg-app-text focus:text-app-secondary outline-none transition-all custom-scrollbar text-sm uppercase tracking-widest" 
                  placeholder="ESCRIBE_UNA_RESPUESTA..."
                  required
               ></textarea>
               <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-3">
                      <span class="text-[10px] text-app-text-secondary font-black uppercase tracking-widest">ESTADO_INCIDENCIA:</span>
                      <select 
                        v-model="newReplyStatus"
                        class="bg-app-secondary border-2 border-app-border px-3 py-1.5 text-[10px] text-app-text outline-none cursor-pointer focus:bg-app-text focus:text-app-secondary transition-all font-black tracking-widest uppercase"
                        :disabled="!authStore.isAdmin"
                      >
                         <option value="ABIERTO">ABIERTO</option>
                         <option value="EN PROCESO">EN PROCESO</option>
                         <option value="CERRADO">CERRADO</option>
                      </select>
                  </div>
                  <button 
                     type="submit" 
                     class="px-8 py-3 bg-app-text text-app-bg border-2 border-app-text font-black uppercase tracking-widest text-[10px] hover:bg-app-secondary hover:text-app-text transition-all"
                     :disabled="isSubmittingReply"
                   >
                     <span>[ RESPONDER ]</span>
                  </button>
               </div>
           </form>
        </div>
      </div>

      
      <!-- Mini modal to select project and convert ticket to task -->
      <div v-if="creatingTaskFromTicket" class="absolute inset-0 z-50 flex items-center justify-center p-4">
         <div class="absolute inset-0 bg-app-bg/90" @click="creatingTaskFromTicket = false"></div>
         <div class="bg-app-secondary border-4 border-app-border p-8 w-full max-w-sm relative z-10 shadow-[8px_8px_0px_0px_rgba(0,255,65,0.2)]">
            <h4 class="text-lg font-black text-app-text mb-2 uppercase tracking-widest">> VINCULAR_TAREA</h4>
            <p class="text-xs text-app-text-secondary mb-6 font-medium uppercase tracking-widest">> SELECCIONA_PROYECTO_DESTINO.</p>
            
            <select v-model="selectedProjectIdForTask" class="w-full bg-app-secondary border-2 border-app-border px-4 py-3 text-app-text outline-none transition-all text-sm mb-6 cursor-pointer appearance-none uppercase tracking-widest focus:bg-app-text focus:text-app-secondary">
               <option disabled value="">SELECCIONAR...</option>
               <option v-for="proj in projectStore.projects" :key="proj.id" :value="proj.id" class="bg-app-secondary">{{ proj.nombre.toUpperCase() }}</option>
            </select>
            
            <div class="flex space-x-3">
               <button @click="creatingTaskFromTicket = false" class="flex-1 py-3 text-xs font-black uppercase tracking-widest text-app-text hover:bg-app-text hover:text-app-secondary border-2 border-app-border transition-colors">[ CANCELAR ]</button>
               <button @click="createTaskFromTicket" :disabled="!selectedProjectIdForTask || isConvertingTask" class="flex-1 py-3 bg-app-text border-2 border-app-text text-app-bg text-xs font-black uppercase tracking-widest hover:bg-app-secondary hover:text-app-text transition-all">
                   <span v-if="!isConvertingTask">[ VINCULAR ]</span>
                   <div v-else class="text-[10px] animate-pulse">CARGANDO...</div>
               </button>
            </div>
         </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTicketStore } from '../store/tickets'
import { useAuthStore } from '../store/auth'
import { useProjectStore } from '../store/projects'
import { useTaskStore } from '../store/tasks'
import { useCategoryStore } from '../store/categories'
import api from '../api'

const ticketStore = useTicketStore()
const authStore = useAuthStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const showCreateModal = ref(false)
const newTicket = ref({ titulo: '', mensaje: '', categoria: 'Soporte General' })
const selectedFile = ref(null)

const selectedTicket = ref(null)
const newReply = ref('')
const newReplyStatus = ref('ABIERTO')
const isSubmittingReply = ref(false)

// Conversion feature
const creatingTaskFromTicket = ref(false)
const selectedProjectIdForTask = ref('')
const isConvertingTask = ref(false)

// Filters & State
const activeTab = ref('TODO')
const categoryFilter = ref('ALL')
const searchQuery = ref('')
const userSearchQuery = ref('')
const sortOrder = ref('NEWEST')

onMounted(() => {
  ticketStore.fetchTickets()
  categoryStore.fetchCategories()
  if (authStore.isAdmin) {
      projectStore.fetchProjects()
  }
})

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const handleCreate = async () => {
  const formData = new FormData()
  formData.append('titulo', newTicket.value.titulo)
  formData.append('mensaje', newTicket.value.mensaje)
  formData.append('categoria', newTicket.value.categoria)
  if (selectedFile.value) {
     formData.append('image', selectedFile.value)
  }

  const selectedCat = categoryStore.categories.find(c => c.nombre === newTicket.value.categoria)
  if (selectedCat) {
     formData.append('categoriaRelacionadaId', selectedCat.id)
  }

  const success = await ticketStore.createTicket(formData)
  if (success) {
    showCreateModal.value = false
    newTicket.value = { titulo: '', mensaje: '', categoria: 'Soporte General' }
    selectedFile.value = null
  }
}

const openTicketDetails = (ticket) => {
    selectedTicket.value = ticket;
    newReply.value = '';
    newReplyStatus.value = ticket.estado;
}

const createTaskFromTicket = async () => {
    if (!selectedProjectIdForTask.value || !selectedTicket.value) return;
    
    isConvertingTask.value = true;
    try {
        // Create the task in Kanban
        const newTask = await taskStore.createTask(selectedProjectIdForTask.value, {
            nombre: `[Ticket #${selectedTicket.value.codigo}] ${selectedTicket.value.titulo}`,
            descripcion: `Ticket de soporte Original: ${selectedTicket.value.mensaje}`,
            prioridad: selectedTicket.value.categoria === 'Incidencia Urgente' ? 'CRITICA' : 'MEDIA',
            estado: 'Pendiente'
        });
        
        if (newTask) {
            // Update the ticket to link the task ID
            await ticketStore.updateTicket(selectedTicket.value.id, {
                tareaRelacionada: { id: newTask.id },
            });
            // Mark the local reactive ticket as linked
            selectedTicket.value.tareaRelacionada = newTask;
            creatingTaskFromTicket.value = false;
        }
    } catch (e) {
        console.error("Error al convertir a tarea:", e);
    } finally {
        isConvertingTask.value = false;
    }
}

const submitReply = async () => {
    if (!newReply.value.trim() || !selectedTicket.value) return;
    
    isSubmittingReply.value = true;
    
    // Optimistic payload construction
    const currentReplies = selectedTicket.value.respuestas || [];
    const payload = {
       usuarioId: authStore.user.id,
       usuarioNombre: authStore.user.nombre,
       isAdmin: authStore.isAdmin,
       mensaje: newReply.value.trim(),
       fecha: new Date().toISOString()
    };
    
    const updatedRespuestas = [...currentReplies, payload];
    selectedTicket.value.respuestas = updatedRespuestas;
    
    try {
        await ticketStore.updateTicket(selectedTicket.value.id, { 
            respuestas: updatedRespuestas,
            estado: newReplyStatus.value
        });
        selectedTicket.value.estado = newReplyStatus.value;
        newReply.value = '';
    } catch(e) {
        console.error("Error pushing reply");
    } finally {
        isSubmittingReply.value = false;
    }
}

const changeStatus = async (ticket, newStatus) => {
    // Optimistic update in store isn't required if we manage it directly or wait, but lets just use a generic update
    ticket.estado = newStatus
    try {
        await api.patch(`/tickets/${ticket.id}`, { estado: newStatus })
    } catch(e) {
        console.error("Error updating ticket status")
        // revert conceptually if failed (omitted for brevity)
    }
}

const filteredTickets = computed(() => {
   let result = [...ticketStore.tickets]
   
   // Status Tab
   if (activeTab.value !== 'TODO') {
       result = result.filter(t => t.estado === activeTab.value)
   }
   
   // Subject Search
   if (searchQuery.value) {
       const lowerSearch = searchQuery.value.toLowerCase()
       result = result.filter(t => t.titulo?.toLowerCase().includes(lowerSearch))
   }
   
   // Category Filter
   if (categoryFilter.value !== 'ALL') {
       result = result.filter(t => t.categoria === categoryFilter.value)
   }
   
   // User Search
   if (userSearchQuery.value) {
       const lowerUser = userSearchQuery.value.toLowerCase()
       result = result.filter(t => t.usuario?.nombre?.toLowerCase().includes(lowerUser))
   }
   
   // Sort by created time (assuming they have fechaCreacion or similar, fallback to ID order if missing but we added it)
   result.sort((a,b) => {
       const dateA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
       const dateB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
       
       if (sortOrder.value === 'NEWEST') return dateB - dateA
       return dateA - dateB
   })
   
   return result
})

// Helpers
const formatDate = (dateString) => {
  if (!dateString) return 'Desconocida'
  return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const getIconBgClass = (estado) => {
    if (estado === 'CERRADO') return 'bg-green-500/20 text-green-400'
    if (estado === 'EN PROCESO') return 'bg-orange-500/20 text-orange-400'
    return 'bg-blue-500/20 text-blue-400' // ABIERTO
}

const getBadgeClass = (estado) => {
    if (estado === 'CERRADO') return 'border-2 border-green-500 text-green-500 bg-green-500/10'
    if (estado === 'EN PROCESO') return 'border-2 border-yellow-500 text-yellow-500 bg-yellow-500/10'
    return 'border-2 border-blue-500 text-blue-500 bg-blue-500/10'
}

</script>

<style scoped>
@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-pop-in { animation: pop-in 0.3s cubic-bezier(0, 0, 0.2, 1); }

.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: var(--bg-primary); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--text-secondary); border: 2px solid var(--bg-primary); }

/* Make select look consistent */
select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
</style>
