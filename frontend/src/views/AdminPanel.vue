<template>
  <div class="space-y-10">
    <!-- Header with Tabs -->
    <header class="flex flex-col md:flex-row justify-between md:items-center gap-6">
      <div>
        <h2 class="text-3xl font-black">PRISMA — Administración</h2>
        <p class="text-slate-400 mt-1">Configuración global del sistema y gestión de usuarios</p>
      </div>
      
      <div class="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-sm overflow-x-auto no-scrollbar">
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
          Tickets
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
          <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group shadow-xl shadow-slate-200/60 dark:shadow-none transition-all hover:shadow-2xl hover:shadow-slate-300/50">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-slate-900 dark:text-white">
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-width="2"/></svg>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Usuarios Totales</p>
            <h4 class="text-5xl font-black text-slate-900 dark:text-white">{{ adminStore.stats?.users || 0 }}</h4>
          </div>
          
          <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group border-b-blue-600/50 shadow-xl shadow-slate-200/60 dark:shadow-none transition-all hover:shadow-2xl hover:shadow-slate-300/50">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-slate-900 dark:text-white">
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-width="2"/></svg>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Proyectos Activos</p>
            <h4 class="text-5xl font-black text-slate-900 dark:text-white">{{ adminStore.stats?.projects || 0 }}</h4>
          </div>

          <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group border-b-purple-600/50 shadow-xl shadow-slate-200/60 dark:shadow-none transition-all hover:shadow-2xl hover:shadow-slate-300/50">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-slate-900 dark:text-white">
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-2-2-2 2-2-2-2 2-2-2-2 2V5z" stroke-width="2"/></svg>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tickets Generados</p>
            <h4 class="text-5xl font-black text-slate-900 dark:text-white">{{ adminStore.stats?.tickets || 0 }}</h4>
          </div>

          <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group border-b-emerald-600/50 shadow-xl shadow-slate-200/60 dark:shadow-none transition-all hover:shadow-2xl hover:shadow-slate-300/50">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-slate-900 dark:text-white">
              <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2" stroke-width="2"/></svg>
            </div>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tareas Totales</p>
            <h4 class="text-5xl font-black text-slate-900 dark:text-white">{{ adminStore.stats?.tasks || 0 }}</h4>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] shadow-sm dark:shadow-none">
              <h4 class="text-lg font-black mb-6 flex items-center text-slate-900 dark:text-white">
                 <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                 Estado del Servidor
              </h4>
              <div class="space-y-4">
                 <div class="flex justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Base de Datos</span>
                    <span class="text-xs font-black text-emerald-500 dark:text-emerald-500 uppercase">Conectado (PostgreSQL)</span>
                 </div>
                 <div class="flex justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Última actualización de stats</span>
                    <span class="text-xs font-bold text-slate-900 dark:text-slate-200">{{ adminStore.stats?.lastUpdate ? new Date(adminStore.stats.lastUpdate).toLocaleTimeString() : '---' }}</span>
                 </div>
              </div>
           </div>

           <!-- Performance Metrics -->
           <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] lg:col-span-2 shadow-sm dark:shadow-none">
              <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                 <div>
                    <h4 class="text-lg font-black flex items-center text-slate-900 dark:text-white">
                       <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                       Métricas de Performance (24h)
                    </h4>
                    <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Tiempo de respuesta y carga del servidor</p>
                 </div>
                 <div class="flex gap-4">
                    <div class="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
                       <p class="text-[10px] text-slate-500 font-bold uppercase">Promedio</p>
                       <p class="text-xl font-black text-indigo-600 dark:text-indigo-400">{{ adminStore.stats?.technical?.avgResponseTime || 0 }}ms</p>
                    </div>
                    <div class="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 relative group/purge">
                       <p class="text-[10px] text-slate-500 font-bold uppercase">Peticiones</p>
                       <p class="text-xl font-black text-blue-600 dark:text-blue-400">{{ adminStore.stats?.technical?.totalRequests || 0 }}</p>
                       <button 
                         @click="handlePurgeLogs" 
                         title="Purgar logs técnicos antiguos"
                         class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/purge:opacity-100 transition-opacity shadow-lg"
                       >
                         <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="3"/></svg>
                       </button>
                    </div>
                 </div>
              </div>

              <!-- CSS BAR CHART -->
              <div class="h-48 flex items-end gap-2 px-4 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto custom-scrollbar">
                 <div v-for="(point, idx) in adminStore.stats?.technical?.timeline || []" :key="idx" class="flex-1 flex flex-col items-center group relative min-w-[30px]">
                    <div class="absolute -top-12 opacity-0 group-hover:opacity-100 bg-indigo-600 text-[10px] font-black px-2 py-1 rounded-md transition-all z-10 whitespace-nowrap shadow-xl">
                      {{ Math.round(point.avgResponseTime) }}ms / {{ point.requestCount }} req
                    </div>
                    <!-- Bar for Response Time -->
                    <div 
                      :style="{ height: Math.min((point.avgResponseTime / 500) * 100, 100) + '%' }" 
                      class="w-full bg-indigo-500/40 rounded-t-md hover:bg-indigo-500 transition-all border-t-2 border-indigo-400"
                    ></div>
                    <span class="text-[8px] text-slate-600 font-bold mt-2 uppercase tracking-tighter">{{ new Date(point.hour).getHours() }}h</span>
                 </div>
                 <div v-if="!adminStore.stats?.technical?.timeline?.length" class="w-full h-full flex items-center justify-center text-slate-600 italic text-xs">
                    Sin datos de telemetría suficientes
                 </div>
              </div>
              <div class="flex justify-between mt-4">
                 <p class="text-[9px] text-slate-500 font-bold uppercase">Baja Latencia (&lt;100ms)</p>
                 <p class="text-[9px] text-slate-500 font-bold uppercase">Carga Media (100-300ms)</p>
                 <p class="text-[9px] text-slate-500 font-bold uppercase">Alta Latencia (&gt;300ms)</p>
              </div>
           </div>

            <!-- Latency Guide -->
            <div class="bg-indigo-600/5 dark:bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[3rem] flex flex-col justify-center shadow-xl shadow-indigo-500/5 dark:shadow-none">
               <h5 class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6 flex items-center">
                 <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
                 Guía de Rendimiento (SLA)
               </h5>
               <div class="space-y-4">
                 <div class="flex items-center gap-3">
                   <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <p class="text-[10px] text-slate-600 dark:text-slate-300 font-bold"><b class="text-slate-900 dark:text-white">&lt; 150ms:</b> Óptimo. Experiencia instantánea.</p>
                 </div>
                 <div class="flex items-center gap-3">
                   <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                   <p class="text-[10px] text-slate-600 dark:text-slate-300 font-bold"><b class="text-slate-900 dark:text-white">150-300ms:</b> Normal. Carga imperceptible.</p>
                 </div>
                 <div class="flex items-center gap-3">
                   <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                   <p class="text-[10px] text-slate-600 dark:text-slate-300 font-bold"><b class="text-slate-900 dark:text-white">300-600ms:</b> Bajo estrés o proceso pesado.</p>
                 </div>
                 <div class="flex items-center gap-3">
                   <div class="w-2 h-2 rounded-full bg-red-500"></div>
                   <p class="text-[10px] text-slate-600 dark:text-slate-300 font-bold"><b class="text-slate-900 dark:text-white">&gt; 600ms:</b> Crítico. Revisar cuellos de botella.</p>
                 </div>
               </div>
            </div>
        </div>
      </div>
      <div v-if="activeTab === 'categories'" class="space-y-8 animate-fade-in">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-black text-slate-500 dark:text-white/50 uppercase tracking-widest">Parametrización de Tickets</h3>
          <button 
            @click="openCreateCategoryModal"
            class="px-5 py-2.5 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-bold hover:bg-blue-600/20 dark:hover:bg-blue-600/30 transition-all text-sm"
          >
            + Nueva Categoría / Flujo
          </button>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div 
            v-for="category in categoryStore.categories" 
            :key="category.id"
            class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div class="flex justify-between items-start mb-6">
              <div class="space-y-1">
                <h3 class="text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                  {{ category.nombre }} 
                  <span v-if="category.prefijo" class="ml-2 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 px-2 py-0.5 rounded-md border border-emerald-500/20">PRE: {{ category.prefijo }}</span>
                </h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ category.descripcion || 'Sin descripción' }}</p>
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
            <div class="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-4">
              <div>
                <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Grupos de Atención (Roles)</h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="role in category.rolesAutorizados" :key="role" class="px-3 py-1 bg-indigo-500/10 rounded-lg text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                     👥 {{ role }}
                  </span>
                  <span v-if="!category.rolesAutorizados?.length" class="text-[10px] text-slate-600 font-bold italic">Sin roles específicos</span>
                </div>
              </div>

              <div>
                <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Especialistas Individuales</h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="user in category.usuariosAutorizados" :key="user.id" class="px-3 py-1 bg-blue-500/10 rounded-lg text-[10px] font-bold text-blue-400 border border-blue-500/20">
                    👤 {{ user.nombre }}
                  </span>
                  <span v-if="!category.usuariosAutorizados?.length" class="text-[10px] text-slate-600 font-bold italic">Sin especialistas individuales</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: USERS -->
      <div v-if="activeTab === 'users'" class="space-y-8 animate-fade-in">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-black text-slate-500 dark:text-white/50 uppercase tracking-widest">Control de Usuarios y Seguridad</h3>
          <button 
            @click="openCreateUserModal"
            class="px-5 py-2.5 rounded-xl bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-bold hover:bg-indigo-600/20 dark:hover:bg-indigo-600/30 transition-all text-sm"
          >
            + Nuevo Usuario
          </button>
        </div>
        
        <div class="overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5">
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Nombre</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Email</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Rol</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Estado</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-white/5">
              <tr v-for="user in usersStore.users" :key="user.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-8 py-5 font-black text-slate-900 dark:text-white">{{ user.nombre }}</td>
                <td class="px-8 py-5 text-slate-500 dark:text-slate-400">{{ user.email }}</td>
                <td class="px-8 py-5">
                  <span :class="getRolColor(user.rol)" class="px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border">
                    {{ user.rol }}
                  </span>
                </td>
                <td class="px-8 py-5 text-slate-400 font-bold uppercase tracking-widest">
                   <span :class="user.activo ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'" class="px-2 py-1 rounded-md text-[9px] border border-current">
                     {{ user.activo ? 'ACTIVO' : 'INACTIVO' }}
                   </span>
                </td>
                <td class="px-8 py-5 text-right flex justify-end gap-2">
                  <button 
                    @click="openEditUserModal(user)"
                    class="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 transition-all group"
                    title="Editar Usuario"
                  >
                    <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button 
                    @click="openResetPasswordModal(user)"
                    class="p-2.5 rounded-xl bg-orange-600/10 text-orange-400 border border-orange-500/20 hover:bg-orange-600/20 transition-all group"
                    title="Resetear Password"
                  >
                    <svg class="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button 
                    @click="handleToggleUserStatus(user)"
                    :class="user.activo ? 'bg-red-600/10 text-red-400 border-red-500/20' : 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20'"
                    class="p-2.5 rounded-xl border hover:bg-opacity-20 transition-all group"
                    :title="user.activo ? 'Deshabilitar Usuario' : 'Habilitar Usuario'"
                  >
                    <svg v-if="user.activo" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB: ASSIGNMENTS -->
      <div v-if="activeTab === 'assignments'" class="space-y-8 animate-fade-in">
        <h3 class="text-xl font-black text-slate-500 dark:text-white/50 uppercase tracking-widest">Asignación de Usuarios a Proyectos</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Projects List -->
          <div class="lg:col-span-1 space-y-4">
            <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Seleccionar Proyecto</h4>
            <div class="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              <div 
                v-for="project in projectStore.projects" 
                :key="project.id"
                @click="selectProject(project.id)"
                :class="selectedProjectId === project.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'"
                class="p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-sm dark:shadow-none"
              >
                <div class="truncate mr-4 font-bold text-sm">{{ project.nombre }}</div>
                <svg class="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>
          </div>

          <!-- Assignment Management -->
            <div class="lg:col-span-3">
            <div v-if="!selectedProjectId" class="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-white/10 rounded-[3rem] bg-white dark:bg-white/5 shadow-inner">
              <svg class="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <p class="text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">Selecciona un proyecto para gestionar colaboradores</p>
            </div>

            <div v-else class="space-y-8 animate-fade-in">
              <div class="bg-white dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                <div class="flex justify-between items-center mb-8">
                   <div>
                     <h4 class="text-3xl font-black text-slate-900 dark:text-white">{{ currentProject?.nombre }}</h4>
                     <p class="text-slate-500 text-sm mt-2 font-medium">Gestión de acceso y roles de proyecto</p>
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
                    <div class="flex items-center justify-between">
                      <h5 class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                        <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Asignados ({{ assignedUsersFiltered.length }})
                      </h5>
                       <input 
                        v-model="searchAssigned" 
                        placeholder="Filtrar..." 
                        class="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1 text-[10px] text-slate-900 dark:text-white focus:border-purple-500 outline-none w-32"
                      >
                    </div>
                    <div class="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-6 space-y-3 border border-slate-200 dark:border-white/5 min-h-[400px] max-h-[500px] overflow-y-auto custom-scrollbar shadow-inner">
                      <div v-for="user in assignedUsersFiltered" :key="user.id" class="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-white/5 group shadow-sm dark:shadow-none">
                        <div>
                          <p class="text-sm font-black text-slate-900 dark:text-white">{{ user.nombre }}</p>
                          <p class="text-[9px] text-slate-500 font-black uppercase tracking-widest">{{ user.rol }}</p>
                        </div>
                        <button @click="handleRemoveUserFromProject(user.id)" class="p-2.5 text-red-500 dark:text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                      <p v-if="!assignedUsersFiltered.length" class="text-center py-20 text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">No hay colaboradores</p>
                    </div>
                  </div>

                  <!-- Add Users (Available) -->
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <h5 class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                        <span class="w-2 h-2 bg-slate-300 dark:bg-white/20 rounded-full mr-2"></span>
                        Disponibles ({{ availableUsersFiltered.length }})
                      </h5>
                       <input 
                        v-model="searchAvailable" 
                        placeholder="Buscar..." 
                        class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-[10px] text-slate-900 dark:text-white focus:border-indigo-500 outline-none w-40 shadow-sm"
                      >
                    </div>
                    <div class="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-6 space-y-3 border border-slate-200 dark:border-white/5 min-h-[400px] max-h-[500px] overflow-y-auto custom-scrollbar shadow-inner">
                      <div v-for="user in availableUsersFiltered" :key="user.id" class="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/5 group shadow-sm dark:shadow-none">
                         <div>
                          <p class="text-sm font-black text-slate-900 dark:text-slate-300">{{ user.nombre }}</p>
                          <p class="text-[9px] text-slate-500 font-black uppercase tracking-widest">{{ user.rol }}</p>
                        </div>
                        <button @click="handleAddUserToProject(user.id)" class="p-2.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all border border-slate-200 dark:border-transparent">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" stroke-width="3" stroke-linecap="round"/></svg>
                        </button>
                      </div>
                      <p v-if="!availableUsersFiltered.length" class="text-center py-20 text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Cuerpo completo</p>
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
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h3 class="text-xl font-black text-slate-500 dark:text-white/50 uppercase tracking-widest">Logs de Actividad en Tiempo Real</h3>
          <div class="flex items-center gap-3">
            <div class="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
              <button 
                @click="logFilter = 'ALL'" 
                :class="logFilter === 'ALL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
                class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Todos
              </button>
              <button 
                @click="logFilter = 'BUSINESS'" 
                :class="logFilter === 'BUSINESS' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
                class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Negocio
              </button>
              <button 
                @click="logFilter = 'TECHNICAL'" 
                :class="logFilter === 'TECHNICAL' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
                class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Técnico
              </button>
            </div>
            <button @click="adminStore.fetchActivityLogs()" class="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-all shadow-sm">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
        
        <!-- TERMINAL CONSOLE VIEW -->
        <div class="bg-[#0a0a0c] border border-slate-300 dark:border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl shadow-black/50">
          <!-- Terminal Header -->
          <div class="bg-slate-100 dark:bg-white/5 px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="flex gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-orange-500/50"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
              </div>
              <span class="ml-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">system.log — tail -f</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-[10px] font-bold text-emerald-500/60 font-mono animate-pulse">● LIVE</span>
              <div class="h-4 w-px bg-white/10"></div>
              <button @click="handlePurgeLogs" class="text-slate-500 hover:text-red-400 transition-colors" title="Limpiar buffer técnico">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
              </button>
              <button @click="adminStore.fetchActivityLogs()" class="text-slate-500 hover:text-white transition-colors" title="Refrescar">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>

          <!-- Console Output -->
          <div class="p-6 font-mono text-[11px] leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar bg-black/20">
            <div v-for="log in filteredLogs" :key="log.id" class="flex gap-4 py-1 hover:bg-white/[0.03] px-2 rounded -mx-2 transition-colors group">
              <span class="text-slate-600 shrink-0 select-none">[{{ new Date(log.fecha).toLocaleTimeString() }}]</span>
              
              <span :class="log.categoria === 'TECHNICAL' ? 'text-blue-500' : 'text-emerald-500'" class="font-black shrink-0 w-20">
                {{ log.categoria }}
              </span>

              <span :class="getLogLevelColor(log)" class="font-black shrink-0 w-24">
                {{ log.accion }}
              </span>

              <span class="text-slate-300 flex-1 truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:bg-black/80 group-hover:relative group-hover:z-10">
                {{ log.detalles }}
                <span v-if="log.usuario" class="text-slate-500 ml-2 italic">(@{{ log.usuario.nombre }})</span>
              </span>

              <span v-if="log.duracionMs" :class="getResponseTimeColor(log.duracionMs)" class="shrink-0 font-black">
                {{ log.duracionMs }}ms
              </span>
              <span v-else class="text-slate-800 shrink-0">--</span>
            </div>

            <div v-if="!filteredLogs.length" class="py-20 text-center text-slate-700 italic">
               &gt; No active logs found in buffer...
            </div>
            
            <!-- Cursor line -->
            <div class="flex gap-4 py-1 mt-2">
               <span class="text-emerald-500 font-black tracking-widest animate-pulse">&gt;_</span>
            </div>
          </div>
          
          <!-- Terminal Footer (Legend) -->
          <div class="bg-slate-100 dark:bg-white/5 px-6 py-2 border-t border-slate-200 dark:border-white/10 flex items-center gap-6">
             <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest">Umbrales de Alerta:</span>
             <div class="flex items-center gap-4">
                <div class="flex items-center gap-1.5">
                   <div class="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
                   <span class="text-[8px] font-bold text-slate-500">EXCELENTE (&lt;200ms)</span>
                </div>
                <div class="flex items-center gap-1.5">
                   <div class="w-1.5 h-1.5 rounded-full bg-orange-500/50"></div>
                   <span class="text-[8px] font-bold text-slate-500">ADVERTENCIA (200-500ms)</span>
                </div>
                <div class="flex items-center gap-1.5">
                   <div class="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                   <span class="text-[8px] font-bold text-slate-500">CRÍTICO (&gt;500ms)</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: CATEGORY (Create/Edit) -->
    <div v-if="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md" @click="showCategoryModal = false"></div>
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 w-full max-w-2xl relative z-10 shadow-2xl animate-pop-in">
        <h3 class="text-3xl font-black mb-1 text-slate-900 dark:text-white">{{ editingCategory ? 'Configurar Categoría' : 'Nueva Categoría de Soporte' }}</h3>
        <p class="text-slate-500 dark:text-slate-400 mb-8 font-medium">Asigna prefijos únicos y el personal de atención (SLA/Soporte).</p>

        <form @submit.prevent="handleCategorySubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="md:col-span-3">
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nombre</label>
              <input v-model="categoryForm.nombre" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-all" placeholder="Ej: Facturación...">
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Prefijo</label>
              <input v-model="categoryForm.prefijo" maxlength="5" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-4 text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-all text-center font-black uppercase" placeholder="TEC">
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Descripción</label>
            <textarea v-model="categoryForm.descripcion" rows="3" class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-all custom-scrollbar placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="Descripción..."></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Grupos de Atención (Roles)</label>
               <div class="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                  <label v-for="role in ['ADMIN', 'PROJECT_MANAGER', 'COLABORADOR', 'EXTERNO']" :key="role" class="flex items-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer group">
                    <input type="checkbox" :value="role" v-model="categoryForm.rolesAutorizados" class="w-4 h-4 rounded-md bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-indigo-600 focus:ring-indigo-500">
                    <span class="ml-3 text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{{ role }}</span>
                  </label>
               </div>
            </div>

            <div>
               <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Especialistas Específicos</label>
               <div class="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 max-h-[148px] overflow-y-auto custom-scrollbar flex flex-col gap-2">
                  <label v-for="user in selectableSpecialists" :key="user.id" class="flex items-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer group">
                    <input type="checkbox" :value="user.id" v-model="categoryForm.usuariosIds" class="w-4 h-4 rounded-md bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-blue-600 focus:ring-blue-500">
                    <div class="ml-3">
                      <p class="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{{ user.nombre }}</p>
                    </div>
                  </label>
               </div>
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

    <!-- MODAL: USER (Create/Edit) -->
    <div v-if="showUserModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md" @click="showUserModal = false"></div>
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 w-full max-w-xl relative z-10 shadow-2xl animate-pop-in">
        <h3 class="text-3xl font-black mb-1 text-slate-900 dark:text-white">{{ editingUser ? 'Editar Perfil' : 'Alta de Usuario' }}</h3>
        <p class="text-slate-500 dark:text-slate-400 mb-8 font-medium">Configura las credenciales y el nivel de acceso.</p>

        <form @submit.prevent="handleUserSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nombre Completo</label>
               <input v-model="userForm.nombre" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all" placeholder="Juan Pérez">
            </div>
            <div>
              <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Rol del Sistema</label>
              <select v-model="userForm.rol" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer">
                <option value="EXTERNO">Externo (Solo Tickets)</option>
                <option value="COLABORADOR">Colaborador (Proyectos)</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
                <option value="ADMIN">Administrador General</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email de Acceso</label>
            <input v-model="userForm.email" type="email" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all" placeholder="email@empresa.com">
          </div>

          <div v-if="editingUser" class="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
            <div class="flex-1">
               <p class="text-sm font-bold text-slate-900 dark:text-white">Estado de la cuenta</p>
               <p class="text-xs text-slate-500">{{ userForm.activo ? 'El usuario puede acceder al sistema.' : 'El usuario tiene el acceso restringido.' }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="userForm.activo" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div v-if="!editingUser">
            <label class="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Contraseña Inicial</label>
            <input v-model="userForm.password" type="text" required class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all" placeholder="Clave temporal...">
          </div>

          <div class="flex space-x-4 pt-6">
            <button type="button" @click="showUserModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" class="flex-1 py-4 bg-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
               {{ editingUser ? 'Actualizar Usuario' : 'Crear Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: RESET PASSWORD -->
    <div v-if="showResetModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md" @click="showResetModal = false"></div>
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 w-full max-w-md relative z-10 shadow-2xl animate-pop-in text-center">
        <div class="w-20 h-20 bg-orange-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
          <svg class="w-10 h-10 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>
        <h3 class="text-2xl font-black mb-2 text-slate-900 dark:text-white">Resetear Contraseña</h3>
        <p class="text-slate-500 dark:text-slate-400 mb-8">Nueva clave para <strong class="text-slate-900 dark:text-white">{{ targetUser?.nombre }}</strong></p>

        <form @submit.prevent="handleResetPassword" class="space-y-6">
          <input 
            v-model="newPassword" 
            type="text" 
            placeholder="Introduce la nueva clave..."
            required
            class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-all text-center font-bold tracking-widest"
          >
          <div class="flex flex-col gap-3">
            <button type="submit" class="py-4 bg-orange-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-500/20 text-white">Confirmar Cambio</button>
            <button type="button" @click="showResetModal = false" class="py-3 text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors text-xs uppercase text-slate-400">Cancelar</button>
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

// Activity Tab Logic
const logFilter = ref('ALL')
const filteredLogs = computed(() => {
  if (logFilter.value === 'ALL') return adminStore.activityLogs
  return adminStore.activityLogs.filter(l => l.categoria === logFilter.value)
})

const handlePurgeLogs = async () => {
  if (confirm('¿Estás seguro de purgar todos los logs técnicos antiguos? Esto liberará espacio en la base de datos.')) {
    await adminStore.purgeTechnicalLogs()
  }
}

// Categories Tab Logic
const showCategoryModal = ref(false)
const editingCategory = ref(null)
const categoryForm = ref({ nombre: '', descripcion: '', prefijo: '', usuariosIds: [], rolesAutorizados: [] })

// Users Tab Logic
const showUserModal = ref(false)
const editingUser = ref(null)
const userForm = ref({ nombre: '', email: '', rol: 'COLABORADOR', password: '', activo: true })
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

const searchAssigned = ref('')
const searchAvailable = ref('')

const availableUsersFiltered = computed(() => {
  if (!currentProject.value) return []
  const assignedIds = currentProject.value.usuarios?.map(u => u.id) || []
  const query = searchAvailable.value.toLowerCase()
  return usersStore.users.filter(u => 
    !assignedIds.includes(u.id) && 
    (u.nombre.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
  )
})

const assignedUsersFiltered = computed(() => {
  if (!currentProject.value) return []
  const query = searchAssigned.value.toLowerCase()
  return (currentProject.value.usuarios || []).filter(u => 
    u.nombre.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
  )
})

const selectableSpecialists = computed(() => {
    return usersStore.users.filter(u => u.rol !== 'EXTERNO')
})

// Categories Actions
const openCreateCategoryModal = () => {
  editingCategory.value = null
  categoryForm.value = { nombre: '', descripcion: '', prefijo: '', usuariosIds: [], rolesAutorizados: [] }
  showCategoryModal.value = true
}

const openEditCategoryModal = (category) => {
  editingCategory.value = category
  categoryForm.value = { 
    nombre: category.nombre, 
    descripcion: category.descripcion, 
    prefijo: category.prefijo || '',
    usuariosIds: category.usuariosAutorizados?.map(u => u.id) || [],
    rolesAutorizados: category.rolesAutorizados || []
  }
  showCategoryModal.value = true
}

const handleCategorySubmit = async () => {
  const payload = {
    nombre: categoryForm.value.nombre,
    descripcion: categoryForm.value.descripcion,
    prefijo: categoryForm.value.prefijo.toUpperCase(),
    usuariosAutorizados: categoryForm.value.usuariosIds.map(id => ({ id })),
    rolesAutorizados: categoryForm.value.rolesAutorizados
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
const openCreateUserModal = () => {
    editingUser.value = null
    userForm.value = { nombre: '', email: '', rol: 'COLABORADOR', password: '', activo: true }
    showUserModal.value = true
}

const openEditUserModal = (user) => {
    editingUser.value = user
    userForm.value = { 
        nombre: user.nombre, 
        email: user.email, 
        rol: user.rol, 
        activo: user.activo,
        password: ''
    }
    showUserModal.value = true
}

const handleUserSubmit = async () => {
    let success
    if (editingUser.value) {
        // En edición no mandamos password si está vacío
        const payload = { ...userForm.value }
        if (!payload.password) delete payload.password
        success = await usersStore.updateUser(editingUser.value.id, payload)
    } else {
        success = await usersStore.createUser(userForm.value)
    }
    if (success) {
        showUserModal.value = false
        await usersStore.fetchUsers()
    }
}

const handleToggleUserStatus = async (user) => {
    const nuevoEstado = !user.activo
    const msg = nuevoEstado ? '¿Habilitar este usuario?' : '¿Deshabilitar este usuario? No podrá iniciar sesión.'
    if (confirm(msg)) {
        const success = await usersStore.updateUser(user.id, { activo: nuevoEstado })
        if (success) await usersStore.fetchUsers()
    }
}

const getLogLevelColor = (log) => {
  if (log.categoria === 'TECHNICAL') {
    if (log.duracionMs > 500) return 'text-red-500'
    if (log.duracionMs > 200) return 'text-orange-400'
    return 'text-blue-400'
  }
  return 'text-emerald-400'
}

const getResponseTimeColor = (ms) => {
  if (ms > 500) return 'text-red-600'
  if (ms > 200) return 'text-orange-500'
  return 'text-emerald-600'
}

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
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background: var(--scrollbar-thumb);
  border-radius: 10px; 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { 
  background: var(--text-secondary);
  opacity: 0.2;
}
</style>
