<template>
  <div class="space-y-10">
    <!-- Header with Tabs -->
    <header class="flex flex-col md:flex-row justify-between md:items-center gap-6">
      <div>
        <h2 class="text-3xl font-black">Panel de Administración</h2>
        <p class="text-slate-400 mt-1">Configuración global del sistema y gestión de usuarios</p>
      </div>
      
      <div class="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-sm overflow-x-auto no-scrollbar">
        <button 
          @click="activeTab = 'dashboard'"
          :class="activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'"
          class="px-5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap"
        >
          Dashboard
        </button>
        <button 
          @click="activeTab = 'categories'"
          :class="activeTab === 'categories' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'"
          class="px-5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap"
        >
          Categorías
        </button>
        <button 
          @click="activeTab = 'users'"
          :class="activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'"
          class="px-5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap"
        >
          Usuarios
        </button>
        <button 
          @click="activeTab = 'assignments'"
          :class="activeTab === 'assignments' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white'"
          class="px-5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap"
        >
          Asignaciones
        </button>
        <button 
          @click="activeTab = 'activity'"
          :class="activeTab === 'activity' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white'"
          class="px-5 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap"
        >
          Actividad
        </button>
      </div>
    </header>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>

    <div v-else>
      <!-- TAB: DASHBOARD (Stats) -->
      <div v-if="activeTab === 'dashboard'" class="space-y-8 animate-fade-in">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-width="2"/></svg>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Usuarios Totales</p>
            <h4 class="text-5xl font-black text-white">{{ adminStore.stats?.users || 0 }}</h4>
          </div>
          
          <div class="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group border-b-blue-500/50">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-width="2"/></svg>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Proyectos Activos</p>
            <h4 class="text-5xl font-black text-white">{{ adminStore.stats?.projects || 0 }}</h4>
          </div>

          <div class="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group border-b-purple-500/50">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-2-2-2 2-2-2-2 2-2-2-2 2V5z" stroke-width="2"/></svg>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tickets Generados</p>
            <h4 class="text-5xl font-black text-white">{{ adminStore.stats?.tickets || 0 }}</h4>
          </div>

          <div class="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group border-b-emerald-500/50">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2" stroke-width="2"/></svg>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tareas Totales</p>
            <h4 class="text-5xl font-black text-white">{{ adminStore.stats?.tasks || 0 }}</h4>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div class="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem]">
              <h4 class="text-lg font-black mb-6 flex items-center">
                 <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                 Estado del Servidor
              </h4>
              <div class="space-y-4">
                 <div class="flex justify-between p-4 bg-white/5 rounded-2xl">
                    <span class="text-xs font-bold text-slate-400">Base de Datos</span>
                    <span class="text-xs font-black text-emerald-500 uppercase">Conectado (PostgreSQL)</span>
                 </div>
                 <div class="flex justify-between p-4 bg-white/5 rounded-2xl">
                    <span class="text-xs font-bold text-slate-400">Última actualización de stats</span>
                    <span class="text-xs font-bold text-slate-200">{{ adminStore.stats?.lastUpdate ? new Date(adminStore.stats.lastUpdate).toLocaleTimeString() : '---' }}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
      <div v-if="activeTab === 'categories'" class="space-y-8 animate-fade-in">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-black text-white/50 uppercase tracking-widest">Gestión de Tipos de Ticket</h3>
          <button 
            @click="openCreateCategoryModal"
            class="px-5 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold hover:bg-emerald-600/30 transition-all text-sm"
          >
            + Nueva Categoría
          </button>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div 
            v-for="category in categoryStore.categories" 
            :key="category.id"
            class="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group relative"
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
                <button @click="openEditCategoryModal(category)" class="p-2 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600/40 transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button @click="handleDeleteCategory(category.id)" class="p-2 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/40 transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-white/5">
              <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Especialistas Asignados</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="user in category.usuariosAutorizados" :key="user.id" class="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-300">
                  {{ user.nombre }}
                </span>
                <span v-if="!category.usuariosAutorizados?.length" class="text-xs text-slate-600 italic">No hay especialistas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: USERS -->
      <div v-if="activeTab === 'users'" class="space-y-8 animate-fade-in">
        <h3 class="text-xl font-black text-white/50 uppercase tracking-widest">Control de Usuarios y Seguridad</h3>
        
        <div class="overflow-hidden bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-white/10 bg-white/5">
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Nombre</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Email</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Rol</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="user in usersStore.users" :key="user.id" class="hover:bg-white/5 transition-colors">
                <td class="px-8 py-5 font-bold text-white">{{ user.nombre }}</td>
                <td class="px-8 py-5 text-slate-400">{{ user.email }}</td>
                <td class="px-8 py-5">
                  <span :class="getRolColor(user.rol)" class="px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border">
                    {{ user.rol }}
                  </span>
                </td>
                <td class="px-8 py-5 text-right">
                  <button 
                    @click="openResetPasswordModal(user)"
                    class="px-4 py-2 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-orange-600/30 transition-all"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB: ASSIGNMENTS -->
      <div v-if="activeTab === 'assignments'" class="space-y-8 animate-fade-in">
        <h3 class="text-xl font-black text-white/50 uppercase tracking-widest">Asignación de Usuarios a Proyectos</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Projects List -->
          <div class="lg:col-span-1 space-y-4">
            <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Seleccionar Proyecto</h4>
            <div class="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              <div 
                v-for="project in projectStore.projects" 
                :key="project.id"
                @click="selectProject(project.id)"
                :class="selectedProjectId === project.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'"
                class="p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div class="truncate mr-4 font-bold text-sm">{{ project.nombre }}</div>
                <svg class="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>
          </div>

          <!-- Assignment Management -->
          <div class="lg:col-span-3">
            <div v-if="!selectedProjectId" class="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5">
              <svg class="w-12 h-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <p class="text-slate-500 font-bold">Selecciona un proyecto para gestionar sus colaboradores</p>
            </div>

            <div v-else class="space-y-8 animate-fade-in">
              <div class="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/10">
                <div class="flex justify-between items-center mb-8">
                   <div>
                     <h4 class="text-2xl font-black text-white">{{ currentProject?.nombre }}</h4>
                     <p class="text-slate-500 text-sm mt-1">Gestiona quién tiene acceso a este proyecto</p>
                   </div>
                   <div class="flex -space-x-3">
                     <div v-for="user in currentProject?.usuarios" :key="user.id" class="w-10 h-10 rounded-full bg-purple-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black uppercase text-white shadow-lg" :title="user.nombre">
                        {{ user.nombre.charAt(0) }}
                     </div>
                   </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                  <!-- Assigned Users -->
                  <div class="space-y-4">
                    <h5 class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Usuarios Asignados ({{ currentProject?.usuarios?.length || 0 }})
                    </h5>
                    <div class="bg-white/5 rounded-3xl p-4 space-y-2 border border-white/5 min-h-[300px] max-h-[400px] overflow-y-auto custom-scrollbar">
                      <div v-for="user in currentProject?.usuarios" :key="user.id" class="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all border border-white/5 group">
                        <div>
                          <p class="text-sm font-bold text-white text-xs">{{ user.nombre }}</p>
                          <p class="text-[9px] text-slate-500 font-black uppercase">{{ user.rol }}</p>
                        </div>
                        <button @click="handleRemoveUserFromProject(user.id)" class="p-2 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                      <p v-if="!currentProject?.usuarios?.length" class="text-center py-20 text-xs text-slate-600 italic">No hay usuarios asignados directamente</p>
                    </div>
                  </div>

                  <!-- Add Users (Available) -->
                  <div class="space-y-4">
                    <h5 class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <span class="w-2 h-2 bg-white/20 rounded-full mr-2"></span>
                      Agregar Colaborador
                    </h5>
                    <div class="bg-white/5 rounded-3xl p-4 space-y-2 border border-white/5 min-h-[300px] max-h-[400px] overflow-y-auto custom-scrollbar">
                      <div v-for="user in availableUsers" :key="user.id" class="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5 group">
                         <div>
                          <p class="text-sm font-bold text-slate-300 text-xs">{{ user.nombre }}</p>
                          <p class="text-[9px] text-slate-500 font-black uppercase">{{ user.rol }}</p>
                        </div>
                        <button @click="handleAddUserToProject(user.id)" class="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                        </button>
                      </div>
                      <p v-if="!availableUsers.length" class="text-center py-20 text-xs text-slate-600 italic">No hay más usuarios disponibles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- TAB: ACTIVITY -->
      <div v-if="activeTab === 'activity'" class="space-y-8 animate-fade-in">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-black text-white/50 uppercase tracking-widest">Logs de Actividad en Tiempo Real</h3>
          <button @click="adminStore.fetchActivityLogs()" class="p-2 text-slate-400 hover:text-white transition-colors">
             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        
        <div class="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-4">
          <div 
            v-for="log in adminStore.activityLogs" 
            :key="log.id"
            class="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm flex gap-6 items-center hover:bg-white/[0.07] transition-all"
          >
            <div :class="getLogIconBg(log.accion)" class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
               <component :is="getLogIcon(log.accion)" class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <p class="font-black text-sm text-white tracking-wide uppercase">{{ log.accion.replace(/_/g, ' ') || 'SISTEMA' }}</p>
                <p class="text-[10px] font-bold text-slate-500">{{ new Date(log.fecha).toLocaleString() }}</p>
              </div>
              <p class="text-xs text-slate-400 mt-1">{{ log.detalles }}</p>
              <div v-if="log.usuario" class="mt-3 flex items-center gap-2">
                 <div class="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-[8px] font-black text-white">{{ log.usuario.nombre.charAt(0) }}</div>
                 <span class="text-[10px] font-bold text-slate-500">Iniciado por: {{ log.usuario.nombre }}</span>
              </div>
            </div>
          </div>
          <div v-if="!adminStore.activityLogs.length" class="text-center py-20 text-slate-600 italic border-2 border-dashed border-white/5 rounded-[2.5rem]">
            No hay registros de actividad recientes
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: CATEGORY (Create/Edit) -->
    <div v-if="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md" @click="showCategoryModal = false"></div>
      <div class="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 w-full max-w-2xl relative z-10 shadow-2xl animate-pop-in">
        <h3 class="text-3xl font-black mb-1">{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
        <p class="text-slate-400 mb-8 font-medium">Define los prefijos y especialistas autorizados.</p>

        <form @submit.prevent="handleCategorySubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="md:col-span-3">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nombre</label>
              <input v-model="categoryForm.nombre" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all" placeholder="Ej: Facturación...">
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Prefijo</label>
              <input v-model="categoryForm.prefijo" maxlength="5" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:border-emerald-500 outline-none transition-all text-center font-black uppercase" placeholder="TEC">
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Descripción</label>
            <textarea v-model="categoryForm.descripcion" rows="3" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all custom-scrollbar" placeholder="Descripción..."></textarea>
          </div>

          <div>
             <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Especialistas Autorizados</label>
             <div class="bg-white/5 border border-white/10 rounded-2xl p-4 max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                <label v-for="user in selectableSpecialists" :key="user.id" class="flex items-center p-3 rounded-xl hover:bg-white/5 cursor-pointer group">
                  <input type="checkbox" :value="user.id" v-model="categoryForm.usuariosIds" class="w-5 h-5 rounded-lg bg-slate-800 border-white/10 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer">
                  <div class="ml-4 flex-1">
                    <p class="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{{ user.nombre }}</p>
                    <p class="text-[10px] text-slate-500 uppercase font-black">{{ user.rol }}</p>
                  </div>
                </label>
             </div>
          </div>

          <div class="flex space-x-4 pt-6">
            <button type="button" @click="showCategoryModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" class="flex-1 py-4 bg-emerald-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20">
               {{ editingCategory ? 'Guardar Cambios' : 'Crear Categoría' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: RESET PASSWORD -->
    <div v-if="showResetModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md" @click="showResetModal = false"></div>
      <div class="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 w-full max-w-md relative z-10 shadow-2xl animate-pop-in text-center">
        <div class="w-20 h-20 bg-orange-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
          <svg class="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>
        <h3 class="text-2xl font-black mb-2">Resetear Contraseña</h3>
        <p class="text-slate-400 mb-8">Nueva clave para <strong class="text-white">{{ targetUser?.nombre }}</strong></p>

        <form @submit.prevent="handleResetPassword" class="space-y-6">
          <input 
            v-model="newPassword" 
            type="text" 
            placeholder="Introduce la nueva clave..."
            required
            class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-orange-500 outline-none transition-all text-center font-bold tracking-widest"
          >
          <div class="flex flex-col gap-3">
            <button type="submit" class="py-4 bg-orange-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-500/20">Confirmar Cambio</button>
            <button type="button" @click="showResetModal = false" class="py-3 text-slate-500 font-bold hover:text-white transition-colors text-xs uppercase">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useCategoryStore } from '../store/categories'
import { useUsersStore } from '../store/users'
import { useProjectStore } from '../store/projects'
import { useAdminStore } from '../store/admin'

const categoryStore = useCategoryStore()
const usersStore = useUsersStore()
const projectStore = useProjectStore()
const adminStore = useAdminStore()

const activeTab = ref('dashboard')
const loading = ref(false)

// Categories Tab Logic
const showCategoryModal = ref(false)
const editingCategory = ref(null)
const categoryForm = ref({ nombre: '', descripcion: '', prefijo: '', usuariosIds: [] })

// Users Tab Logic
const showResetModal = ref(false)
const targetUser = ref(null)
const newPassword = ref('')

// Assignments Tab Logic
const selectedProjectId = ref(null)

onMounted(async () => {
  loading.value = true
  await Promise.all([
    categoryStore.fetchCategories(),
    usersStore.fetchUsers(),
    projectStore.fetchProjects(),
    adminStore.fetchStats(),
    adminStore.fetchActivityLogs()
  ])
  loading.value = false
})

// Auto-refresh stats when switching to dashboard or activity
watch(activeTab, (newTab) => {
  if (newTab === 'dashboard') adminStore.fetchStats()
  if (newTab === 'activity') adminStore.fetchActivityLogs()
})

const currentProject = computed(() => {
  return projectStore.projects.find(p => p.id === selectedProjectId.value) || projectStore.currentProject
})

const availableUsers = computed(() => {
  if (!currentProject.value) return []
  const assignedIds = currentProject.value.usuarios?.map(u => u.id) || []
  return usersStore.users.filter(u => !assignedIds.includes(u.id))
})

const selectableSpecialists = computed(() => {
    return usersStore.users.filter(u => u.rol !== 'EXTERNO')
})

// Categories Actions
const openCreateCategoryModal = () => {
  editingCategory.value = null
  categoryForm.value = { nombre: '', descripcion: '', prefijo: '', usuariosIds: [] }
  showCategoryModal.value = true
}

const openEditCategoryModal = (category) => {
  editingCategory.value = category
  categoryForm.value = { 
    nombre: category.nombre, 
    descripcion: category.descripcion, 
    prefijo: category.prefijo || '',
    usuariosIds: category.usuariosAutorizados?.map(u => u.id) || [] 
  }
  showCategoryModal.value = true
}

const handleCategorySubmit = async () => {
  const payload = {
    nombre: categoryForm.value.nombre,
    descripcion: categoryForm.value.descripcion,
    prefijo: categoryForm.value.prefijo.toUpperCase(),
    usuariosAutorizados: categoryForm.value.usuariosIds.map(id => ({ id }))
  }

  let success
  if (editingCategory.value) {
    success = await categoryStore.updateCategory(editingCategory.value.id, payload)
  } else {
    success = await categoryStore.createCategory(payload)
  }
  if (success) showCategoryModal.value = false
}

const handleDeleteCategory = async (id) => {
  if (confirm('¿Eliminar esta categoría?')) await categoryStore.deleteCategory(id)
}

// Users Actions
const openResetPasswordModal = (user) => {
  targetUser.value = user
  newPassword.value = ''
  showResetModal.value = true
}

const handleResetPassword = async () => {
  if (!newPassword.value) return
  const success = await usersStore.adminResetPassword(targetUser.value.id, newPassword.value)
  if (success) {
    alert('Contraseña actualizada correctamente')
    showResetModal.value = false
  }
}

const getRolColor = (rol) => {
  const colors = {
    ADMIN: 'border-red-500/30 text-red-500 bg-red-500/5',
    PROJECT_MANAGER: 'border-blue-500/30 text-blue-500 bg-blue-500/5',
    COLABORADOR: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5',
    EXTERNO: 'border-slate-500/30 text-slate-500 bg-slate-500/5'
  }
  return colors[rol] || 'border-slate-500/30 text-slate-500 bg-slate-500/5'
}

// Assignments Actions
const selectProject = async (id) => {
  selectedProjectId.value = id
  await projectStore.fetchProjectById(id)
}

const handleAddUserToProject = async (userId) => {
  if (!selectedProjectId.value) return
  const success = await projectStore.assignUser(selectedProjectId.value, userId)
  if (success) {
    // Refresh the project to show the new user
    await projectStore.fetchProjectById(selectedProjectId.value)
  }
}

const handleRemoveUserFromProject = async (userId) => {
  if (!selectedProjectId.value) return
  if (confirm('¿Retirar a este usuario del proyecto?')) {
    const success = await projectStore.removeUser(selectedProjectId.value, userId)
    if (success) {
      await projectStore.fetchProjectById(selectedProjectId.value)
    }
  }
}

// Activity Log Helpers
const getLogIcon = (accion) => {
  if (accion.includes('CREATE')) return 'PlusIcon'
  if (accion.includes('UPDATE') || accion.includes('RESET')) return 'EditIcon'
  if (accion.includes('DELETE') || accion.includes('REMOVE')) return 'TrashIcon'
  if (accion.includes('LOGIN')) return 'LoginIcon'
  return 'InfoIcon'
}

const getLogIconBg = (accion) => {
  if (accion.includes('CREATE')) return 'bg-emerald-600/20 text-emerald-500'
  if (accion.includes('UPDATE') || accion.includes('RESET')) return 'bg-blue-600/20 text-blue-500'
  if (accion.includes('DELETE') || accion.includes('REMOVE')) return 'bg-red-600/20 text-red-500'
  if (accion.includes('LOGIN')) return 'bg-purple-600/20 text-purple-500'
  return 'bg-slate-600/20 text-slate-500'
}

// Inline Icons for Activity
const PlusIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" stroke-width="3" stroke-linecap="round"/></svg>' }
const EditIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' }
const TrashIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' }
const LoginIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' }
const InfoIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' }
</script>

<style scoped>
@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-pop-in { animation: pop-in 0.3s cubic-bezier(0, 0, 0.2, 1); }
.animate-fade-in { animation: fade-in 0.4s ease-out; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
</style>
