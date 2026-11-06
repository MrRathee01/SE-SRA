<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-slate-900 font-sans selection:bg-navy-800 selection:text-white flex flex-col justify-between relative overflow-hidden">
    
    <!-- Ambient Background Blobs -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
    <div class="absolute top-1/2 -right-32 w-[32rem] h-[32rem] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none -z-10"></div>
    <div class="absolute -bottom-24 left-1/3 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

    <!-- Top Minimal Navigation -->
    <header class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex items-center justify-between z-20">
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 via-navy-700 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-navy-900/15 group-hover:scale-105 transition-transform">
          <GraduationCap class="w-6 h-6 text-white" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl font-extrabold tracking-tight text-slate-900">Edu<span class="text-blue-600">Sight</span></span>
            <span class="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              IITM BS
            </span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium hidden sm:block">Academic Risk Identification & Intervention</p>
        </div>
      </router-link>

      <router-link
        to="/"
        class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-navy-900 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-xs backdrop-blur-sm transition-all"
      >
        <ArrowLeft class="w-4 h-4 text-slate-500" />
        <span>Back to Home</span>
      </router-link>
    </header>

    <!-- Main Content Container (Vertically centered slightly upward for clean balance) -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-center w-full z-10 -mt-2 sm:-mt-6">
      <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        <!-- Left Side: Brand Story & High-Impact Team Showcase -->
        <div class="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-5 pr-2">
          
          <div class="space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-200 shadow-xs text-xs font-semibold text-blue-900">
              <span class="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>IIT Madras BS Degree in Data Science & Applications</span>
            </div>

            <h1 class="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Welcome Back to <span class="bg-gradient-to-r from-blue-700 via-navy-800 to-indigo-700 bg-clip-text text-transparent">EduSight</span>
            </h1>

            <p class="text-sm text-slate-600 leading-relaxed max-w-lg">
              Sign in to monitor whole-learner progression, resolve prerequisite bottlenecks, and coordinate timely mentoring interventions.
            </p>
          </div>

          <!-- 3D Team Illustration Card (Expansive 700-800px showcase) -->
          <div class="relative bg-gradient-to-tr from-blue-50/90 via-white to-indigo-50/60 rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xl overflow-hidden w-full max-w-[760px]">
            <!-- Soft ambient glow -->
            <div class="absolute -right-10 -bottom-10 w-56 h-56 bg-blue-200/40 rounded-full blur-2xl pointer-events-none"></div>

            <img 
              src="/ui/diverse-team.png" 
              alt="EduSight Team"
              class="w-full max-w-[720px] mx-auto object-contain drop-shadow-xl"
            />
          </div>

        </div>

        <!-- Right Side: Clean Modern Login Card -->
        <div class="w-full lg:col-span-6 max-w-md mx-auto">
          <div class="bg-white/95 backdrop-blur-md rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-2xl shadow-slate-900/10">
            
            <div class="mb-6">
              <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Portal Authentication</h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">
                Select your academic role or enter your credentials below.
              </p>
            </div>

            <!-- Quick 1-Click Role Switcher Tabs (Highlighted) -->
            <div class="mb-6">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Select 1-Click Role Demo</span>
                <span class="text-[10px] text-blue-600 font-semibold normal-case">Instant fill</span>
              </label>

              <div class="grid grid-cols-3 gap-2">
                
                <!-- Student Demo Pill -->
                <button
                  type="button"
                  @click="selectDemo('student@demo.com')"
                  :class="[
                    'py-2.5 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1',
                    email === 'student@demo.com' 
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs font-bold' 
                      : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  ]"
                >
                  <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div class="text-xs font-bold leading-tight">Student</div>
                  <div class="text-[10px] text-slate-500 truncate max-w-[85px]">Aditya V.</div>
                </button>

                <!-- TA Demo Pill -->
                <button
                  type="button"
                  @click="selectDemo('ta@demo.com')"
                  :class="[
                    'py-2.5 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1',
                    email === 'ta@demo.com' 
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs font-bold' 
                      : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  ]"
                >
                  <div class="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    T
                  </div>
                  <div class="text-xs font-bold leading-tight">TA Hub</div>
                  <div class="text-[10px] text-slate-500 truncate max-w-[85px]">Dr. Priya R.</div>
                </button>

                <!-- Admin Demo Pill -->
                <button
                  type="button"
                  @click="selectDemo('admin@demo.com')"
                  :class="[
                    'py-2.5 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1',
                    email === 'admin@demo.com' 
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs font-bold' 
                      : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  ]"
                >
                  <div class="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <div class="text-xs font-bold leading-tight">Admin</div>
                  <div class="text-[10px] text-slate-500 truncate max-w-[85px]">Coord. Cell</div>
                </button>

              </div>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="space-y-4">
              
              <!-- Email Input -->
              <div>
                <label for="email" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Institutional Email
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail class="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    required
                    class="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-xl shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-navy-800 text-sm bg-slate-50/50 hover:bg-white transition-colors"
                    placeholder="name@demo.com"
                  />
                </div>
              </div>

              <!-- Password Input -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label for="password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Portal Password
                  </label>
                  <span class="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline" @click="password = 'password123'">
                    Demo: password123
                  </span>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock class="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-navy-800 text-sm bg-slate-50/50 hover:bg-white transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <Eye v-if="!showPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Remember Me & Policy Note -->
              <div class="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked class="rounded border-slate-300 text-navy-800 focus:ring-navy-800 w-3.5 h-3.5" />
                  <span>Remember this browser</span>
                </label>
                <span class="text-[11px] text-slate-400">IITM BS Policy Enforced</span>
              </div>

              <!-- Primary Submit Button -->
              <div class="pt-2">
                <button
                  type="submit"
                  class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-navy-900 via-navy-800 to-blue-700 hover:from-navy-950 hover:to-blue-800 text-white font-semibold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-navy-900/15 hover:shadow-xl hover:shadow-navy-900/25 transition-all transform active:scale-95"
                >
                  <span>Sign In to Portal</span>
                  <ArrowRight class="w-4 h-4" />
                </button>
              </div>

            </form>

            <!-- Bottom Disclaimer -->
            <div class="mt-6 pt-5 border-t border-slate-100 text-center">
              <p class="text-[11px] text-slate-400 leading-relaxed">
                Local offline simulation running on simulated IIT Madras BS Program datasets. All academic records are maintained in browser local storage.
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>

    <!-- Bottom Minimal Footer -->
    <footer class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200/60 z-20 gap-2">
      <div>© 2026 IIT Madras BS Degree Academic Coordination Cell.</div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useToastStore } from '../../stores/toastStore'
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const email = ref('student@demo.com')
const password = ref('password123')
const showPassword = ref(false)

function selectDemo(demoEmail) {
  email.value = demoEmail
  password.value = 'password123'
  handleLogin()
}

function handleLogin() {
  const result = authStore.login(email.value, password.value)
  if (result.success) {
    toast.success(`Welcome to the IITM BS Platform as ${result.role.toUpperCase()}!`)
    router.push(result.redirect)
  }
}
</script>
