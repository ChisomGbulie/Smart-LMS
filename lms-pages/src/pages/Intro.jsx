import { Link } from 'react-router-dom'
import { Sparkles, BookOpen, MessageCircle, Briefcase, TrendingUp } from 'lucide-react'

export default function Intro() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-[2rem] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-10 lg:p-16 space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-sm font-semibold">
              <Sparkles className="h-5 w-5" />
              Intelligent, individual learning for every student
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                Smart-LMS: Your adaptive learning experience
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-8">
                Combine AI-guided course recommendations with real-time job market insights in one intuitive learning management system. Smart-LMS guides learners through tailored education paths while keeping them informed about in-demand skills and live career opportunities.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:bg-blue-700"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Log in
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <div className="flex items-center gap-3 text-blue-600 mb-3">
                  <BookOpen className="h-5 w-5" />
                  <p className="text-sm font-semibold">Personalized learning</p>
                </div>
                <p className="text-sm text-slate-600 leading-6">
                  AI chatbots analyze your strengths and recommend the right courses, so every learner gets a tailored learning path.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <div className="flex items-center gap-3 text-emerald-600 mb-3">
                  <Briefcase className="h-5 w-5" />
                  <p className="text-sm font-semibold">Job market insights</p>
                </div>
                <p className="text-sm text-slate-600 leading-6">
                  Stay connected to the latest job openings and market trends so you can build skills that employers actually need.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <div className="flex items-center gap-3 text-violet-600 mb-3">
                  <MessageCircle className="h-5 w-5" />
                  <p className="text-sm font-semibold">Guided assessments</p>
                </div>
                <p className="text-sm text-slate-600 leading-6">
                  Assessments help identify your learning style and recommend courses that match your goals and pace.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <div className="flex items-center gap-3 text-orange-500 mb-3">
                  <TrendingUp className="h-5 w-5" />
                  <p className="text-sm font-semibold">Real-time growth</p>
                </div>
                <p className="text-sm text-slate-600 leading-6">
                  Track your progress, discover new opportunities, and act on insights that help you advance faster.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-10 lg:p-16">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.25),_transparent_25%)]" />
            <div className="relative space-y-8">
              <div className="rounded-3xl bg-slate-900/95 border border-white/10 p-6 shadow-xl">
                <p className="text-sm uppercase tracking-[0.32em] text-slate-400">What makes it different</p>
                <h2 className="text-2xl font-semibold mt-4">AI-driven course recommendations and jobs</h2>
                <p className="mt-4 text-slate-300 leading-7 text-sm">
                  Smart-LMS brings an intelligent tutor to your learning journey. It uses chat-driven assessments to discover your strengths, recommends courses, and connects that learning to the job market.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-900/95 border border-white/10 p-6 shadow-xl">
                <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Designed for students</p>
                <h2 className="text-2xl font-semibold mt-4">Structured learning with flexibility</h2>
                <p className="mt-4 text-slate-300 leading-7 text-sm">
                  Build a learning plan that fits your goals, choose courses at your own pace, and access up-to-date career signals from one central dashboard.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-900/95 border border-white/10 p-6 shadow-xl">
                <div className="inline-flex items-center gap-2 text-slate-300 text-sm font-medium uppercase tracking-[0.25em] mb-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  Built for modern learners
                </div>
                <p className="text-slate-300 text-sm leading-7">
                  Get started quickly, save time with personalized guidance, and make every learning session count with course and career data combined.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
