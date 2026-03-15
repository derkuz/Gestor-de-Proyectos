<template>
  <div class="min-h-screen bg-app-bg overflow-hidden relative flex items-center justify-center p-4 transition-colors duration-500">
    <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-blob"></div>
    <div class="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-blob animation-delay-2000"></div>

    <div class="w-full max-w-md bg-app-surface backdrop-blur-xl border border-app-border rounded-[2.5rem] p-10 shadow-2xl relative z-10 transition-colors">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 mb-2">
          Crear Cuenta
        </h1>
        <p class="text-app-text-muted font-black uppercase tracking-widest text-[10px]">Únete a la plataforma GPPT</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
          <input 
            v-model="nombre" 
            type="text" 
            placeholder="Tu nombre"
            class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-4 text-app-text transition-all focus:border-purple-500 outline-none font-medium"
            required
          >
        </div>

        <div>
          <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2 ml-1">Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="ejemplo@correo.com"
            class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-4 text-app-text transition-all focus:border-purple-500 outline-none font-medium"
            required
          >
        </div>

        <div>
          <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2 ml-1">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-4 text-app-text transition-all focus:border-purple-500 outline-none font-medium"
            required
          >
        </div>

        <div v-if="auth.error" class="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest animate-shake flex items-center justify-between">
          <span>{{ auth.error }}</span>
          <button @click="auth.error = null" type="button" class="ml-2 text-red-400 hover:text-red-600 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <button 
          type="submit" 
          :disabled="auth.loading"
          class="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-xl shadow-purple-500/20"
        >
          {{ auth.loading ? 'Registrando...' : 'Empezar ahora' }}
        </button>

        <p class="text-center text-app-text-muted text-xs font-black uppercase tracking-widest">
          ¿Ya tienes cuenta? 
          <router-link to="/login" class="text-purple-600 dark:text-purple-400 hover:underline transition-colors">Inicia sesión</router-link>
        </p>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const nombre = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const handleRegister = async () => {
  const success = await auth.register({ 
    nombre: nombre.value, 
    email: email.value, 
    password: password.value 
  })
  if (success) {
    router.push('/dashboard')
  }
}
</script>
