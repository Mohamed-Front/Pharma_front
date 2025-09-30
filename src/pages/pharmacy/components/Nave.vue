<template>
  <nav class="bg-white shadow-lg w-full ">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Main Menu Section -->
        <div class="flex items-center">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <img class="h-10 w-auto" src="../../../assets/navelogo.png" alt="Pharma Bank Logo">
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center lg:mx-4 space-x-4 space-x-reverse ml-10">
            <a href="/" class="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md font-medium">
              {{ t('navbar.home') }}
            </a>
            <a href="/pharmacy-categories" class="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md font-medium">
              {{ t('navbar.categories') }}
            </a>
            <a href="/pharmacy-warehouses" class="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md font-medium">
              {{ t('navbar.warehouses') }}
            </a>
             <a href="/pharmacy-offers" class="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md font-medium">
              {{ t('navbar.offers') }}
            </a>
              <a v-if="authStore.pharmacyauthenticated" href="/pharmacy-orders" class="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md font-medium">
              {{ t('navbar.orders') }}
            </a>

            <a v-if="authStore.pharmacyauthenticated"  href="/pharmacy-profile" class="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md font-medium">
              {{ t('navbar.profile') }}
            </a>
            <a href="/pharmacy-contact-us" class="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md font-medium">
              {{ t('navbar.contact') }}
            </a>
          </div>
        </div>

        <!-- Icons, Login Button, and Language Dropdown Section -->
        <div class="flex items-center space-x-4 space-x-reverse">
          <!-- Shopping Cart Icon -->
          <a v-if="authStore.pharmacyauthenticated" href="/cart" class="p-2 text-gray-800 hover:text-green-600 focus:outline-none">
            <i class="pi pi-shopping-cart text-xl"></i>
          </a>
          <!-- Notification Icon -->
          <button v-if="authStore.pharmacyauthenticated" class="p-2 text-gray-800 hover:text-green-600 focus:outline-none">
            <i class="pi pi-bell text-xl"></i>
          </button>
          <!-- Login Button -->
          <a v-if="!authStore.pharmacyauthenticated" href="/auth/login" class="bg-green-600 mx-4 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition-colors hover:bg-green-700">

            <i class="pi pi-sign-in text-sm"></i>
          </a>
          <!-- Language Dropdown -->
          <LocaleSelect></LocaleSelect>
          <!-- Mobile Menu Button -->
          <button @click="toggleMobileMenu" class="p-2 rounded-md text-gray-800 hover:text-green-600 md:hidden focus:outline-none">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="mobileMenuOpen" class="md:hidden transition-all duration-300 ease-in-out origin-top-right">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a href="/" class="text-gray-800 hover:text-green-600 block px-3 py-2 rounded-md font-medium">
          {{ t('navbar.home') }}
        </a>
        <a href="/pharmacy-categories" class="text-gray-800 hover:text-green-600 block px-3 py-2 rounded-md font-medium">
          {{ t('navbar.categories') }}
        </a>
        <a href="/pharmacy-warehouses" class="text-gray-800 hover:text-green-600 block px-3 py-2 rounded-md font-medium">
          {{ t('navbar.warehouses') }}
        </a>
          <a href="/pharmacy-offers" class="text-gray-800 hover:text-green-600 block px-3 py-2 rounded-md font-medium">
          {{ t('navbar.offers') }}
        </a>

          <a  v-if="authStore.pharmacyauthenticated" href="/pharmacy-orders" class="text-gray-800 hover:text-green-600 block px-3 py-2 rounded-md font-medium">
          {{ t('navbar.orders') }}
        </a>
        <a v-if="authStore.pharmacyauthenticated" href="/pharmacy-profile" class="text-gray-800 hover:text-green-600 block px-3 py-2 rounded-md font-medium">
          {{ t('navbar.profile') }}
        </a>
        <a href="/pharmacy-contact-us" class="text-gray-800 hover:text-green-600 block px-3 py-2 rounded-md font-medium">
          {{ t('navbar.contact') }}
        </a>
        <a v-if="!authStore.pharmacyauthenticated" href="/auth/login" class="text-gray-800 hover:text-green-600 block px-3 py-2 rounded-md font-medium">

        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import 'primeicons/primeicons.css';
import LocaleSelect from '../../../components/LocaleSelect.vue';
import { useAuthStore } from '@/stores/auth';

// Localization
const { t } = useI18n();

// Initialize the auth store
const authStore = useAuthStore();

// State for the mobile menu visibility
const mobileMenuOpen = ref(false);

// Function to toggle the mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>
