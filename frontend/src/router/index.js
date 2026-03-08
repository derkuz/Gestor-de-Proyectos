import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: { guest: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue'),
        meta: { guest: true },
    },
    {
        path: '/dashboard',
        component: () => import('../layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue'),
            },
            {
                path: '/projects',
                name: 'Projects',
                component: () => import('../views/Projects.vue'),
            },
            {
                path: '/projects/:id',
                name: 'ProjectDetails',
                component: () => import('../views/ProjectDetails.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/projects/:id/documentation/:docId',
                name: 'DocumentEditor',
                component: () => import('../views/DocumentEditor.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: '/tickets',
                name: 'Tickets',
                component: () => import('../views/Tickets.vue'),
            },
            {
                path: '/admin',
                name: 'AdminPanel',
                component: () => import('../views/AdminPanel.vue'),
                meta: { requiresAuth: true, adminOnly: true }
            },
            {
                path: '/faq',
                name: 'FAQ',
                component: () => import('../views/FAQ.vue'),
                meta: { requiresAuth: true }
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next('/login');
    } else if (to.meta.adminOnly && !auth.isAdmin) {
        next('/dashboard');
    } else if (to.meta.superAdminOnly && !auth.isSuperAdmin) {
        next('/dashboard');
    } else if (to.meta.guest && auth.isAuthenticated) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;
