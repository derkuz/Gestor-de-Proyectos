<template>
  <div>
    <header class="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-4">
      <div>
        <h2 class="text-3xl font-black text-app-text">Soporte técnico</h2>
        <p class="text-app-text-muted mt-1 font-medium">Gestiona los tickets y solicitudes de ayuda</p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          v-if="authStore.isAdmin"
          @click="$router.push('/tickets/categories')"
          class="px-6 py-3 rounded-2xl bg-app-surface border border-app-border text-app-text-muted font-bold hover:text-app-text transition-all flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          <span>Configurar Categorías</span>
        </button>
        <button 
          @click="showCreateModal = true"
          class="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap"
        >
          + Abrir Ticket
        </button>
      </div>
    </header>
    
    <!-- Error Toast -->
    <div v-if="ticketStore.error" class="fixed top-24 right-8 z-[60]">
       <div class="bg-red-500/20 backdrop-blur-xl border border-red-500/30 px-6 py-3 rounded-2xl text-red-400 font-bold shadow-2xl flex items-center space-x-3 group relative">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"/></svg>
          <span class="flex-1">{{ ticketStore.error }}</span>
          <button @click="ticketStore.error = null" class="w-6 h-6 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center transition-colors">
             <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
       </div>
    </div>

    <div v-if="ticketStore.loading && ticketStore.tickets.length === 0" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else class="space-y-6">
       <!-- Controls Section -->
       <div class="bg-app-surface border border-app-border rounded-3xl p-6 lg:p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm transition-colors">
          
          <!-- Tabs -->
          <div class="flex p-1 bg-app-bg border border-app-border rounded-2xl w-full lg:w-auto shadow-inner">
             <button 
               v-for="tab in ['TODO', 'ABIERTO', 'EN PROCESO', 'CERRADO']" 
               :key="tab"
               @click="activeTab = tab"
               class="flex-1 lg:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
               :class="activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-app-text-muted hover:text-app-text'"
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
                  placeholder="Buscar asunto..." 
                  class="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-app-text focus:border-blue-500 outline-none transition-all text-xs"
                >
                <svg class="w-4 h-4 text-app-text-muted absolute right-4 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
             </div>
             
              <div class="relative w-full sm:w-48">
                 <select 
                    v-model="categoryFilter" 
                    class="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-app-text outline-none cursor-pointer focus:border-blue-500 transition-all text-xs appearance-none"
                 >
                    <option value="ALL">Todas las categorías</option>
                    <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.nombre">{{ cat.nombre }}</option>
                 </select>
                 <svg class="w-4 h-4 text-app-text-muted absolute right-4 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>

              <div class="relative w-full sm:w-48">
                 <input 
                    v-model="userSearchQuery" 
                    type="text" 
                    placeholder="Usuario solicitante..." 
                    class="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-app-text focus:border-blue-500 outline-none transition-all text-xs"
                 >
                 <svg class="w-4 h-4 text-app-text-muted absolute right-4 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
             
             <select 
                v-model="sortOrder" 
                class="w-full sm:w-48 bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-app-text outline-none cursor-pointer focus:border-blue-500 transition-all text-xs appearance-none"
             >
                <option value="NEWEST">Más Recientes</option>
                <option value="OLDEST">Más Antiguos</option>
             </select>
          </div>
       </div>

       <div v-if="filteredTickets.length === 0" class="text-center py-20 bg-app-surface border border-dashed border-app-border rounded-3xl shadow-sm">
         <p class="text-app-text-muted font-black uppercase tracking-[0.2em] text-xs">No hay tickets que coincidan con la búsqueda.</p>
       </div>

       <div v-else class="space-y-4">
         <!-- Table Header (Desktop) - Only show if there are tickets -->
         <div class="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-app-surface border border-app-border rounded-2xl mb-2 text-[10px] font-black uppercase tracking-widest text-app-text-muted">
            <div class="col-span-1">ID</div>
            <div class="col-span-5">Asunto / Mensaje</div>
            <div class="col-span-2">Categoría</div>
            <div class="col-span-2">Usuario</div>
            <div class="col-span-2">Estado</div>
         </div>

         <div class="space-y-2">
           <div 
             v-for="ticket in filteredTickets" 
             :key="ticket.id"
             class="bg-app-surface border border-app-border hover:border-blue-500/30 hover:shadow-lg p-4 md:px-8 md:py-4 rounded-2xl transition-all flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 group cursor-pointer relative overflow-hidden"
             @click="openTicketDetails(ticket)"
           >
           <!-- Selection Indicator (Desktop) -->
           <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>

           <!-- ID -->
           <div class="col-span-1">
              <span class="text-[10px] font-black text-app-text-muted group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">#{{ ticket.codigo }}</span>
           </div>

           <!-- Subject & Preview -->
           <div class="col-span-5 min-w-0">
              <div class="flex items-center space-x-2">
                 <h3 class="text-sm font-bold text-app-text truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ ticket.titulo }}</h3>
                 <!-- Icon for linked task -->
                 <svg v-if="ticket.tareaRelacionada" class="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <p class="text-[11px] text-app-text-muted truncate mt-0.5 font-medium">{{ ticket.mensaje }}</p>
           </div>

           <!-- Category -->
           <div class="col-span-2">
              <span class="inline-flex px-2 py-0.5 rounded-md bg-app-bg border border-app-border text-[9px] font-bold text-app-text-muted uppercase tracking-tight">
                 {{ ticket.categoria || 'Soporte' }}
              </span>
           </div>

           <!-- User & Date -->
           <div class="col-span-2 flex flex-col">
              <span class="text-xs font-bold text-app-text truncate">{{ ticket.usuario?.nombre || 'Sist.' }}</span>
              <span class="text-[9px] text-app-text-muted uppercase font-black tracking-tighter">{{ formatDate(ticket.fechaCreacion).split(',')[0] }}</span>
           </div>

           <!-- Status -->
           <div class="col-span-2 text-right md:text-left">
              <div 
                class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border"
                :class="getBadgeClass(ticket.estado)"
              >
                 <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="ticket.estado === 'CERRADO' ? 'bg-green-400' : (ticket.estado === 'EN PROCESO' ? 'bg-orange-400' : 'bg-blue-400')"></span>
                 <span>{{ ticket.estado }}</span>
              </div>
           </div>
        </div> <!-- end space-y-2 list -->
      </div> <!-- end v-else tickets -->
    </div> <!-- end v-else main content -->

    <!-- Create Ticket Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-app-bg/80 backdrop-blur-md" @click="showCreateModal = false"></div>
      <div class="bg-app-surface border border-app-border rounded-[2.5rem] p-10 w-full max-w-2xl relative z-10 shadow-2xl animate-pop-in">
        <h3 class="text-3xl font-black mb-1 text-app-text">Nuevo Ticket</h3>
        <p class="text-app-text-muted mb-8 font-medium">Describe tu problema o solicitud de cambio.</p>

        <form @submit.prevent="handleCreate" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2">Categoría / Tema</label>
              <select v-model="newTicket.categoria" class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-4 text-app-text focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none">
                 <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.nombre" class="bg-app-surface border-b border-app-border">{{ cat.nombre }}</option>
                 <option v-if="categoryStore.categories.length === 0" value="Soporte General" class="bg-app-surface border-b border-app-border">Soporte General</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2">Asunto Específico</label>
              <input v-model="newTicket.titulo" required class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-4 text-app-text focus:border-blue-500 outline-none transition-all" placeholder="Ej: Error al cargar diagrama">
            </div>
          </div>
          <div>
            <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2">Detalle de la solicitud</label>
            <textarea v-model="newTicket.mensaje" rows="4" required class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-4 text-app-text focus:border-blue-500 outline-none transition-all custom-scrollbar" placeholder="Explica detalladamente qué sucede..."></textarea>
          </div>
          <div>
            <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2">Adjuntar Imagen / Captura (Opcional)</label>
            <input type="file" @change="handleFileChange" accept="image/*" class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-3 text-app-text focus:border-blue-500 outline-none transition-all text-xs cursor-pointer">
          </div>
          <div class="flex space-x-4 pt-6">
            <button type="button" @click="showCreateModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-app-text-muted hover:text-app-text transition-colors">Cancelar</button>
            <button type="submit" class="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-lg shadow-blue-500/30">Enviar Ticket</button>
          </div>
        </form>
      </div>
    </div>


    <!-- Ticket Detail & Thread Modal -->
    <div v-if="selectedTicket" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-app-bg/80 backdrop-blur-md" @click="selectedTicket = null"></div>
      <div class="bg-app-surface border border-app-border rounded-[2.5rem] p-8 w-full max-w-3xl relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="flex justify-between items-start mb-6 shrink-0">
           <div>
              <div class="flex items-center space-x-3 mb-2">
                 <span class="text-[10px] bg-app-bg text-app-text-muted font-bold uppercase shrink-0 px-2 py-1 rounded-md border border-app-border">{{ selectedTicket.categoria || 'Soporte General' }}</span>
                 <span class="text-[10px] text-app-text-muted font-bold uppercase tracking-widest">#{{ selectedTicket.codigo }}</span>
              </div>
              <div class="flex flex-col md:flex-row md:items-center md:space-x-3 gap-2">
                 <h3 class="text-2xl font-black text-app-text">{{ selectedTicket.titulo }}</h3>
                 <div v-if="authStore.isAdmin" class="flex">
                     <button 
                        v-if="!selectedTicket.tareaRelacionada" 
                        @click="creatingTaskFromTicket = true"
                        class="bg-purple-600/10 text-purple-600 dark:text-purple-400 hover:bg-purple-600/20 border border-purple-500/20 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center space-x-1"
                        title="Convertir ticket en tarea de proyecto"
                     >
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        <span>Convertir a Tarea Kanban</span>
                     </button>
                     <span v-else class="bg-green-600/10 text-green-600 dark:text-green-500 border border-green-500/20 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center space-x-1">
                         <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                         <span>Vinculado a Tarea</span>
                     </span>
                 </div>
              </div>
           </div>
           <button @click="selectedTicket = null" class="p-2 text-app-text-muted hover:text-app-text transition-colors bg-app-bg rounded-full border border-app-border">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
           <!-- Original Message -->
           <div class="bg-app-bg p-5 rounded-2xl border border-app-border text-app-text">
               <div class="flex items-center justify-between mb-3 border-b border-app-border pb-3">
                  <div class="flex items-center space-x-2">
                     <span class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-black text-white uppercase">{{ selectedTicket.usuario?.nombre?.slice(0, 2) || 'UK' }}</span>
                     <span class="font-bold text-sm text-app-text">{{ selectedTicket.usuario?.nombre || 'Desconocido' }}</span>
                  </div>
                  <span class="text-[10px] font-black text-app-text-muted uppercase tracking-widest">{{ formatDate(selectedTicket.fechaCreacion) }} (Apertura)</span>
               </div>
               <p class="whitespace-pre-wrap text-sm leading-relaxed text-app-text-muted font-medium">{{ selectedTicket.mensaje }}</p>

               <div v-if="selectedTicket.imagenUrl" class="mt-4">
                 <a :href="`http://localhost:3000${selectedTicket.imagenUrl}`" target="_blank" class="inline-block relative group/img cursor-pointer">
                    <img :src="`http://localhost:3000${selectedTicket.imagenUrl}`" alt="Adjunto" class="h-32 w-auto rounded-lg border border-app-border group-hover/img:brightness-110 transition-all object-cover">
                 </a>
              </div>
           </div>

           <!-- Thread replies -->
           <div class="space-y-4 pt-4">
              <h4 class="text-[10px] font-black text-app-text-muted uppercase tracking-widest mb-4">Hilo de Respuestas</h4>
              
              <div v-if="!selectedTicket.respuestas || selectedTicket.respuestas.length === 0" class="text-center py-8 text-app-text-muted text-sm font-medium italic border border-dashed border-app-border rounded-2xl bg-app-bg/50">
                 Nadie ha respondido a este ticket aún.
              </div>

              <div 
                  v-for="(reply, idx) in (selectedTicket.respuestas || [])" 
                  :key="idx"
                  class="bg-app-bg p-5 rounded-2xl border border-app-border flex flex-col group/reply transition-all"
                  :class="{'bg-blue-600/5 border-blue-500/20': reply.isAdmin}"
              >
                  <div class="flex justify-between items-center mb-2">
                     <div class="flex items-center space-x-2">
                        <span class="font-bold text-xs" :class="reply.isAdmin ? 'text-blue-600 dark:text-blue-400' : 'text-app-text'">{{ reply.usuarioNombre }}</span>
                        <span v-if="reply.isAdmin" class="bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[8px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase">Admin / Staff</span>
                     </div>
                     <span class="text-[9px] text-app-text-muted font-black uppercase tracking-widest">{{ formatDate(reply.fecha) }}</span>
                  </div>
                  <p class="text-sm text-app-text-muted font-medium whitespace-pre-wrap leading-relaxed">{{ reply.mensaje }}</p>
              </div>
           </div>
        </div>

        <!-- Add Reply Box -->
        <div class="mt-6 pt-6 border-t border-app-border shrink-0">
           <form @submit.prevent="submitReply" class="flex flex-col gap-3">
               <textarea 
                  v-model="newReply" 
                  rows="2" 
                  class="w-full bg-app-bg border border-app-border rounded-2xl px-5 py-3 text-app-text focus:border-blue-500 outline-none transition-all custom-scrollbar text-sm" 
                  placeholder="Escribe una respuesta para el ticket..."
                  required
               ></textarea>
               <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-3">
                      <span class="text-xs text-app-text-muted font-black uppercase tracking-widest">Marcando ticket como:</span>
                      <select 
                        v-model="newReplyStatus"
                        class="bg-app-bg border border-app-border rounded-lg px-3 py-1.5 text-xs text-app-text outline-none cursor-pointer focus:border-blue-500 transition-all font-black tracking-widest"
                        :disabled="!authStore.isAdmin"
                        :class="!authStore.isAdmin ? 'opacity-70 cursor-not-allowed' : ''"
                      >
                         <option value="ABIERTO" class="text-blue-400">ABIERTO</option>
                         <option value="EN PROCESO" class="text-orange-400">EN PROCESO</option>
                         <option value="CERRADO" class="text-green-400">CERRADO</option>
                      </select>
                  </div>
                  <button 
                     type="submit" 
                     class="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20"
                     :disabled="isSubmittingReply"
                     :class="{'opacity-50 cursor-not-allowed': isSubmittingReply}"
                   >
                     <span>Responder</span>
                     <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                  </button>
               </div>
           </form>
        </div>
      </div>

      
      <!-- Mini modal to select project and convert ticket to task -->
      <div v-if="creatingTaskFromTicket" class="absolute inset-0 z-50 flex items-center justify-center p-4">
         <div class="absolute inset-0 bg-app-bg/90 backdrop-blur-xl" @click="creatingTaskFromTicket = false"></div>
         <div class="bg-app-surface border border-purple-500/30 rounded-3xl p-8 w-full max-w-sm relative z-10 shadow-2xl shadow-purple-900/20">
            <h4 class="text-lg font-black text-app-text mb-2">Convertir Ticket a Tarea</h4>
            <p class="text-xs text-app-text-muted mb-6 font-medium">Selecciona el proyecto donde se registrará la tarea para solucionar este incidente.</p>
            
            <select v-model="selectedProjectIdForTask" class="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-app-text focus:border-purple-500 outline-none transition-all text-sm mb-6 cursor-pointer">
               <option disabled value="">Seleccionar Proyecto...</option>
               <option v-for="proj in projectStore.projects" :key="proj.id" :value="proj.id" class="bg-app-bg">{{ proj.nombre }}</option>
            </select>
            
            <div class="flex space-x-3">
               <button @click="creatingTaskFromTicket = false" class="flex-1 py-3 text-xs font-black uppercase tracking-widest text-app-text-muted hover:text-app-text transition-colors">Cancelar</button>
               <button @click="createTaskFromTicket" :disabled="!selectedProjectIdForTask || isConvertingTask" class="flex-1 py-3 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-500 transition-colors disabled:opacity-50 flex justify-center items-center">
                   <span v-if="!isConvertingTask">Vincular Tarea</span>
                   <div v-else class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
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
    if (estado === 'CERRADO') return 'border-green-500/30 text-green-400 bg-green-500/10 focus:border-green-500'
    if (estado === 'EN PROCESO') return 'border-orange-500/30 text-orange-400 bg-orange-500/10 focus:border-orange-500'
    return 'border-blue-500/30 text-blue-400 bg-blue-500/10 focus:border-blue-500'
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
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.6); }

/* Make select look consistent */
select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
</style>
