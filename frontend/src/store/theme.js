import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    // Initial state from localStorage or system preference
    const theme = ref(localStorage.getItem('theme') || 'dark')

    // Apply the theme to the document
    const applyTheme = (newTheme) => {
        const root = document.documentElement
        if (newTheme === 'dark') {
            root.classList.add('dark')
            root.classList.remove('light')
        } else {
            root.classList.add('light')
            root.classList.remove('dark')
        }
        localStorage.setItem('theme', newTheme)
    }

    // Toggle theme
    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark'
        applyTheme(theme.value)
    }

    // Initialize theme on store creation
    applyTheme(theme.value)

    return {
        theme,
        toggleTheme
    }
})
