import { defineStore } from 'pinia'
import axios from 'axios'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as PusherPushNotifications from '@pusher/push-notifications-web'

export const useAuthStore = defineStore('Auth', {
  state: () => ({
    adminauthUser: useStorage('authUser', {}),
    warehousauthUser: useStorage('authUser', {}),
    pharmacyauthUser: useStorage('authUser', {}),
    adminauthenticated: useStorage('adminauthenticated', false),
    pharmacyauthenticated: useStorage('pharmacyauthenticated', false),
    warehouseauthenticated: useStorage('warehouseauthenticated', false),
    userPermissions: useStorage('userPermissions', []),
    type: useStorage('type', ''),
    authErrors: [],
    admintoken: useStorage('admintoken', null),
    warehoustoken: useStorage('warehoustoken', null),
    pharmacytoken: useStorage('pharmacytoken', null),
    loading: ref(false),
    router: useRouter(),
  }),
  getters: {
    user: (state) => state.authUser,
    permissions: (state) => state.userPermissions,
    errors: (state) => state.authErrors,
    successMsg: (state) => state.msg,
  },
  actions: {

    async handleLogin(data) {
      this.authErrors = ["Invalid credentials. Please try again."]
      this.loading = true

      try {
        const response = await axios.post('/api/login', {
          phone: data.phone,
          password: data.password,
        })

        if (response.data.data?.access_token) {


          this.type = response.data.data.user.type
          if(response.data.data.user.type == 1){
          this.router.push({ name: 'dashboard' })
          this.adminauthenticated=true
          this.adminauthUser=response.data.data.user
          this.admintoken=response.data.data.access_token
          this.warehoustoken=''
          this.warehouseauthenticated=false
          this.userPermissions = response.data.data.user.permissions


          }
          if(response.data.data.user.type == 2){
          this.userPermissions = response.data.data.user.permissions
          this.warehoustoken=response.data.data.access_token
          this.warehouseauthenticated=true
          this.router.push({ name: 'warehouse_dashboard' })
          this.admintoken=''
          this.adminauthenticated=false


          }
         if(response.data.data.user.type == 3){
          this.router.push({ name: 'home' })
          this.pharmacyauthenticated=true
          this.pharmacyauthUser=response.data.data.user
          this.pharmacytoken=response.data.data.access_token
          }


        } else {
          this.authErrors = ["Invalid credentials. Please try again."]
        }
      } catch (error) {
        if (error.response) {
          // Handle server validation errors
          if (error.response.status === 422) {
            this.authErrors = error.response.data.errors
              ? Object.values(error.response.data.errors).flat()
              : ["Validation failed. Please check your inputs."]
          } else if (error.response.status === 401) {
            this.authErrors = "Invalid email or password."
          } else {
            this.authErrors = [error.response.data.message || "An error occurred during login."]
          }
        } else if (error.request) {
          // The request was made but no response was received
          this.authErrors = ["Network error. Please check your connection."]
        } else {

        }
      }
    },
    async handleRegister(data) {
      if (this.loading) return
      this.resetAuthStore()
      this.loading = true
      try {
        const response = await axios.post('/api/register', {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        })
        this.authenticated = true
        this.token = response.data.token
        this.authUser = response.data.user
        this.router.push({ name: 'home' })
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ["Validation failed. Please check your inputs."]
        } else {
          this.authErrors = [error.response?.data?.message || "Registration failed. Please try again."]
        }
      } finally {
        this.loading = false
      }
    },
    async pharmacyhandleLogout() {
          this.pharmacyauthenticated=false
          this.pharmacyauthUser={}
          this.pharmacytoken=''
          this.type= '',
          this.router.push({ name: 'home' })
          this.authErrors = []
          this.loading = false
    },
      async warehoushandleLogout() {
          this.warehouseauthenticated=false
          this.warehousauthUser={}
          this.warehoustoken=''
          this.type= '',
          this.router.push({ name: 'warehouse_dashboard' })
          this.authErrors = []
          this.loading = false
    },
      async adminhandleLogout() {
          this.adminauthenticated=false
          this.adminauthUser={}
          this.admintoken=''
          this.type= '',
          this.router.push({ name: 'dashboard' })
          this.authErrors = []
          this.loading = false
    },



    // resetAuthStore() {
    //   this.adminauthUser = {}
    //   this.warehousauthUser = {}
    //   this.pharmacyauthUser = {}
    //   this.adminauthenticated = false
    //   this.pharmacyauthenticated = false
    //   this.warehouseauthenticated = false
    //   this.pharmacyauthenticated=false
    //   this.type= '',
    //   this.admintoken= null,
    //   this.warehoustoken= null,
    //   this.pharmacytoken= null,
    //   this.userPermissions = null
    //   this.authErrors = []
    //   this.msg = ''
    //   this.loading = false

    // },
  },
})
