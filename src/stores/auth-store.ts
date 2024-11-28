import { defineStore } from 'pinia'

// import { fetchWrapper } from '@/helpers';

import router from '../router/index'

import axios from 'axios'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: '',
  }),
  actions: {
    async login(username: string, password: string) {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        username: username,
        password: password,
      })

      // update pinia state
      this.user = response.data.data

      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(response.data.data))

      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/')
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
      router.push('/auth/login')
    },
  },
})
