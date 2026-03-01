<template>
  <div class="min-h-screen bg-slate-900 overflow-hidden relative flex items-center justify-center p-4">
    <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
    <div class="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

    <div class="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative z-10">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
          Crear Cuenta
        </h1>
        <p class="text-slate-400 font-medium">Únete a GPPT</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-slate-300 mb-2 ml-1">Nombre</label>
          <input 
            v-model="nombre" 
            type="text" 
            placeholder="Tu nombre"
            class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white transition-all focus:ring-2 focus:ring-purple-500/50"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-300 mb-2 ml-1">Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="ejemplo@correo.com"
            class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white transition-all focus:ring-2 focus:ring-purple-500/50"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-300 mb-2 ml-1">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white transition-all focus:ring-2 focus:ring-purple-500/50"
            required
          >
        </div>

        <div v-if="auth.error" class="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-2xl text-sm font-medium animate-shake">
          {{ auth.error }}
        </div>

        <button 
          type="submit" 
          :disabled="auth.loading"
          class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {{ auth.loading ? 'Registrando...' : 'Empezar ahora' }}
        </button>

        <p class="text-center text-slate-400 text-sm font-medium">
          ¿Ya tienes cuenta? 
          <router-link to="/login" class="text-purple-400 hover:text-purple-300 transition-colors">Inicia sesión</router-link>
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
