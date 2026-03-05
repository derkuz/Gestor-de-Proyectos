<template>
  <div class="min-h-screen bg-app-bg overflow-hidden relative flex items-center justify-center p-4 transition-colors duration-500">
    <!-- Animated Background Blobs -->
    <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-blob"></div>
    <div class="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-blob animation-delay-2000"></div>
    <div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20 animate-blob animation-delay-4000"></div>

    <div class="w-full max-w-md bg-app-surface backdrop-blur-xl border border-app-border rounded-[2.5rem] p-10 shadow-2xl relative z-10 transition-colors">
      <div class="text-center mb-10">
        <h1 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 mb-2 tracking-tighter">
          PRISMA
        </h1>
        <p class="text-app-text-muted font-black uppercase tracking-widest text-[10px]">Gestión inteligente de proyectos</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2 ml-1">Email de usuario</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="ejemplo@correo.com"
            class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-4 text-app-text placeholder-app-text-muted/50 focus:border-purple-500 outline-none transition-all font-medium"
            required
          >
        </div>

        <div class="relative group">
          <label class="block text-xs font-black text-app-text-muted uppercase tracking-widest mb-2 ml-1">Contraseña</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••"
              class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-4 text-app-text placeholder-app-text-muted/50 focus:border-purple-500 outline-none transition-all font-medium pr-14"
              required
            >
            <button 
              @click="showPassword = !showPassword" 
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-app-text-muted hover:text-purple-500 transition-colors p-2"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
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
          class="w-full group relative flex items-center justify-center py-5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-xl shadow-purple-500/20"
        >
          <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer"></div>
          <span v-if="!auth.loading">Entrar al Sistema</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </span>
        </button>

        <p class="text-center text-app-text-muted text-xs font-black uppercase tracking-widest">
          ¿No tienes cuenta? 
          <router-link to="/register" class="text-purple-600 dark:text-purple-400 hover:underline transition-colors">Regístrate</router-link>
        </p>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  const success = await auth.login(email.value, password.value)
  if (success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob {
  0% { transform: scale(1); }
  33% { transform: scale(1.1) translate(30px, -50px); }
  66% { transform: scale(0.9) translate(-20px, 20px); }
  100% { transform: scale(1); }
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
