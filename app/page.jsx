'use client'

import Image from "next/image"
import { useEffect, useState } from "react"

export default function Page() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(window.scrollY)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar)
      return () => window.removeEventListener("scroll", controlNavbar)
    }
  }, [lastScrollY])

  return (
    <>
      <style>{`
        body { font-family: 'Inter', sans-serif; }
        .aurora-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 150vw;
          height: 150vh;
          background: radial-gradient(circle at center, rgba(124, 58, 237, 0.08), transparent 40%),
                      radial-gradient(circle at top left, rgba(79, 70, 229, 0.1), transparent 50%),
                      radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.1), transparent 50%);
          animation: aurora 20s infinite linear;
          will-change: transform;
          z-index: -1;
        }
        @keyframes aurora {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .grid-bg {
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .text-glow {
          text-shadow: 0 0 10px rgba(192, 132, 252, 0.5), 0 0 25px rgba(124, 58, 237, 0.3);
        }
      `}</style>

      <div className="bg-gray-950 text-gray-200 antialiased grid-bg">
        <div className="relative isolate">
          <div className="aurora-effect"></div>

          <div className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50 transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}>
            <div className="flex items-center justify-between h-16 px-6 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-violet-900/20">
              <a href="#" className="flex items-center space-x-2">
                <svg className="h-6 w-6 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xl font-bold text-white">Meritly</span>
              </a>
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition">Features</a>
                <a href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition">How It Works</a>
              </nav>
              <a href="#" className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-black bg-white border border-transparent rounded-full shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-500 transition">
                Get Started
              </a>
            </div>
          </div>

          <main>
            <section className="relative pt-40 pb-20 sm:pt-48 sm:pb-28 text-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter">
                  <span className="text-glow">Your Skills,</span><br />
                  Verified & Visualized.
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
                  Meritly is the AI-native platform that analyzes your project work to create a dynamic skill profile that recruiters trust.
                </p>
                <div className="mt-8">
                  <a href="#" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-black bg-white hover:bg-gray-200 transition-transform hover:scale-105">
                    Join the Waitlist
                  </a>
                </div>
              </div>
            </section>

            <section id="features" className="py-20 sm:py-28">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">A hiring platform built for the modern developer.</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { title: "Direct Proof", description: "Link skills to specific commits, PRs, and design files. No more vague bullet points." },
                    { title: "AI Skill Analysis", description: "Our engine scans your work to identify and verify your technical competencies automatically." },
                    { title: "Culture Matching", description: "Beyond technical skills, we help you find teams that align with your work style and values." },
                  ].map((feature, index) => (
                    <div key={index} className="p-8 bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      <p className="mt-4 text-gray-300">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="how-it-works" className="py-20 sm:py-28">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                  <div className="mb-12 lg:mb-0">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">See your profile come to life.</h2>
                    <p className="mt-4 max-w-2xl text-lg text-gray-300">Meritly doesn't just list your skills—it visualizes your expertise, showing recruiters exactly what you're capable of.</p>
                  </div>
                  <div>
                    <div className="p-6 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-violet-900/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <img className="h-12 w-12 rounded-full border-2 border-violet-400" src="https://i.pravatar.cc/80?u=dev" alt="Developer" />
                        <div>
                          <h4 className="font-bold text-white">Your Skill Profile</h4>
                          <p className="text-sm text-gray-400">Analysis complete</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { skill: "React & Next.js", level: "92%", color: "bg-sky-400" },
                          { skill: "API Design (REST & GQL)", level: "85%", color: "bg-emerald-400" },
                          { skill: "Database Architecture", level: "78%", color: "bg-amber-400" },
                        ].map((item) => (
                          <div key={item.skill}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-200">{item.skill}</span>
                              <span className="text-sm font-medium text-gray-400">{item.level}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2.5">
                              <div className={`${item.color} h-2.5 rounded-full`} style={{ width: item.level }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-20 sm:py-28">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="p-12 bg-black/20 backdrop-blur-lg border border-white/10 rounded-3xl max-w-4xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Get early access.</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">Join the waitlist and be the first to build a professional profile that actually works.</p>
                  <div className="mt-8 flex justify-center">
                    <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                      <input type="email" placeholder="your.email@example.com" className="flex-grow px-4 py-3 rounded-full bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition" />
                      <button type="submit" className="px-6 py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-transform hover:scale-105">Request Access</button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer className="border-t border-white/10">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <p className="text-sm text-gray-400">&copy; 2025 Meritly, Inc. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 sm:mt-0">
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition">Twitter</a>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition">GitHub</a>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
