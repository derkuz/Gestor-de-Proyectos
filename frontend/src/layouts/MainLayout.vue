<template>
  <div class="min-h-screen bg-app-bg text-app-text flex overflow-hidden transition-colors duration-300">
    <!-- Sidebar -->
    <aside class="w-64 bg-app-surface/50 backdrop-blur-xl border-r border-app-border flex flex-col z-20 transition-all">
      <div class="p-8 flex items-center justify-between">
        <h1 class="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 tracking-tighter">
          PRISMA
        </h1>
        
        <!-- Theme Toggle -->
        <button 
          @click="themeStore.toggleTheme" 
          class="p-2 rounded-xl bg-app-bg border border-app-border hover:bg-app-surface transition-all text-app-text-muted hover:text-app-text"
          title="Cambiar tema"
        >
          <SunIcon v-if="themeStore.theme === 'dark'" class="w-4 h-4" />
          <MoonIcon v-else class="w-4 h-4" />
        </button>
      </div>

      <nav class="flex-1 px-4 space-y-2">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all group"
          :class="$route.path === item.path ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' : 'text-app-text-muted hover:bg-app-surface hover:text-app-text'"
        >
          <component :is="item.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
          <span class="font-bold tracking-wide">{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-app-border">
        <div class="flex items-center space-x-3 p-4 rounded-3xl bg-app-surface/50 border border-app-border shadow-sm">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-black text-white shadow-lg">
            {{ auth.user?.nombre?.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold truncate">{{ auth.user?.nombre }}</p>
            <p class="text-[10px] text-app-text-muted font-medium uppercase tracking-widest">{{ auth.user?.rol }}</p>
          </div>
        </div>
        
        <button 
          @click="handleLogout"
          class="w-full mt-4 flex items-center justify-center space-x-2 py-3 text-app-text-muted hover:text-red-500 transition-colors font-bold text-sm"
        >
          <LogoutIcon class="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 relative overflow-y-auto bg-app-bg custom-scrollbar transition-colors duration-300">
      <!-- Background Blobs -->
      <div class="fixed top-0 -left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-[0.05] dark:opacity-10 pointer-events-none transition-opacity"></div>
      <div class="fixed bottom-0 -right-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-[0.05] dark:opacity-10 pointer-events-none transition-opacity"></div>

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
import { computed, h } from 'vue'
import { useAuthStore } from '../store/auth'
import { useThemeStore } from '../store/theme'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()

// SVG Icon Component Helper
const createIcon = (path, viewBox = "0 0 24 24") => ({
  render: () => h('svg', { 
    fill: 'none', 
    viewBox, 
    stroke: 'currentColor',
    innerHTML: path 
  })
})

const DashboardIcon = createIcon('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />')
const ProjectIcon = createIcon('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />')
const TicketIcon = createIcon('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v14l-2-2-2 2-2-2-2 2-2-2-2 2V5z" />')
const HelpIcon = createIcon('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />')
const AdminIcon = createIcon('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />')
const LogoutIcon = createIcon('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />')
const SunIcon = createIcon('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />')
const MoonIcon = createIcon('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />')

const menuItems = computed(() => {
  const items = [
    { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { name: 'Proyectos', path: '/projects', icon: ProjectIcon },
    { name: 'Tickets', path: '/tickets', icon: TicketIcon },
    { name: 'Ayuda', path: '/faq', icon: HelpIcon },
  ]
  
  if (auth.isAdmin || auth.isSuperAdmin) {
    items.push({ name: 'Administración', path: '/admin', icon: AdminIcon })
  }
  
  return items
})

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
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
  background: var(--scrollbar-thumb);
  border-radius: 10px;
}
</style>

