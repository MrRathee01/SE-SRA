<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar -->
      <AppSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        <router-view />
      </main>
    </div>

    <!-- Global Toast Container -->
    <ToastContainer />

    <!-- Global TA Assignment Wizard Modal -->
    <TaAssignmentWizard />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '../components/common/AppHeader.vue'
import AppSidebar from '../components/common/AppSidebar.vue'
import ToastContainer from '../components/common/ToastContainer.vue'
import TaAssignmentWizard from '../components/modals/TaAssignmentWizard.vue'

const sidebarOpen = ref(false)
</script>

