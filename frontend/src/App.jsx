import React from 'react'
import { Route, Routes, Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import NoteDetailPage from './pages/NoteDetailPage'
import { HeartIcon, BookOpenIcon, SparklesIcon, LogInIcon, Instagram, Linkedin, Github } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import ConstellationBackground from './components/ConstellationBackground'

const App = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Animated mesh gradient background */}
      <div className="mesh-gradient" />
      <ConstellationBackground />

      {/* Main content */}
      <main className="flex-1 relative z-0 flex flex-col">
        <SignedIn>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/create' element={<CreatePage />} />
            <Route path='/note/:id' element={<NoteDetailPage />} />
            <Route path='*' element={<Navigate to="/" replace />} />
          </Routes>
        </SignedIn>

        <SignedOut>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="glass-card max-w-md w-full rounded-3xl p-8 text-center border border-primary/10 relative overflow-hidden">
              <div className="accent-bar absolute top-0 left-0 right-0" />

              <div className="relative inline-block mb-6 mt-2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-float mx-auto">
                  <BookOpenIcon className="size-8 text-primary" />
                </div>
                <SparklesIcon className="size-4 text-secondary absolute -top-1.5 -right-1.5 animate-glow" />
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight mb-2 gradient-text">DearNote</h1>
              <p className="text-sm text-base-content/40 mb-6">
                Your personal, private space for capture. Thoughts, drafts, plans — secured and accessible only by you.
              </p>

              <SignInButton mode="modal">
                <button className="btn btn-primary w-full gap-2 rounded-2xl btn-glow shadow-lg shadow-primary/20 py-3">
                  <LogInIcon className="size-4" />
                  Sign In to Your Notebook
                </button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-base-content/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-base-content/35">
            {/* Left: Copyright */}
            <p className="font-medium">
              &copy; {new Date().getFullYear()} DearNote. All rights reserved.
            </p>

            {/* Center: Built with */}
            <div className="flex items-center gap-1.5 order-first sm:order-none">
              <span>Built with</span>
              <HeartIcon className="size-3.5 text-error fill-error" />
              <span>·</span>
              <span className="gradient-text font-bold">DearNote</span>
            </div>

            {/* Right: Socials */}
            <div className="flex items-center gap-3">
              <h2>Follow my socials: </h2>
              <a
                href="https://www.instagram.com/melancholy21u"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors p-2 rounded-lg hover:bg-base-content/5"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/dela-torre-angelo-2103z/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors p-2 rounded-lg hover:bg-base-content/5"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-4" />
              </a>
              <a
                href="https://github.com/melancholy21"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors p-2 rounded-lg hover:bg-base-content/5"
                aria-label="GitHub"
              >
                <Github className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App