<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 font-sans selection:bg-navy-800 selection:text-white">
    <!-- Top Floating Navigation Bar -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <!-- Brand Logo (EduSight + IITM BS) -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 via-navy-700 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-navy-900/10">
            <GraduationCap class="w-6 h-6 text-white" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl font-extrabold tracking-tight text-slate-900">Edu<span class="text-blue-600">Sight</span></span>
              <span class="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                IITM BS Platform
              </span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium hidden sm:block">Academic Risk Identification & Intervention</p>
          </div>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a href="#overview" class="hover:text-blue-600 transition-colors">Platform</a>
          <a href="#features" class="hover:text-blue-600 transition-colors">Features</a>
          <a href="#simulator" class="hover:text-blue-600 transition-colors">Risk Simulator</a>
          <a href="#bottlenecks" class="hover:text-blue-600 transition-colors">Bottleneck Analytics</a>
          <a href="#portals" class="hover:text-blue-600 transition-colors">Portals & Roles</a>
        </nav>

        <!-- Right Action Items -->
        <div class="flex items-center gap-2.5 sm:gap-4">
          <!-- Notification Bell Preview -->
          <button 
            type="button"
            class="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors hidden sm:block"
            @click="quickEnter('student')"
            title="Sample Notifications"
          >
            <Bell class="w-5 h-5" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          <!-- Sign In Button -->
          <router-link
            to="/login"
            class="hidden sm:inline-flex items-center text-sm font-semibold text-slate-700 hover:text-navy-900 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Sign In
          </router-link>

          <!-- Primary Launch Portal Button -->
          <button
            type="button"
            @click="handlePrimaryCta"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-navy-900 via-navy-800 to-blue-700 hover:from-navy-950 hover:to-blue-800 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-navy-900/15 hover:shadow-lg hover:shadow-navy-900/25 transition-all transform active:scale-95"
          >
            <span>{{ authStore.isAuthenticated ? 'Go to Dashboard' : 'Explore Platform' }}</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- HERO SECTION (Inspired by EduSight & Aura Edu) -->
    <section id="overview" class="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      <!-- Background Decorative Blobs -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-blue-100/70 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute top-48 right-0 w-[30rem] h-[30rem] bg-amber-100/50 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div class="absolute bottom-10 left-1/3 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <!-- Left Column: Copy & Actions -->
          <div class="lg:col-span-6 space-y-6">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-200/80 shadow-xs text-xs font-semibold text-blue-900">
              <span class="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>IIT Madras BS Degree In Data Science & Applications</span>
            </div>

            <!-- Big Headline -->
            <h1 class="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Empowering Educators with <span class="bg-gradient-to-r from-blue-700 via-navy-800 to-indigo-700 bg-clip-text text-transparent">Actionable Insights</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Identify at-risk students, understand the <em>why</em>, and take meaningful action — early. A comprehensive intelligence system designed for prerequisite bottlenecks, OPPE exams, and graduation milestone retention.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                @click="handlePrimaryCta"
                class="inline-flex items-center gap-2.5 bg-navy-900 hover:bg-navy-950 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-navy-900/20 hover:shadow-xl transition-all transform active:scale-95"
              >
                <span>Go to Dashboard</span>
                <ArrowRight class="w-4 h-4" />
              </button>

              <a
                href="#features"
                class="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm sm:text-base px-5 py-3.5 rounded-xl shadow-xs transition-all"
              >
                <span>Learn More</span>
                <ChevronRight class="w-4 h-4 text-slate-400" />
              </a>
            </div>

            <!-- Quick Role Switch Pill Chips (Direct 1-Click Sandbox) -->
            <div class="pt-4 border-t border-slate-200/70">
              <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles class="w-3.5 h-3.5 text-amber-500" />
                <span>Instant 1-Click Demo Sandbox:</span>
              </p>
              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  @click="quickEnter('student')"
                  class="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs transition-all text-xs font-medium text-slate-800"
                >
                  <span class="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform"></span>
                  <span><strong>Student:</strong> Aditya Verma</span>
                  <span class="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold border border-amber-200">At Risk (68)</span>
                </button>

                <button
                  type="button"
                  @click="quickEnter('ta')"
                  class="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs transition-all text-xs font-medium text-slate-800"
                >
                  <span class="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform"></span>
                  <span><strong>TA:</strong> Dr. Priya R.</span>
                  <span class="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold border border-blue-200">22 Assigned</span>
                </button>

                <button
                  type="button"
                  @click="quickEnter('admin')"
                  class="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs transition-all text-xs font-medium text-slate-800"
                >
                  <span class="w-2 h-2 rounded-full bg-purple-500 group-hover:scale-125 transition-transform"></span>
                  <span><strong>Admin:</strong> Academic Cell</span>
                  <span class="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-bold border border-purple-200">Full Oversight</span>
                </button>
              </div>
            </div>

            <!-- Mini Trend Badges from Aura Edu Screenshot -->
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div class="bg-white/90 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <TrendingUp class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-xs text-slate-500 font-medium">Intervention Success</div>
                  <div class="text-base font-bold text-slate-900">85% Rate</div>
                </div>
              </div>

              <div class="bg-white/90 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Users class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-xs text-slate-500 font-medium">Active Cohorts</div>
                  <div class="text-base font-bold text-slate-900">12,400+ Learners</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive 3D Visual with Floating Cards (Matching EduSight/Aura Edu) -->
          <div class="lg:col-span-6 relative">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              
              <!-- Center Glow Backdrop -->
              <div class="absolute inset-0 bg-gradient-to-tr from-blue-200/40 via-sky-100/50 to-amber-100/30 rounded-3xl transform rotate-1 scale-105 filter blur-lg -z-10"></div>
              
              <!-- Main 3D Presenter Character Illustration -->
              <div class="relative bg-gradient-to-b from-blue-50/80 via-white to-sky-50/50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl overflow-hidden min-h-[480px] flex items-center justify-center">
                
                <!-- Background Geometric Shapes -->
                <div class="absolute -right-8 -top-8 w-44 h-44 bg-amber-200/40 rounded-full blur-xl pointer-events-none"></div>
                <div class="absolute -left-10 -bottom-10 w-44 h-44 bg-blue-200/40 rounded-full blur-xl pointer-events-none"></div>

                <!-- 3D Presenter Image -->
                <img 
                  src="/ui/friendly-presenter.png" 
                  alt="EduSight Academic Advisor" 
                  class="relative z-10 w-full max-w-[340px] sm:max-w-[380px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                />

                <!-- Floating Card 1: Top Right Risk Score Badge (From Reference Image) -->
                <div class="absolute top-6 right-4 sm:right-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-900/10 max-w-[210px] animate-bounce-gentle">
                  <div class="flex items-center gap-2 mb-1.5">
                    <div class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertTriangle class="w-4 h-4" />
                    </div>
                    <div>
                      <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Risk Score</span>
                      <span class="text-xl font-extrabold text-slate-900">78%</span>
                    </div>
                  </div>
                  <!-- Red Sparkline Graph SVG -->
                  <div class="h-8 w-full mt-1">
                    <svg viewBox="0 0 100 28" class="w-full h-full overflow-visible">
                      <path d="M 0,22 Q 25,24 40,15 T 70,18 T 100,5" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" />
                      <circle cx="100" cy="5" r="3.5" fill="#ef4444" />
                    </svg>
                  </div>
                  <div class="text-[10px] font-medium text-rose-600 mt-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                    <span>Critical • 4-in-4 At Risk</span>
                  </div>
                </div>

                <!-- Floating Card 2: Bottom Checklist (From Reference Image) -->
                <div class="absolute bottom-6 left-4 sm:left-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-900/10 max-w-[210px]">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Intervention Plan</div>
                  <div class="space-y-2">
                    <div class="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Assign Counselor</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Track Course Progress</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Review Milestones</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- METRICS & IMPACT RIBBON (Directly from EduSight Screenshot) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-16 relative z-30">
      <div class="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xl shadow-slate-900/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        
        <!-- Metric 1: Students Monitored -->
        <div class="flex items-center gap-4 pt-4 sm:pt-0">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users class="w-6 h-6" />
          </div>
          <div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">2,480+</div>
            <div class="text-xs sm:text-sm text-slate-500 font-medium">Students Monitored</div>
          </div>
        </div>

        <!-- Metric 2: Intervention Success Rate -->
        <div class="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          <div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">93%</div>
            <div class="text-xs sm:text-sm text-slate-500 font-medium">Intervention Success Rate</div>
          </div>
        </div>

        <!-- Metric 3: Average Response Time -->
        <div class="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock class="w-6 h-6" />
          </div>
          <div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">&lt; 2 weeks</div>
            <div class="text-xs sm:text-sm text-slate-500 font-medium">Average Response Time</div>
          </div>
        </div>

        <!-- Metric 4: Courses Analyzed -->
        <div class="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6">
          <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <BarChart3 class="w-6 h-6" />
          </div>
          <div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">91</div>
            <div class="text-xs sm:text-sm text-slate-500 font-medium">Courses Analyzed in Audit</div>
          </div>
        </div>

      </div>
    </section>

    <!-- INTERACTIVE LIVING RISK SIMULATOR PLAYGROUND -->
    <section id="simulator" class="py-16 bg-gradient-to-b from-slate-100/70 via-white to-slate-50 border-y border-slate-200/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-12">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Interactive Risk Engine Simulator</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            See How the Predictive Risk Engine Works
          </h2>
          <p class="text-slate-600 mt-2 text-sm sm:text-base">
            Adjust student parameters below in real-time to observe how milestone pacing, exam attempts, and weekly assignments dynamically determine academic risk tier.
          </p>
        </div>

        <!-- Simulator Widget Card -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          <!-- Controls Panel (7 Cols) -->
          <div class="lg:col-span-7 p-6 sm:p-8 space-y-6">
            <h3 class="text-base font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
              <Sliders class="w-4 h-4 text-blue-600" />
              <span>Input Simulation Variables:</span>
            </h3>

            <!-- Variable 1: Foundation Courses Cleared -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <label class="font-semibold text-slate-800">Foundation Courses Completed (out of 8):</label>
                <span class="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">{{ simCoursesCompleted }} / 8 Courses</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="8" 
                v-model.number="simCoursesCompleted" 
                class="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div class="flex justify-between text-[11px] text-slate-400">
                <span>0 courses</span>
                <span>4 courses (Term 4 checkpoint)</span>
                <span>8 courses (Diploma clear)</span>
              </div>
            </div>

            <!-- Variable 2: Current Term -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <label class="font-semibold text-slate-800">Current Academic Term:</label>
                <span class="font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">Term {{ simCurrentTerm }}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="6" 
                v-model.number="simCurrentTerm" 
                class="w-full accent-navy-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div class="flex justify-between text-[11px] text-slate-400">
                <span>Term 1</span>
                <span>Term 3</span>
                <span>Term 4 (Critical 4-in-4)</span>
                <span>Term 6 (6-in-6)</span>
              </div>
            </div>

            <!-- Variable 3: OPPE Exam Status -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">OPPE Programming Practical Status:</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  @click="simOppeStatus = 'cleared'"
                  :class="[
                    'py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all',
                    simOppeStatus === 'cleared' ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  ]"
                >
                  ✓ Cleared 1st Attempt
                </button>
                <button
                  type="button"
                  @click="simOppeStatus = 'pending'"
                  :class="[
                    'py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all',
                    simOppeStatus === 'pending' ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  ]"
                >
                  ⏳ Pending / First Try
                </button>
                <button
                  type="button"
                  @click="simOppeStatus = 'failed'"
                  :class="[
                    'py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all',
                    simOppeStatus === 'failed' ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  ]"
                >
                  ⚠️ Repeat Attempt (2+)
                </button>
              </div>
            </div>

            <!-- Variable 4: Assignment Submission Rate -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <label class="font-semibold text-slate-800">Weekly Assignment Submission Velocity:</label>
                <span class="font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">{{ simAssignmentRate }}%</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="100" 
                step="5"
                v-model.number="simAssignmentRate" 
                class="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <!-- Live Diagnostic Output Panel (5 Cols) -->
          <div class="lg:col-span-5 p-6 sm:p-8 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Engine Diagnostic</span>
                <span 
                  class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                  :class="simRiskBadgeClass"
                >
                  {{ simRiskLevel }} Tier
                </span>
              </div>

              <!-- Score Circular Gauge Display -->
              <div class="text-center py-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-6">
                <div class="text-4xl sm:text-5xl font-black tracking-tight" :class="simScoreColorClass">
                  {{ calculatedRiskScore }}<span class="text-2xl font-bold text-slate-400">/100</span>
                </div>
                <div class="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Calculated Academic Risk Score</div>
                
                <!-- Progress Bar -->
                <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-4 p-0.5 border border-slate-200">
                  <div 
                    class="h-full rounded-full transition-all duration-500"
                    :class="simScoreBgClass"
                    :style="{ width: `${calculatedRiskScore}%` }"
                  ></div>
                </div>
              </div>

              <!-- Key Signal Warnings -->
              <div class="space-y-2 text-xs">
                <div class="font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-2">Detected Risk Indicators:</div>
                <div 
                  v-for="(signal, idx) in simSignals" 
                  :key="idx"
                  class="flex items-start gap-2 p-2 rounded-xl border text-slate-700 bg-white"
                >
                  <AlertCircle class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{{ signal }}</span>
                </div>
                <div v-if="!simSignals.length" class="text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All pacing milestones on schedule. Normal academic progression.</span>
                </div>
              </div>
            </div>

            <!-- Action Prescription -->
            <div class="pt-6 mt-6 border-t border-slate-200">
              <button
                type="button"
                @click="quickEnter('admin')"
                class="w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs sm:text-sm py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <span>View Full Platform Diagnostics</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- CORE PLATFORM FEATURES (Matching media_1793610565087_b6dbe700.jpg) -->
    <section id="features" class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Built Specifically for IITM BS Degree
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
          Targeted Support, Coordinated with Precision
        </h2>
        <p class="text-slate-600 mt-3 text-base sm:text-lg">
          Transform fragmented spreadsheets into a unified academic surveillance system that intervenes before students drop out or fail milestone checkpoints.
        </p>
      </div>

      <!-- Feature Grid: 4 Pillars from Reference UI -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        
        <!-- Feature 1: Pre-Emptive Risk Identification -->
        <div class="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ShieldAlert class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Identify Risk Factors Pre-Emptively</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-4">
            Combines formative quiz scores, assignment submission velocity, OPPE programming exam attempts, and term pace to generate predictive early warnings weeks before end-term exams.
          </p>
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-700">Surveillance Model:</span>
            <span class="font-bold text-blue-700">Multi-Signal Weighted Heuristics</span>
          </div>
        </div>

        <!-- Feature 2: Targeted Support & TA Matching -->
        <div class="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Targeted Support, Simplified</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-4">
            Automated TA matching pairs struggling students with teaching assistants based on subject expertise (e.g. Python, Math, Stats) and monitors TA caseload ceilings to prevent advisor fatigue.
          </p>
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-700">Workload Threshold:</span>
            <span class="font-bold text-emerald-700">&lt; 25 Students / TA Balance</span>
          </div>
        </div>

        <!-- Feature 3: Coordinate Interventions with Precision -->
        <div class="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Layers class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Coordinate Interventions with Precision</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-4">
            Log 1-on-1 counseling, OPPE lab mock sessions, and academic study plans with structured outcome tracking (Positive Response, In Progress, Escalated) and overdue follow-up alerts.
          </p>
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-700">Audit Trail:</span>
            <span class="font-bold text-amber-700">Role-Segregated Confidential Notes</span>
          </div>
        </div>

        <!-- Feature 4: Track Long-Term Milestone Success -->
        <div class="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Compass class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Track Long-Term Success</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-4">
            Enforce mandatory IITM BS degree completion checkpoints: 4 Foundation courses in 4 terms, 6 in 6, and 8 in 9. Spot bottleneck course dropouts before registration deadlines close.
          </p>
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-700">Enforcement:</span>
            <span class="font-bold text-purple-700">Automatic Milestone Pacing Checks</span>
          </div>
        </div>

      </div>

      <!-- Holographic Team Banner from Image 3 Reference -->
      <div class="mt-12 bg-gradient-to-r from-navy-950 via-navy-900 to-blue-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-4">
            <span class="text-xs font-bold text-blue-300 uppercase tracking-widest bg-blue-900/60 px-3 py-1 rounded-full border border-blue-700">
              Whole-Cohort Intelligence
            </span>
            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              A Complete Solution for Educators, Counselors, and Academic Deans
            </h3>
            <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
              Consolidate student data, flag prerequisite roadblocks, dispatch bulk personalized nudge emails with <code>&#123;&#123;student_name&#125;&#125;</code> variables, and download full CSV audits with one click.
            </p>
            <div class="pt-2">
              <button
                type="button"
                @click="quickEnter('admin')"
                class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors shadow-md shadow-blue-600/30"
              >
                <span>Open Admin Coordination Console</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="lg:col-span-5 flex justify-center">
            <img 
              src="/ui/h2.png"
              alt="Educators Team" 
              class="w-full max-w-sm object-contain drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CURRICULUM BOTTLENECK INSIGHTS (From data.xlsx) -->
    <section id="bottlenecks" class="py-16 bg-slate-100/60 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span class="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Curriculum Health Audit
            </span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              High-Friction Foundation Courses
            </h2>
            <p class="text-slate-600 text-sm mt-1">
              Real attempt and repeat analysis extracted from program course registration records.
            </p>
          </div>
          <button
            type="button"
            @click="quickEnter('admin')"
            class="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:text-blue-700 self-start md:self-auto"
          >
            <span>Explore Full 91-Course Heatmap</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>

        <!-- Bottleneck Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">CS1002</span>
              <span class="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">66.5% Repeat Rate</span>
            </div>
            <h4 class="text-base font-bold text-slate-900">Programming in Python</h4>
            <p class="text-xs text-slate-500 mt-1 mb-4">60,671 total repeat attempts logged across intake cohorts.</p>
            <div class="space-y-1.5 text-xs text-slate-600">
              <div class="flex justify-between">
                <span>Key Hurdle:</span>
                <span class="font-semibold text-slate-900">OPPE 1 & 2 Coding Exams</span>
              </div>
              <div class="flex justify-between">
                <span>Remedy:</span>
                <span class="font-semibold text-emerald-700">TA Mock Coding Sessions</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">MA1004</span>
              <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">63.7% Repeat Rate</span>
            </div>
            <h4 class="text-base font-bold text-slate-900">Statistics for Data Science II</h4>
            <p class="text-xs text-slate-500 mt-1 mb-4">50,865 repeat attempts recorded among Foundation learners.</p>
            <div class="space-y-1.5 text-xs text-slate-600">
              <div class="flex justify-between">
                <span>Key Hurdle:</span>
                <span class="font-semibold text-slate-900">Hypothesis Testing & Proofs</span>
              </div>
              <div class="flex justify-between">
                <span>Remedy:</span>
                <span class="font-semibold text-emerald-700">Bi-weekly Doubt Clinics</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">MA1003</span>
              <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">62.6% Repeat Rate</span>
            </div>
            <h4 class="text-base font-bold text-slate-900">Mathematics for Data Science II</h4>
            <p class="text-xs text-slate-500 mt-1 mb-4">Linear algebra and multivariable calculus stumbling block.</p>
            <div class="space-y-1.5 text-xs text-slate-600">
              <div class="flex justify-between">
                <span>Key Hurdle:</span>
                <span class="font-semibold text-slate-900">Vector Spaces & Transformations</span>
              </div>
              <div class="flex justify-between">
                <span>Remedy:</span>
                <span class="font-semibold text-emerald-700">Visual Math Worksheets</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- ROLE-BASED PORTALS (1-Click Test Drives) -->
    <section id="portals" class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
          Experience the Platform
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
          Select a Dedicated Role Portal
        </h2>
        <p class="text-slate-600 text-sm sm:text-base mt-2">
          Experience role-segregated perspectives tailored for each stakeholder in the academic lifecycle.
        </p>
      </div>

      <!-- 3 Role Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Role 1: Student -->
        <div class="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between mb-5">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BookOpen class="w-6 h-6" />
              </div>
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Student Portal
              </span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Aditya Verma</h3>
            <p class="text-xs text-slate-500 font-medium mb-4">Roll: 21F1000542 • Foundation Level (Term 3)</p>
            <p class="text-sm text-slate-600 leading-relaxed mb-6">
              Track course milestone pace, review AI-generated risk diagnosis drawer, view registered courses, and submit direct mentorship requests to assigned TAs.
            </p>
            <ul class="space-y-2 text-xs text-slate-600 mb-6">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Interactive Course Prerequisite Map</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
                <span>OPPE Readiness Diagnostics</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1-Click Mentorship Requests</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            @click="quickEnter('student')"
            class="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm py-3 rounded-xl transition-colors shadow-xs"
          >
            <span>Launch Student View</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>

        <!-- Role 2: Teaching Assistant -->
        <div class="bg-white rounded-3xl p-7 border-2 border-blue-500/70 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between relative group">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Most Active Workflow
          </div>
          <div>
            <div class="flex items-center justify-between mb-5 pt-2">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Users class="w-6 h-6" />
              </div>
              <span class="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                TA Hub
              </span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Dr. Priya Ramachandran</h3>
            <p class="text-xs text-slate-500 font-medium mb-4">CSE Dept • 22 Students Assigned (4 Critical)</p>
            <p class="text-sm text-slate-600 leading-relaxed mb-6">
              Triage assigned student caseload, record confidential course notes, log 1-on-1 intervention outcomes, and flag severe cases for Dean committee review.
            </p>
            <ul class="space-y-2 text-xs text-slate-600 mb-6">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-blue-500 shrink-0" />
                <span>Student Risk Triage Matrix</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-blue-500 shrink-0" />
                <span>Intervention Ledger & Reminders</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-blue-500 shrink-0" />
                <span>Course-Level Private Notes</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            @click="quickEnter('ta')"
            class="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors shadow-md shadow-blue-600/20"
          >
            <span>Launch TA Dashboard</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>

        <!-- Role 3: Academic Administrator -->
        <div class="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between mb-5">
              <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <ShieldAlert class="w-6 h-6" />
              </div>
              <span class="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
                Admin Console
              </span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Prof. Rajesh K.</h3>
            <p class="text-xs text-slate-500 font-medium mb-4">BS Degree Academic Coordination Cell</p>
            <p class="text-sm text-slate-600 leading-relaxed mb-6">
              Bird's-eye program surveillance, milestone breach alerts, TA workload balancing, batch student notifications, and predictive model sensitivity tuning.
            </p>
            <ul class="space-y-2 text-xs text-slate-600 mb-6">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-purple-500 shrink-0" />
                <span>Cohort Pacing Stacked Bar Charts</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-purple-500 shrink-0" />
                <span>4-Step TA Assignment Wizard</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-purple-500 shrink-0" />
                <span>Full CSV Registry Export</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            @click="quickEnter('admin')"
            class="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-purple-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors shadow-xs"
          >
            <span>Launch Admin Console</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>

      </div>

    </section>

    <!-- FOOTER -->
    <footer class="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div class="space-y-4 md:col-span-2">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <GraduationCap class="w-5 h-5 text-white" />
              </div>
              <span class="text-lg font-bold text-white tracking-wide">EduSight</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Student Academic Risk Identification & Intervention Platform for the Indian Institute of Technology Madras (IITM) BS Degree in Data Science & Applications.
            </p>
            <div class="text-xs text-slate-500">
              Designed according to IITM academic pacing policies: 4-in-4, 6-in-6, and 8-in-9 progression rules.
            </div>
          </div>

          <div>
            <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Direct Portals</h4>
            <ul class="space-y-2.5 text-xs">
              <li>
                <button @click="quickEnter('student')" class="hover:text-white transition-colors">Student Dashboard</button>
              </li>
              <li>
                <button @click="quickEnter('ta')" class="hover:text-white transition-colors">Teaching Assistant Hub</button>
              </li>
              <li>
                <button @click="quickEnter('admin')" class="hover:text-white transition-colors">Admin Coordination Cell</button>
              </li>
              <li>
                <router-link to="/login" class="hover:text-white transition-colors">Portal Authentication</router-link>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Platform Features</h4>
            <ul class="space-y-2.5 text-xs">
              <li><a href="#simulator" class="hover:text-white transition-colors">Risk Simulator Engine</a></li>
              <li><a href="#bottlenecks" class="hover:text-white transition-colors">Curriculum Bottleneck Heatmaps</a></li>
              <li><a href="#features" class="hover:text-white transition-colors">Intervention Workflows</a></li>
              <li>
                <button @click="handleReset" class="text-amber-400 hover:text-amber-300 transition-colors">Reset Demo Data</button>
              </li>
            </ul>
          </div>

        </div>

        <div class="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 IIT Madras BS Degree Academic Platform. All rights reserved.</p>
          <div class="flex items-center gap-6">
            <span>Confidential Academic Records</span>
            <span>Local Offline Simulation</span>
          </div>
        </div>

      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'
import {
  GraduationCap,
  Bell,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Layers,
  Compass,
  BookOpen,
  Sparkles,
  Sliders
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

// --- Simulator State ---
const simCoursesCompleted = ref(2)
const simCurrentTerm = ref(3)
const simOppeStatus = ref('pending') // 'cleared' | 'pending' | 'failed'
const simAssignmentRate = ref(65)

// Compute simulated risk score (0 - 100)
const calculatedRiskScore = computed(() => {
  let score = 20 // baseline

  // Pacing lag calculation
  const expectedCourses = simCurrentTerm.value * 1.5
  const courseLag = Math.max(0, expectedCourses - simCoursesCompleted.value)
  score += Math.round(courseLag * 12)

  // 4-in-4 check
  if (simCurrentTerm.value >= 4 && simCoursesCompleted.value < 4) {
    score += 30 // Major breach penalty
  }

  // OPPE status
  if (simOppeStatus.value === 'failed') {
    score += 25
  } else if (simOppeStatus.value === 'cleared') {
    score -= 10
  }

  // Assignment rate
  if (simAssignmentRate.value < 60) {
    score += Math.round((60 - simAssignmentRate.value) * 0.5)
  } else if (simAssignmentRate.value >= 85) {
    score -= 8
  }

  return Math.min(99, Math.max(5, score))
})

const simRiskLevel = computed(() => {
  if (calculatedRiskScore.value >= 75) return 'Critical'
  if (calculatedRiskScore.value >= 50) return 'At Risk'
  return 'Safe'
})

const simRiskBadgeClass = computed(() => {
  if (simRiskLevel.value === 'Critical') return 'bg-rose-50 text-rose-800 border-rose-200'
  if (simRiskLevel.value === 'At Risk') return 'bg-amber-50 text-amber-800 border-amber-200'
  return 'bg-emerald-50 text-emerald-800 border-emerald-200'
})

const simScoreColorClass = computed(() => {
  if (simRiskLevel.value === 'Critical') return 'text-rose-600'
  if (simRiskLevel.value === 'At Risk') return 'text-amber-600'
  return 'text-emerald-600'
})

const simScoreBgClass = computed(() => {
  if (simRiskLevel.value === 'Critical') return 'bg-rose-600'
  if (simRiskLevel.value === 'At Risk') return 'bg-amber-500'
  return 'bg-emerald-500'
})

const simSignals = computed(() => {
  const alerts = []
  if (simCurrentTerm.value >= 4 && simCoursesCompleted.value < 4) {
    alerts.push('4-in-4 Checkpoint Breached: < 4 Foundation courses completed by Term 4.')
  } else if (simCurrentTerm.value === 3 && simCoursesCompleted.value < 3) {
    alerts.push('Projected Milestone Delay: Approaching Term 4 milestone deadline.')
  }

  if (simOppeStatus.value === 'failed') {
    alerts.push('Persistent Exam Difficulty: 2+ failed attempts on OPPE practical programming lab.')
  }

  if (simAssignmentRate.value < 65) {
    alerts.push(`Low Formative Engagement: ${simAssignmentRate.value}% weekly assignment submission velocity.`)
  }

  return alerts
})

// --- Navigation & Quick Role Launch ---
function handlePrimaryCta() {
  if (authStore.isAuthenticated) {
    if (authStore.isStudent) router.push('/student/dashboard')
    else if (authStore.isTa) router.push('/ta/dashboard')
    else router.push('/admin/executive-dashboard')
  } else {
    // By default launch student dashboard with demo account
    quickEnter('student')
  }
}

function quickEnter(role) {
  authStore.switchRole(role)
  toast.success(`Logged in as ${authStore.currentUser.name} (${authStore.currentUser.role.toUpperCase()})`)
  if (role === 'student') router.push('/student/dashboard')
  else if (role === 'ta') router.push('/ta/dashboard')
  else router.push('/admin/executive-dashboard')
}

function handleReset() {
  if (confirm('Reset all demo data back to default initial state?')) {
    authStore.resetPlatformData()
    toast.info('Platform state reset to defaults.')
  }
}
</script>

<style scoped>
@keyframes bounceGentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.animate-bounce-gentle {
  animation: bounceGentle 4s ease-in-out infinite;
}
</style>
