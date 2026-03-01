<template>
  <div class="min-h-screen bg-slate-900 text-white flex overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col z-20 transition-all">
      <div class="p-8">
        <h1 class="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 tracking-tighter">
          GPPT
        </h1>
      </div>

      <nav class="flex-1 px-4 space-y-2">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all group"
          :class="$route.path === item.path ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="font-bold tracking-wide">{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-white/5">
        <div class="flex items-center space-x-3 p-4 rounded-3xl bg-white/5 border border-white/10">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-black text-white shadow-lg">
            {{ auth.user?.nombre?.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold truncate">{{ auth.user?.nombre }}</p>
            <p class="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{{ auth.user?.rol }}</p>
          </div>
        </div>
        
        <button 
          @click="handleLogout"
          class="w-full mt-4 flex items-center justify-center space-x-2 py-3 text-slate-500 hover:text-red-400 transition-colors font-bold text-sm"
        >
          <LogoutIcon class="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 relative overflow-y-auto bg-slate-900 custom-scrollbar">
      <!-- Background Blobs duplicated for consistency -->
      <div class="fixed top-0 -left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 pointer-events-none"></div>
      <div class="fixed bottom-0 -right-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 pointer-events-none"></div>

      <div class="p-8 md:p-12 relative z-10">
        <router-view v-slot="{ Component }">
          <transition 
            name="fade-slide" 
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'DashboardIcon' },
  { name: 'Proyectos', path: '/projects', icon: 'ProjectIcon' },
  { name: 'Tickets', path: '/tickets', icon: 'TicketIcon' },
]

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

// Simple Icon Components (Internal for simplicity)
const DashboardIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>' }
const ProjectIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>' }
const TicketIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-2-2-2 2-2-2-2 2-2-2-2 2V5z" /></svg>' }
const LogoutIcon = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>' }
</script>

<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
