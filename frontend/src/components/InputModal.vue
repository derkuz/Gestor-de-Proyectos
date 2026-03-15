<template>
  <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-app-bg/90" @click="handleCancel"></div>
    
    <!-- Modal -->
    <div class="bg-app-secondary border-4 border-app-border p-8 w-full max-w-md relative z-10 shadow-[8px_8px_0px_0px_rgba(0,255,65,0.2)] flex flex-col transition-all">
      <h3 class="text-2xl font-black mb-2 text-app-text uppercase tracking-widest">{{ title }}</h3>
      <p v-if="description" class="text-app-text-secondary mb-6 text-xs font-medium uppercase tracking-widest leading-relaxed">{{ description }}</p>
      
      <form @submit.prevent="handleConfirm" class="space-y-6">
        <div>
          <label v-if="inputLabel" class="block text-[10px] font-black text-app-text uppercase tracking-widest mb-2">{{ inputLabel }}</label>
          <input 
            v-model="inputValue" 
            ref="inputRef"
            type="text" 
            :placeholder="placeholder"
            required
            class="w-full bg-app-secondary border-2 border-app-border px-4 py-3 text-app-text placeholder-app-text-secondary/50 focus:bg-app-text focus:text-app-secondary outline-none transition-all uppercase tracking-widest"
          >
        </div>
        
        <div class="flex space-x-3">
          <button 
            type="button" 
            @click="handleCancel" 
            class="flex-1 py-3 border-2 border-app-border font-black uppercase text-xs tracking-widest text-app-text hover:bg-app-text hover:text-app-secondary transition-colors bg-app-secondary"
          >
            [ {{ cancelText }} ]
          </button>
          <button 
            type="submit" 
            class="flex-1 py-3 bg-app-text border-2 border-app-text font-black uppercase text-xs tracking-widest text-app-bg hover:bg-app-secondary hover:text-app-text transition-all"
          >
            [ {{ confirmText }} ]
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
