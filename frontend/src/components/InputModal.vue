<template>
  <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-app-bg/80 backdrop-blur-md" @click="handleCancel"></div>
    
    <!-- Modal -->
    <div class="bg-app-surface border border-app-border rounded-[2.5rem] p-8 w-full max-w-md relative z-10 shadow-2xl animate-pop-in flex flex-col transition-colors">
      <h3 class="text-2xl font-black mb-2 text-app-text">{{ title }}</h3>
      <p v-if="description" class="text-app-text-muted mb-6 text-sm font-medium">{{ description }}</p>
      
      <form @submit.prevent="handleConfirm" class="space-y-6">
        <div>
          <label v-if="inputLabel" class="block text-[10px] font-black text-app-text-muted uppercase tracking-widest mb-2">{{ inputLabel }}</label>
          <input 
            v-model="inputValue" 
            ref="inputRef"
            type="text" 
            :placeholder="placeholder"
            required
            class="w-full bg-app-bg border border-app-border rounded-2xl px-6 py-4 text-app-text placeholder-app-text-muted/50 focus:border-purple-500 outline-none transition-all text-sm"
          >
        </div>
        
        <div class="flex space-x-3">
          <button 
            type="button" 
            @click="handleCancel" 
            class="flex-1 py-3.5 font-black uppercase text-[10px] tracking-widest text-app-text-muted hover:text-app-text transition-colors bg-app-bg rounded-xl border border-app-border"
          >
            {{ cancelText }}
          </button>
          <button 
            type="submit" 
            class="flex-1 py-3.5 bg-purple-600 rounded-xl font-black uppercase text-[10px] tracking-widest text-white hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/30"
          >
            {{ confirmText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Ingresar valor'
  },
  description: {
    type: String,
    default: ''
  },
  inputLabel: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Escriba aquí...'
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const inputValue = ref('')
const inputRef = ref(null)

// Focus the input when the modal opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    inputValue.value = ''
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
    })
  }
})

const handleConfirm = () => {
  if (inputValue.value.trim()) {
    emit('confirm', inputValue.value.trim())
    emit('update:modelValue', false)
  }
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
  inputValue.value = ''
}
</script>

<style scoped>
@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-pop-in { 
  animation: pop-in 0.3s cubic-bezier(0, 0, 0.2, 1); 
}
</style>
