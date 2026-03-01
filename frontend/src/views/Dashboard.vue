<template>
  <div class="min-h-screen bg-slate-900 text-white p-8">
    <div class="max-w-6xl mx-auto">
      <header class="flex justify-between items-center mb-12">
        <div>
          <h1 class="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Dashboard
          </h1>
          <p class="text-slate-400 mt-2">Bienvenido, {{ auth.user?.nombre }}</p>
        </div>
        <button 
          @click="handleLogout"
          class="px-6 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 font-bold hover:bg-slate-700 transition-all"
        >
          Cerrar Sesión
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl">
          <h3 class="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Proyectos</h3>
          <p class="text-3xl font-black">0</p>
        </div>
        <div class="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl">
          <h3 class="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Tareas Pendientes</h3>
          <p class="text-3xl font-black">0</p>
        </div>
        <div class="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl">
          <h3 class="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Tickets Abiertos</h3>
          <p class="text-3xl font-black">0</p>
        </div>
      </div>

      <div class="mt-12 text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
        <p class="text-slate-500 font-medium">No hay proyectos activos todavía.</p>
        <button class="mt-4 text-purple-400 font-bold hover:text-purple-300 transition-colors">
          + Crear mi primer proyecto
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>
