<template>
  <div class="min-h-screen bg-app-bg overflow-hidden relative flex items-center justify-center p-4">
    <!-- Retro Scanlines Background -->
    <div class="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]"></div>

    <div class="w-full max-w-md bg-app-secondary border-4 border-app-border p-10 shadow-[10px_10px_0px_0px_rgba(0,255,65,0.1)] relative z-10">
      <div class="text-center mb-8 border-b-2 border-app-border pb-6">
        <h1 class="text-4xl font-black text-app-text mb-2 uppercase tracking-widest">
          NUEVO_USUARIO
        </h1>
        <p class="text-app-text-secondary font-black uppercase tracking-widest text-[10px]">> REGISTRO_EN_EL_SISTEMA</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-[10px] font-black text-app-text uppercase tracking-widest mb-2 ml-1">> NOMBRE_COMPLETO</label>
          <input 
            v-model="nombre" 
            type="text" 
            placeholder="NOMBRE_REAL..."
            class="w-full bg-app-secondary border-2 border-app-border px-6 py-4 text-app-text placeholder-app-text-secondary/30 outline-none transition-all uppercase tracking-widest"
            required
          >
        </div>

        <div>
          <label class="block text-[10px] font-black text-app-text uppercase tracking-widest mb-2 ml-1">> EMAIL_SISTEMA</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="USER@SYS.COM"
            class="w-full bg-app-secondary border-2 border-app-border px-6 py-4 text-app-text placeholder-app-text-secondary/30 outline-none transition-all uppercase tracking-widest"
            required
          >
        </div>

        <div class="relative group">
          <label class="block text-[10px] font-black text-app-text uppercase tracking-widest mb-2 ml-1">> CLAVE_ACCESO</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="********"
              class="w-full bg-app-secondary border-2 border-app-border px-6 py-4 text-app-text placeholder-app-text-secondary/30 outline-none transition-all tracking-widest pr-14"
              required
            >
            <button 
              @click="showPassword = !showPassword" 
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-app-text hover:text-white transition-colors p-2"
              title="MOSTRAR/OCULTAR"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.046m2.458-2.458A10.012 10.012 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-4.293 5.707M10 14a3 3 0 114-4M4.929 4.929l14.142 14.142" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="auth.error" class="bg-app-secondary border-2 border-red-500 text-red-500 px-6 py-4 font-black uppercase tracking-widest text-[10px] animate-shake flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(239,68,68,0.2)]">
          <span>[!] {{ auth.error }}</span>
          <button @click="auth.error = null" type="button" class="ml-2 hover:bg-red-500 hover:text-white transition-colors border-2 border-red-500 px-1">X</button>
        </div>

        <button 
          type="submit" 
          :disabled="auth.loading"
          class="w-full py-5 px-6 border-4 border-app-text bg-app-text text-app-bg font-black uppercase tracking-[0.2em] text-xs hover:bg-app-secondary hover:text-app-text transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!auth.loading">[ CREAR_CUENTA ]</span>
          <span v-else class="animate-pulse">PROCESANDO...</span>
        </button>

        <p class="text-center text-app-text-secondary text-[10px] font-black uppercase tracking-widest mt-4">
          ¿YA TIENES CUENTA? 
          <router-link to="/login" class="text-app-text underline hover:no-underline transition-all">INICIA_SESIÓN</router-link>
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
const showPassword = ref(false)
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
