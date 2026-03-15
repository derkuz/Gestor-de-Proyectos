<template>
  <div class="bg-app-secondary border-4 border-app-border p-6 overflow-hidden flex flex-col h-full min-h-[500px] transition-colors shadow-[8px_8px_0px_0px_rgba(0,255,65,0.1)]">
      <div v-if="tasksWithDates.length === 0" class="flex-1 flex flex-col items-center justify-center text-app-text-muted py-10">
         <svg class="w-12 h-12 text-app-text-muted/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
         <p class="font-black uppercase tracking-widest text-xs mb-2">No hay tareas con fechas asignadas.</p>
         <p class="text-xs font-medium">Edita tus tareas y añádeles fechas para visualizarlas en el cronograma.</p>
      </div>
      
      <div v-else class="flex-1 overflow-auto custom-scrollbar relative border-2 border-app-border bg-app-bg/20">
         <div class="inline-block min-w-full">
             <!-- Headers (Days) -->
             <div class="flex border-b border-app-border sticky top-0 bg-app-surface/95 backdrop-blur-xl z-20">
                <!-- Frozen Task Name Column -->
                <div class="w-64 shrink-0 p-4 border-r border-app-border font-black text-[10px] text-app-text-muted uppercase tracking-widest sticky left-0 bg-app-surface/95 backdrop-blur-xl z-30 flex items-center">
                   Actividades del Proyecto
                </div>
                
                <!-- Timeline Days -->
                <div class="flex">
                   <div 
                     v-for="day in daysArray" 
                     :key="day.toISOString()" 
                     class="w-12 shrink-0 flex flex-col items-center justify-center py-2 border-r border-app-border/50" 
                     :class="isToday(day) ? 'bg-blue-600/10' : ''"
                   >
                      <span class="text-[8px] uppercase font-black text-app-text-muted">{{ getDayName(day) }}</span>
                      <span class="text-xs font-black" :class="isToday(day) ? 'text-blue-600 dark:text-blue-400' : 'text-app-text'">{{ day.getDate() }}</span>
                   </div>
                </div>
             </div>
             
             <!-- Rows -->
             <div class="relative">
                <!-- Grid background lines -->
                <div class="absolute inset-0 flex ml-64 pointer-events-none z-0">
                    <div v-for="day in daysArray" :key="'grid-'+day.toISOString()" class="w-12 shrink-0 border-r border-app-border/20 h-full" :class="isToday(day) ? 'bg-blue-600/5' : ''"></div>
                </div>
                
                <!-- Task Rows iterations -->
                <div v-for="task in tasksWithDates" :key="task.id" class="flex border-b border-app-border/50 hover:bg-app-bg/30 transition-colors relative group">
                   
                   <!-- Sticky Task Info Column -->
                   <div class="w-64 shrink-0 p-4 border-r border-app-border sticky left-0 bg-app-surface group-hover:bg-app-bg transition-colors z-20 flex flex-col justify-center">
                      <span class="text-xs font-bold text-app-text truncate pr-2 w-full block" :title="task.nombre">{{ task.nombre }}</span>
                      <div class="flex items-center space-x-2 mt-1.5 w-full overflow-hidden">
                         <span class="text-[8px] uppercase font-black px-1.5 py-0.5 shrink-0 border-2" :class="getPriorityTextClass(task.prioridad)">{{ task.prioridad }}</span>
                         <!-- Assigned users preview -->
                         <div class="flex -space-x-1 shrink-0">
                            <div v-for="user in (task.asignados || []).slice(0,3)" :key="user?.id" class="w-4 h-4 border border-app-text bg-app-text flex items-center justify-center text-[6px] font-black text-app-bg uppercase" :title="user?.nombre || 'Usuario'">
                               {{ (user?.nombre || '??').slice(0, 2) }}
                            </div>
                            <div v-if="(task.asignados?.length || 0) > 3" class="w-4 h-4 border border-app-border bg-app-secondary flex items-center justify-center text-[5px] font-black text-app-text-secondary">
                              +{{ task.asignados.length - 3 }}
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <!-- Gantt Bar Area -->
                   <div class="relative flex-1 py-3" :style="{ width: `${totalDays * 48}px`, minWidth: `${totalDays * 48}px` }">
                       <div 
                          :style="getTaskStyle(task)" 
                          class="absolute h-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] flex items-center px-3 overflow-hidden border-2 border-white/20 hover:brightness-110 transition-all z-10 top-0 bottom-0 my-auto group/bar select-none"
                          :class="[getStatusBgClass(task.estado), isDragging && dragTask?.id === task.id ? 'opacity-90 z-30 cursor-grabbing shadow-2xl scale-[1.02]' : 'cursor-grab']"
                          :title="`Inicio: ${formatDate(task.fechaInicio)}\nFin: ${formatDate(task.fechaFin)}\nEstado: ${task.estado}`"
                          @mousedown="startDrag($event, task, 'move')"
                       >
                          <!-- Progress Overlay -->
                          <div v-if="task.subtareas && task.subtareas.length > 0" class="absolute left-0 top-0 bottom-0 bg-black/10 pointer-events-none" :style="{ width: `${getTaskProgress(task)}%` }"></div>
                          
                          <span class="text-[9px] font-black uppercase tracking-widest text-white truncate z-10 pointer-events-none drop-shadow-sm">
                             {{ task.estado }} 
                             <span v-if="task.subtareas && task.subtareas.length > 0">({{ Math.round(getTaskProgress(task)) }}%)</span>
                          </span>
                          
                          <!-- Resizers -->
                          <div class="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-white/20 z-20" @mousedown.stop="startDrag($event, task, 'start')"></div>
                          <div class="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-white/20 z-20" @mousedown.stop="startDrag($event, task, 'end')"></div>
                       </div>
                   </div>
                </div>
             </div>
         </div>
      </div>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import { useTaskStore } from '../store/tasks'

const taskStore = useTaskStore()

const tasksWithDates = computed(() => {
   return taskStore.tasks.filter(t => !t.esSubtarea && t.fechaInicio && t.fechaFin).sort((a,b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
})

const earliestDate = computed(() => {
   if (!tasksWithDates.value.length) return new Date()
   const min = new Date(Math.min(...tasksWithDates.value.map(t => new Date(t.fechaInicio).getTime())))
   min.setDate(min.getDate() - 3) // Add padding
   return min
})

const latestDate = computed(() => {
   if (!tasksWithDates.value.length) return new Date()
   const max = new Date(Math.max(...tasksWithDates.value.map(t => new Date(t.fechaFin).getTime())))
   max.setDate(max.getDate() + 5) // Add padding
   return max
})

const totalDays = computed(() => {
   const diffTime = Math.abs(latestDate.value - earliestDate.value)
   return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
})

const daysArray = computed(() => {
   const days = []
   let curr = new Date(earliestDate.value)
   for(let i=0; i<totalDays.value; i++) {
     days.push(new Date(curr))
     curr.setDate(curr.getDate() + 1)
   }
   return days
})

// --- Drag & Drop State ---
const isDragging = ref(false)
const dragType = ref('')
const dragTask = ref(null)
const startX = ref(0)
const dragOffsetDays = ref(0)
// -------------------------

const getTaskStyle = (task) => {
   const start = new Date(task.fechaInicio)
   const end = new Date(task.fechaFin)
   
   start.setHours(0,0,0,0)
   end.setHours(0,0,0,0)

   if (dragTask.value && dragTask.value.id === task.id) {
       let sOffset = 0
       let eOffset = 0
       if (dragType.value === 'move') {
           sOffset = dragOffsetDays.value
           eOffset = dragOffsetDays.value
       } else if (dragType.value === 'start') {
           sOffset = dragOffsetDays.value
       } else if (dragType.value === 'end') {
           eOffset = dragOffsetDays.value
       }
       
       start.setDate(start.getDate() + sOffset)
       end.setDate(end.getDate() + eOffset)
       
       if (dragType.value === 'start' && start > end) {
           start.setTime(end.getTime())
       } else if (dragType.value === 'end' && end < start) {
           end.setTime(start.getTime())
       }
   }
   
   const early = new Date(earliestDate.value)
   early.setHours(0,0,0,0)
   
   const offsetDays = Math.max(0, (start - early) / (1000 * 60 * 60 * 24))
   const durationDays = Math.max(1, (end - start) / (1000 * 60 * 60 * 24) + 1)
   
   return {
      left: `${offsetDays * 48}px`,
      width: `${durationDays * 48}px`
   }
}

const getTaskProgress = (task) => {
   if (!task.subtareas || task.subtareas.length === 0) return 0
   const finished = task.subtareas.filter(s => s.estado === 'Finalizado').length
   return (finished / task.subtareas.length) * 100
}

const onDrag = (event) => {
   if (!isDragging.value || !dragTask.value) return
   
   const dx = event.clientX - startX.value
   dragOffsetDays.value = Math.round(dx / 48) // 48px per day 
}

const endDrag = async (event) => {
    if (dragTask.value && dragOffsetDays.value !== 0) {
        const start = new Date(dragTask.value.fechaInicio)
        const end = new Date(dragTask.value.fechaFin)
        
        start.setHours(0,0,0,0)
        end.setHours(0,0,0,0)
        
        let sOffset = 0
        let eOffset = 0
        if (dragType.value === 'move') {
            sOffset = dragOffsetDays.value
            eOffset = dragOffsetDays.value
        } else if (dragType.value === 'start') {
            sOffset = dragOffsetDays.value
        } else if (dragType.value === 'end') {
            eOffset = dragOffsetDays.value
        }
        
        start.setDate(start.getDate() + sOffset)
        end.setDate(end.getDate() + eOffset)
        
        if (dragType.value === 'start' && start > end) {
            start.setTime(end.getTime())
        } else if (dragType.value === 'end' && end < start) {
            end.setTime(start.getTime())
        }
        
        // Optimistic update
        dragTask.value.fechaInicio = start.toISOString().split('T')[0]
        dragTask.value.fechaFin = end.toISOString().split('T')[0]
        
        await taskStore.updateTask(dragTask.value.id, { 
             fechaInicio: dragTask.value.fechaInicio,
             fechaFin: dragTask.value.fechaFin
        })
    }
    
    isDragging.value = false
    dragTask.value = null
    dragOffsetDays.value = 0
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', endDrag)
}

const startDrag = (event, task, type) => {
   event.stopPropagation()
   isDragging.value = true
   dragType.value = type
   dragTask.value = task
   startX.value = event.clientX
   dragOffsetDays.value = 0
   
   document.addEventListener('mousemove', onDrag)
   document.addEventListener('mouseup', endDrag)
}

const isToday = (date) => {
  const today = new Date()
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear()
}

const getDayName = (date) => {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  return days[date.getDay()]
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const getPriorityTextClass = (priority) => {
  switch (priority) {
    case 'CRITICA': return 'text-red-600 dark:text-red-400 border-red-500/20 bg-red-500/10'
    case 'ALTA': return 'text-orange-600 dark:text-orange-400 border-orange-500/20 bg-orange-500/10'
    case 'MEDIA': return 'text-blue-600 dark:text-blue-400 border-blue-500/20 bg-blue-500/10'
    default: return 'text-app-text-muted border-app-border bg-app-bg'
  }
}

const getStatusBgClass = (status) => {
  switch (status) {
    case 'Finalizado': return 'bg-green-600/80 dark:bg-green-500/80'
    case 'Bloqueado': return 'bg-red-600/80 dark:bg-red-500/80'
    case 'En Desarrollo': return 'bg-blue-600/80 dark:bg-blue-500/80'
    default: return 'bg-slate-600/80 dark:bg-slate-500/80'
  }
}

onUnmounted(() => {
   document.removeEventListener('mousemove', onDrag)
   document.removeEventListener('mouseup', endDrag)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.4);
}
</style>

