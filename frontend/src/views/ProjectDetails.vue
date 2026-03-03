<template>
  <div v-if="projectStore.loading || taskStore.loading && taskStore.tasks.length === 0" class="flex justify-center py-20">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>

  <div v-else-if="!projectStore.currentProject" class="text-center py-20">
    <p class="text-app-text-muted font-medium">No se encontró el proyecto.</p>
    <router-link to="/projects" class="text-purple-600 dark:text-purple-400 mt-4 inline-block font-bold underline">Volver a Proyectos</router-link>
  </div>

  <div v-else>
    <header class="mb-10 flex flex-col md:flex-row justify-between items-start gap-4">
      <div>
        <router-link to="/projects" class="text-app-text-muted hover:text-app-text transition-colors flex items-center space-x-2 mb-4 text-sm font-bold uppercase tracking-widest">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Volver a proyectos</span>
        </router-link>
        <h2 class="text-4xl font-black tracking-tight text-app-text">{{ projectStore.currentProject.nombre }}</h2>
        <div class="flex items-center space-x-4 mt-3">
          <span :class="getStatusClass(projectStore.currentProject.estado)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border">
            {{ projectStore.currentProject.estado }}
          </span>
          <p class="text-app-text-muted text-sm font-medium">Desde {{ formatDate(projectStore.currentProject.fechaCreacion) }}</p>
        </div>
      </div>

      <!-- Error Toast (Static for now) -->
      <div v-if="taskStore.error" class="fixed top-24 right-8 z-[60]">
         <div class="bg-red-500/20 backdrop-blur-xl border border-red-500/30 px-6 py-3 rounded-2xl text-red-400 font-bold shadow-2xl flex items-center space-x-3 group relative">
            <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"/></svg>
            <span class="flex-1">{{ taskStore.error }}</span>
            <button @click="taskStore.error = null" class="w-6 h-6 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center transition-colors">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
         </div>
      </div>
      
      <div v-if="projectStore.error" class="fixed top-24 right-8 z-[60]">
         <div class="bg-red-500/20 backdrop-blur-xl border border-red-500/30 px-6 py-3 rounded-2xl text-red-400 font-bold shadow-2xl flex items-center space-x-3 group relative">
            <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"/></svg>
            <span class="flex-1">{{ projectStore.error }}</span>
            <button @click="projectStore.error = null" class="w-6 h-6 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center transition-colors">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
         </div>
      </div>

      <div v-if="docStore.error" class="fixed top-36 right-8 z-[60]">
         <div class="bg-red-500/20 backdrop-blur-xl border border-red-500/30 px-6 py-3 rounded-2xl text-red-400 font-bold shadow-2xl flex items-center space-x-3 group relative">
            <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"/></svg>
            <span class="flex-1">{{ docStore.error }}</span>
            <button @click="docStore.error = null" class="w-6 h-6 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center transition-colors">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
         </div>
      </div>
      
      <!-- Actions were moved to the Tasks section -->
      <div class="flex space-x-3 w-full md:w-auto">
      </div>
    </header>

    <!-- Project Content -->
    <main class="space-y-8 animate-fade-in">
      <!-- Project Overview, Progress & Documents Grid -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Description block (col-span-12 lg:col-span-8) -->
        <div class="col-span-12 lg:col-span-8 bg-app-surface border border-app-border p-6 rounded-2xl shadow-sm transition-colors">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-black text-app-text flex items-center gap-2">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Project Overview
            </h3>
            <button class="text-app-text-muted hover:text-purple-500 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </button>
          </div>
          <div class="prose prose-slate dark:prose-invert max-w-none">
            <p class="text-app-text-muted leading-relaxed font-medium">{{ projectStore.currentProject.descripcion || 'Sin descripción disponible.' }}</p>
          </div>
          <div class="mt-6 flex flex-wrap gap-2">
             <span class="px-3 py-1 bg-app-bg text-app-text-muted text-xs font-bold rounded-full border border-app-border">#infrastructure</span>
             <span class="px-3 py-1 bg-app-bg text-app-text-muted text-xs font-bold rounded-full border border-app-border">#project</span>
          </div>
        </div>

        <!-- Right Column (Progress & Documents) -->
        <div class="col-span-12 lg:col-span-4 space-y-6">
          <!-- Progress Box -->
          <div class="bg-app-surface border border-app-border p-6 rounded-2xl shadow-sm transition-colors">
            <h3 class="text-sm font-black text-app-text-muted uppercase tracking-wider mb-4">Progreso de proyecto</h3>
            <div class="flex items-end justify-between mb-2">
              <span class="text-3xl font-black text-app-text">{{ completionPercentage }}%</span>
              <span class="text-emerald-600 dark:text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center">
                 <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                 Estado actual
              </span>
            </div>
            <div class="w-full bg-app-bg h-2.5 rounded-full overflow-hidden border border-app-border">
              <div class="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-1000" :style="{ width: `${completionPercentage}%` }"></div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4">
              <div class="text-center p-3 rounded-xl bg-app-bg border border-app-border">
                <div class="text-[10px] text-app-text-muted uppercase font-black mb-1">Terminado</div>
                <div class="font-black text-lg text-app-text">{{ completedTasksCount }}</div>
              </div>
              <div class="text-center p-3 rounded-xl bg-app-bg border border-app-border">
                <div class="text-[10px] text-app-text-muted uppercase font-black mb-1">en proceso</div>
                <div class="font-black text-lg text-rose-500">{{ inProgressTasksCount }}</div>
              </div>
            </div>
          </div>

          <!-- Documents Box -->
          <div class="bg-app-surface border border-app-border p-6 rounded-2xl shadow-sm transition-colors">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-black text-app-text-muted uppercase tracking-wider">Lista de documentos</h3>
              <button @click="showAddDocModal = true" class="text-purple-600 dark:text-purple-400 text-xs font-black uppercase hover:underline">+ Agregar&nbsp;</button>
            </div>
            <div class="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              <div 
                v-for="doc in docStore.documents" 
                :key="doc.id"
                class="flex items-center space-x-3 group cursor-pointer bg-app-bg p-3 rounded-xl border border-app-border hover:border-purple-500/30 transition-all"
                @click="handleDocumentAction(doc)"
              >
                <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                     :class="doc.tipo === 'MD' ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400' : (doc.tipo === 'LINK' ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'bg-red-600/10 text-red-600 dark:text-red-400')">
                  <svg v-if="doc.tipo === 'MD'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2"/></svg>
                  <svg v-else-if="doc.tipo === 'LINK'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-width="2"/></svg>
                  <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="2"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-black truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-app-text">
                     {{ doc.titulo }}{{ doc.tipo === 'MD' && !doc.titulo.toLowerCase().endsWith('.md') ? '.md' : '' }}
                  </p>
                  <p class="text-[10px] text-app-text-muted uppercase font-black">{{ doc.tipo }}</p>
                </div>
                <button 
                  @click.stop="handleDeleteDoc(doc.id)"
                  class="p-2 text-app-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2.5"/></svg>
                </button>
              </div>

              <!-- Placeholder empty -->
              <div v-if="docStore.documents.length === 0" class="py-8 flex flex-col items-center justify-center border-2 border-dashed border-app-border rounded-xl">
                 <p class="text-app-text-muted text-sm font-medium">No hay documentos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Unified Tasks Section -->
      <section class="bg-app-surface border border-app-border p-8 rounded-3xl min-h-[500px] flex flex-col transition-colors shadow-xl">
          <h3 class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div class="flex items-center space-x-4">
              <span class="text-xl font-black text-app-text">Gestión de Actividades</span>
              <button 
                  @click="openTaskModal()"
                  :disabled="projectStore.currentProject.estado !== 'ACTIVO'"
                  class="px-4 py-2 bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  <span>Tarea</span>
              </button>
            </div>
            
            <!-- Tab Navigation -->
            <div class="flex p-1 bg-app-bg rounded-2xl border border-app-border self-start md:self-auto shadow-inner">
               <button 
                v-for="tab in ['kanban', 'list', 'gantt']" 
                :key="tab"
                @click="activeTab = tab"
                class="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                :class="activeTab === tab ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-app-text-muted hover:text-app-text'"
               >
                 {{ tab }}
               </button>
            </div>
          </h3>
          
          <div class="flex-1">
            <KanbanBoard 
              v-if="activeTab === 'kanban'" 
              :project-status="projectStore.currentProject.estado" 
              @add-task="openTaskModal()"
              @add-subtask="openTaskModal"
              @edit-task="task => openTaskModal(null, task)"
            />
            
            <TaskListView 
              v-else-if="activeTab === 'list'"
              :project-status="projectStore.currentProject.estado"
              @toggle-status="toggleTaskStatus"
              @add-subtask="openTaskModal"
              @edit-task="task => openTaskModal(null, task)"
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
      <div class="absolute inset-0 bg-app-bg/80 backdrop-blur-md" @click="showModal = false"></div>
      <div class="bg-app-surface border border-app-border rounded-[2.5rem] p-10 w-full max-w-xl relative z-10 shadow-2xl animate-pop-in">
        <h3 class="text-3xl font-black mb-1 text-app-text">
          <template v-if="isEditing">Editar {{ isSubtask ? 'Subtarea' : 'Tarea Principal' }}</template>
          <template v-else>Nueva {{ isSubtask ? 'Subtarea' : 'Tarea Principal' }}</template>
        </h3>
        <p class="text-app-text-muted mb-8 font-medium">
          <template v-if="isEditing">Modifica los detalles de la actividad.</template>
          <template v-else>{{ isSubtask ? 'Añadiendo a: ' + parentTaskName : 'Define una actividad principal para el proyecto.' }}</template>
        </p>
        
        <form @submit.prevent="handleSubmit" class="space-y-6 text-app-text">
          <div>
            <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2">Título de la {{ isSubtask ? 'subtarea' : 'tarea' }}</label>
            <input v-model="newTask.nombre" required class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-4 text-app-text focus:border-purple-500 outline-none transition-all" :placeholder="isSubtask ? 'Nombre de la subtarea' : 'Nombre de la tarea principal'">
          </div>

          <div v-if="!isSubtask">
             <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2">Detalles / Descripción</label>
             <textarea v-model="newTask.descripcion" rows="3" class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-4 text-app-text focus:border-purple-500 outline-none transition-all" placeholder="Explica brevemente de qué trata esta actividad..."></textarea>
          </div>

          <div v-if="!isSubtask">
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Asignar a Colaboradores</label>
            
            <!-- Selected Users Chips -->
            <div v-if="newTask.asignados.length > 0" class="flex flex-wrap gap-2 mb-3">
               <span 
                v-for="userId in newTask.asignados" 
                :key="'sel-'+userId"
                class="px-3 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-xl flex items-center gap-2"
               >
                 {{ usersStore.users.find(u => u.id === userId)?.nombre }}
                 <button type="button" @click="toggleUser(userId)" class="hover:text-red-400 font-black">&times;</button>
               </span>
            </div>

            <!-- Search Input -->
            <div class="relative mb-3">
               <input 
                 v-model="userSearch" 
                 type="text" 
                 placeholder="Buscar por nombre..." 
                 class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all text-sm"
               >
               <svg class="w-4 h-4 text-slate-500 absolute right-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>

            <!-- Filtered Users List -->
            <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
               <div 
                v-for="user in filteredUsers" 
                :key="user.id"
                @click="toggleUser(user.id)"
                class="px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center space-x-2 border"
                :class="newTask.asignados.includes(user.id) 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-white/5 border-white/10 text-slate-500 hover:border-purple-500/50 hover:text-slate-300'"
               >
                 <span>{{ user.nombre }}</span>
                 <svg v-if="newTask.asignados.includes(user.id)" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="4"/></svg>
               </div>
               <p v-if="filteredUsers.length === 0" class="text-xs text-slate-500 w-full py-2">No se encontraron usuarios.</p>
            </div>
            <p class="text-[10px] text-slate-600 font-bold uppercase tracking-widest pl-1 mt-2">Puedes seleccionar uno o varios usuarios</p>
          </div>

          <div v-if="!isSubtask" class="grid grid-cols-2 gap-6">
             <div>
                <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Fecha de Inicio</label>
                <input type="date" v-model="newTask.fechaInicio" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all cursor-pointer">
             </div>
             <div>
                <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Fecha de Fin</label>
                <input type="date" v-model="newTask.fechaFin" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all cursor-pointer">
             </div>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div v-if="!isSubtask">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Prioridad</label>
              <select v-model="newTask.prioridad" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none cursor-pointer">
                <option value="BAJA" class="bg-slate-900 text-white">Baja</option>
                <option value="MEDIA" class="bg-slate-900 text-white">Media</option>
                <option value="ALTA" class="bg-slate-900 text-white">Alta</option>
                <option value="CRITICA" class="bg-slate-900 text-white">Crítica</option>
              </select>
            </div>
            <div :class="!isSubtask ? 'flex items-end pb-4' : 'col-span-2'">
               <div class="w-full h-12 bg-white/3 border border-white/5 rounded-2xl flex items-center px-4">
                  <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Estado: Pendiente</span>
               </div>
            </div>
          </div>

          <div class="flex space-x-4 pt-6">
            <button type="button" @click="showModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" class="flex-1 py-4 bg-purple-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/30">
               {{ isEditing ? 'Guardar Cambios' : (isSubtask ? 'Crear Subtarea' : 'Crear Tarea') }}
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
            <div class="grid grid-cols-3 gap-3">
               <button 
                type="button"
                @click="newDoc.tipo = 'MD'"
                class="px-3 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all"
                :class="newDoc.tipo === 'MD' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 border-white/10 text-slate-500'"
               >
                 Markdown
               </button>
               <button 
                type="button"
                @click="newDoc.tipo = 'LINK'"
                class="px-3 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all"
                :class="newDoc.tipo === 'LINK' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-slate-500'"
               >
                 Enlace
               </button>
               <button 
                type="button"
                @click="newDoc.tipo = 'FILE'"
                class="px-3 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all"
                :class="newDoc.tipo === 'FILE' ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/5 border-white/10 text-slate-500'"
               >
                 Archivo
               </button>
            </div>
          </div>

          <div v-if="newDoc.tipo === 'LINK'">
             <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">URL del Recurso</label>
             <input v-model="newDoc.url" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all" placeholder="https://google.com/docs/...">
          </div>

          <div v-if="newDoc.tipo === 'FILE'">
             <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Seleccionar Archivo</label>
             <input type="file" @change="handleFileChange" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all text-xs">
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
const router = useRouter()
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const usersStore = useUsersStore()
const docStore = useDocumentationStore()

const showModal = ref(false)
const isSubtask = ref(false)
const isEditing = ref(false)
const editTaskId = ref(null)
const parentTaskId = ref(null)
const expandedTasks = ref([])
const activeTab = ref('kanban')
const showAddDocModal = ref(false)
const newDoc = ref({ titulo: '', tipo: 'MD', url: '' })
const selectedFile = ref(null) // Cambio: Agregado para que exista en el scope
const newTask = ref({ nombre: '', descripcion: '', prioridad: 'MEDIA', asignados: [], fechaInicio: '', fechaFin: '' })
const userSearch = ref('')

const filteredUsers = computed(() => {
    const lower = userSearch.value.toLowerCase()
    return usersStore.users.filter(u => {
        const isAssigned = newTask.value.asignados.includes(u.id)
        if (!userSearch.value) return isAssigned
        return isAssigned || u.nombre.toLowerCase().includes(lower)
    })
})

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

const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0]
}

const handleAddDocument = async () => {
    let createdDoc = null
    console.log('Iniciando creación de documento:', newDoc.value);
    
    if (newDoc.value.tipo === 'FILE' && selectedFile.value) {
        console.log('Subiendo archivo físico:', selectedFile.value.name);
        createdDoc = await docStore.uploadDocument(route.params.id, selectedFile.value, newDoc.value.titulo)
    } else {
        console.log('Creando MD o Link');
        createdDoc = await docStore.createDocument(route.params.id, newDoc.value)
    }

    if (createdDoc) {
        showAddDocModal.value = false
        const typeWasMD = newDoc.value.tipo === 'MD'
        newDoc.value = { titulo: '', tipo: 'MD', url: '' }
        selectedFile.value = null

        // Si era MD, redirigir al editor inmediatamente
        if (typeWasMD) {
            router.push(`/projects/${route.params.id}/documentation/${createdDoc.id}`)
        }
    }
}

const handleDocumentAction = (doc) => {
    if (doc.tipo === 'MD') {
        router.push(`/projects/${route.params.id}/documentation/${doc.id}`)
    } else if (doc.url) {
        // Si comienza con /uploads, es un archivo local del backend, agregamos la URL base
        const fullUrl = doc.url.startsWith('/uploads') ? `http://localhost:3000${doc.url}` : doc.url
        window.open(fullUrl, '_blank')
    }
}

const handleDeleteDoc = async (docId) => {
    console.log('Click en eliminar documento ID:', docId);
    if (!docId) {
        alert('No se puede eliminar: El documento no tiene un ID válido. Intenta refrescar la página.');
        return;
    }
    if (confirm('¿Estás seguro de eliminar este documento?')) {
        const res = await docStore.deleteDocument(route.params.id, docId)
        if (!res) {
            alert('Error al eliminar: ' + (docStore.error || 'Intenta de nuevo'));
        }
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

const completedTasksCount = computed(() => {
    return taskStore.tasks.filter(t => !t.esSubtarea && t.estado === 'Finalizado').length
})

const inProgressTasksCount = computed(() => {
    return taskStore.tasks.filter(t => !t.esSubtarea && t.estado !== 'Finalizado').length
})

const openTaskModal = (pid = null, taskToEdit = null) => {
    isSubtask.value = !!pid || (taskToEdit && taskToEdit.esSubtarea)
    parentTaskId.value = pid || (taskToEdit ? taskToEdit.padre?.id : null)
    userSearch.value = ''
    
    if (taskToEdit) {
        isEditing.value = true
        editTaskId.value = taskToEdit.id
        newTask.value = { 
            nombre: taskToEdit.nombre, 
            descripcion: taskToEdit.descripcion || '', 
            prioridad: taskToEdit.prioridad, 
            asignados: taskToEdit.asignados ? taskToEdit.asignados.map(u => !!u.id ? u.id : u) : [], 
            fechaInicio: taskToEdit.fechaInicio ? new Date(taskToEdit.fechaInicio).toISOString().split('T')[0] : '', 
            fechaFin: taskToEdit.fechaFin ? new Date(taskToEdit.fechaFin).toISOString().split('T')[0] : '' 
        }
    } else {
        isEditing.value = false
        editTaskId.value = null
        newTask.value = { nombre: '', descripcion: '', prioridad: 'MEDIA', asignados: [], fechaInicio: '', fechaFin: '' }
    }
    
    showModal.value = true
}

const handleSubmit = async () => {
    let success = false
    if (isEditing.value) {
        // Enviar actualización
        const res = await taskStore.updateTask(editTaskId.value, newTask.value)
        if (res) success = true
    } else if (isSubtask.value) {
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
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.6);
}

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
