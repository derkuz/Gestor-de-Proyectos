<template>
  <div class="faq-container space-y-10 animate-fade-in">
    <header>
      <h2 class="text-3xl font-black text-slate-900 dark:text-white">Centro de Ayuda PRISMA</h2>
      <p class="text-slate-500 dark:text-slate-400 mt-2">Manuales de usuario y preguntas frecuentes según tu nivel de acceso.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Filtros de Roles (Solo visibles para quienes tienen el rol o superior) -->
      <aside class="md:col-span-1 space-y-4">
        <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Guías Disponibles</h4>
        <nav class="space-y-2">
          <button 
            v-for="roleGroup in visibleFaqGroups" 
            :key="roleGroup.id"
            @click="activeGroupId = roleGroup.id"
            :class="activeGroupId === roleGroup.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5'"
            class="w-full text-left p-4 rounded-2xl transition-all font-bold text-sm flex items-center justify-between group"
          >
            {{ roleGroup.title }}
            <svg class="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </nav>
      </aside>

      <!-- Contenido de las FAQ -->
      <main class="md:col-span-2 space-y-6">
        <div v-if="activeGroup" class="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl">
          <div class="flex items-center gap-4 mb-8">
            <div :class="activeGroup.color" class="p-3 rounded-2xl">
              <component :is="activeGroup.icon" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="text-2xl font-black text-slate-900 dark:text-white">{{ activeGroup.title }}</h3>
              <p class="text-sm text-slate-500">{{ activeGroup.description }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div v-for="(item, index) in activeGroup.items" :key="index" class="border-b border-slate-100 dark:border-white/5 last:border-0 pb-4">
              <button 
                @click="toggleItem(index)"
                class="w-full text-left flex justify-between items-center py-4 group"
              >
                <span class="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">{{ item.question }}</span>
                <svg :class="openItems.includes(index) ? 'rotate-180' : ''" class="w-5 h-5 text-slate-400 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <transition name="expand">
                <div v-if="openItems.includes(index)" class="pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3 prose dark:prose-invert max-w-none">
                  <div v-html="item.answer"></div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, h } from 'vue';
import { useAuthStore } from '../store/auth';

const authStore = useAuthStore();
const activeGroupId = ref('external');
const openItems = ref([]);

// SVG Icon Component Helper
const createIcon = (path, viewBox = "0 0 24 24") => ({
  render: () => h('svg', { 
    fill: 'none', 
    viewBox, 
    stroke: 'currentColor',
    innerHTML: path 
  })
})

const ExternalIcon = createIcon('<path stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2"/>')
const ColabIcon = createIcon('<path stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2"/>')
const PMIcon = createIcon('<path stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2"/>')
const AdminIcon = createIcon('<path stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke-width="2"/>')
const SuperIcon = createIcon('<path stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-width="2"/>')

const toggleItem = (index) => {
  if (openItems.value.includes(index)) {
    openItems.value = openItems.value.filter(i => i !== index);
  } else {
    openItems.value.push(index);
  }
};

watch(activeGroupId, () => {
  openItems.value = [];
});

const faqData = [
  {
    id: 'external',
    roleNeeded: 'EXTERNO',
    title: 'Guía del Cliente (Externo)',
    description: 'Cómo reportar incidencias y seguir tus proyectos.',
    color: 'bg-slate-500',
    icon: ExternalIcon,
    items: [
      {
        question: '¿Cómo reporto un problema?',
        answer: 'Ve a la sección <b>Tickets</b> y haz clic en "Nuevo Ticket". Describe tu problema y adjunta una captura de pantalla si es necesario. El equipo recibirá una notificación inmediata.'
      },
      {
        question: '¿Puedo ver el avance de mi proyecto?',
        answer: 'Si has sido invitado a un proyecto, podrás verlo en la sección <b>Proyectos</b>. Tendrás una vista de solo lectura para ver estadísticas y el estado global de las tareas.'
      }
    ]
  },
  {
    id: 'colaborador',
    roleNeeded: 'COLABORADOR',
    title: 'Guía de Colaboradores',
    description: 'Operativa diaria, tareas y soporte.',
    color: 'bg-emerald-500',
    icon: ColabIcon,
    items: [
      {
        question: '¿Cómo gestiono mis tareas?',
        answer: 'En <b>Proyectos</b>, accede a la vista Kanban. Puedes arrastrar tus tareas de "Pendiente" a "En Progreso" y finalmente a "Finalizado". No olvides usar las subtareas para desglosar trabajos complejos.'
      },
      {
        question: '¿Por qué puedo responder algunos tickets y otros no?',
        answer: 'Para responder tickets de terceros, debes estar <b>autorizado</b> en esa categoría por un Administrador. Si estás autorizado, verás el botón "Responder" en el listado de tickets.'
      }
    ]
  },
  {
    id: 'manager',
    roleNeeded: 'PROJECT_MANAGER',
    title: 'Gestión de Proyectos (PM)',
    description: 'Manual para líderes de equipo y gestores.',
    color: 'bg-blue-500',
    icon: PMIcon,
    items: [
      {
        question: '¿Cómo inicio un nuevo proyecto?',
        answer: 'En la sección Proyectos, usa el botón "Nuevo Proyecto". Define el nombre y la descripción. Luego, ve a <b>Administración > Asignaciones</b> para invitar a los colaboradores pertinentes.'
      },
      {
        question: '¿Cómo configuro el tablero Kanban?',
        answer: 'Dentro de cada proyecto, puedes editar las columnas del tablero desde los ajustes del proyecto para adaptar el flujo a tu metodología (ej: To Do, Review, Done).'
      }
    ]
  },
  {
    id: 'admin',
    roleNeeded: 'ADMIN',
    title: 'Administración de Empresa',
    description: 'Configuración de seguridad y negocio corporativo.',
    color: 'bg-indigo-500',
    icon: AdminIcon,
    items: [
      {
        question: '¿Cómo configuro las categorías de tickets?',
        answer: 'En <b>Administración > Tickets</b>, crea categorías con prefijos únicos (ej: SOP para Soporte). Aquí mismo es donde asignas qué Colaboradores serán los especialistas para cada área.'
      },
      {
        question: '¿Cómo doy de alta a un nuevo empleado?',
        answer: 'Ve a <b>Administración > Usuarios</b>. Completa los datos y asígnale el nivel de acceso deseado. Recuerda que puedes suspender cuentas en cualquier momento si es necesario.'
      }
    ]
  },
  {
    id: 'superadmin',
    roleNeeded: 'SUPER_ADMIN',
    title: 'Control Global (Super Admin)',
    description: 'Gestión multitenant y mantenimiento del sistema.',
    color: 'bg-cyan-600',
    icon: SuperIcon,
    items: [
      {
        question: '¿Cómo añadir un nuevo cliente o empresa?',
        answer: 'Desde <b>Administración > Empresas</b>, puedes dar de alta nuevas entidades. Cada empresa tendrá su propio aislamiento total de datos.'
      },
      {
        question: '¿Cómo veo los errores del sistema?',
        answer: 'En <b>Administración > Actividad</b>, tienes acceso a los registros técnicos globales de la plataforma.'
      }
    ]
  }
];

const roleHierarchy = {
  'EXTERNO': 1,
  'COLABORADOR': 2,
  'PROJECT_MANAGER': 3,
  'ADMIN': 4,
  'SUPER_ADMIN': 5
};

const visibleFaqGroups = computed(() => {
  const userRole = authStore.user?.rol || 'EXTERNO';
  const userLevel = roleHierarchy[userRole] || 1;
  
  return faqData.filter(group => {
    const groupLevel = roleHierarchy[group.roleNeeded];
    return userLevel >= groupLevel;
  });
});

const activeGroup = computed(() => {
  return faqData.find(g => g.id === activeGroupId.value);
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; max-height: 500px; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
</style>
