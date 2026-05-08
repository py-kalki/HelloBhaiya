import React, { useState, useRef } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onSwitchMode?: (mode: 'signin' | 'signup' | 'reset' | 'verify') => void;
  isLoading?: boolean;
  mode?: 'signin' | 'signup' | 'reset' | 'verify';
  error?: string | null;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-accent/50 focus-within:bg-accent/5">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, className }: { testimonial: Testimonial, className?: string }) => (
  <div className={`flex items-start gap-3 rounded-3xl bg-surface/60 backdrop-blur-xl border border-white/10 p-5 w-64 shadow-2xl ${className || ""}`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-bold text-white tracking-tight">{testimonial.name}</p>
      <p className="text-accent text-[10px] uppercase tracking-widest font-bold mb-1">{testimonial.handle}</p>
      <p className="mt-1 text-text-secondary text-xs leading-relaxed">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-bold text-white tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onCreateAccount,
  onSwitchMode,
  isLoading = false,
  mode = 'signin',
  error = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Left side stagger
    gsap.fromTo(".anim-item", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "expo.out", delay: 0.2 }
    );

    // Right side image slide
    gsap.fromTo(".anim-hero",
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 1, ease: "expo.out", delay: 0.4 }
    );

    // Testimonials float up
    gsap.fromTo(".anim-testimonial",
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.8, ease: "back.out(1.2)", delay: 0.8 }
    );
  }, { scope: container });

  return (
    <div ref={container} className="h-dvh overflow-hidden flex flex-col md:flex-row font-sans w-full bg-background selection:bg-accent selection:text-black">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-6 lg:p-8 relative overflow-y-auto">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 py-6">
          {/* Back Button */}
          <div className="anim-item mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white text-xs sm:text-sm font-medium transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="anim-item mb-2">
              <Image src="/hellobhaiya-logo.svg" alt="HelloBhaiya" width={200} height={48} className="h-8 sm:h-10 w-auto mb-4 sm:mb-6" />
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{title}</h1>
              <p className="mt-2 text-text-secondary text-sm leading-relaxed">{description}</p>
            </div>

            <form className="space-y-4" onSubmit={onSignIn}>
              {mode !== 'verify' && (
                <div className="anim-item">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-2 block">Email Address</label>
                  <GlassInputWrapper>
                    <input name="email" type="email" placeholder="Enter your email address" className="w-full bg-transparent text-sm text-white placeholder:text-text-muted p-3 sm:p-4 rounded-2xl focus:outline-none" />
                  </GlassInputWrapper>
                </div>
              )}

              {mode === 'verify' && (
                <div className="anim-item text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(212,255,89,0.2)]">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <h3 className="text-white font-bold mb-2">Check your inbox</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    We've sent a secure verification link to your email. Click the link to verify your account, then click the button below.
                  </p>
                </div>
              )}

              {(mode === 'signin' || mode === 'signup') && (
                <div className="anim-item">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-2 block">Password</label>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" required className="w-full bg-transparent text-sm text-white placeholder:text-text-muted p-3 sm:p-4 pr-12 rounded-2xl focus:outline-none" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                        {showPassword ? <EyeOff className="w-5 h-5 text-text-muted hover:text-white transition-colors" /> : <Eye className="w-5 h-5 text-text-muted hover:text-white transition-colors" />}
                      </button>
                    </div>
                  </GlassInputWrapper>
                </div>
              )}

              {mode === 'signin' && (
                <div className="anim-item flex items-center justify-between text-sm">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 rounded border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-accent transition-colors">
                      <input type="checkbox" name="rememberMe" className="opacity-0 absolute" />
                    </div>
                    <span className="text-white/90 text-xs">Keep me signed in</span>
                  </label>
                  <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode?.('reset'); }} className="hover:underline text-accent text-xs transition-colors">Reset password</a>
                </div>
              )}

              {error && (
                <div className="anim-item flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  </div>
                  {error}
                </div>
              )}

              <button type="submit" disabled={isLoading} className="anim-item w-full rounded-2xl bg-white text-black font-bold py-3 sm:py-4 text-sm hover:bg-white/90 transition-colors uppercase tracking-widest disabled:opacity-50 mt-2">
                {isLoading ? "Processing..." : mode === 'reset' ? "Send Reset Link" : mode === 'signup' ? "Sign Up" : mode === 'verify' ? "I've Verified My Email" : "Sign In"}
              </button>
            </form>

            {mode !== 'verify' && (
              <>
                <div className="anim-item relative flex items-center justify-center my-1 sm:my-2">
                  <span className="w-full border-t border-white/10"></span>
                  <span className="px-4 text-[10px] uppercase tracking-widest font-bold text-text-muted bg-background absolute">Or</span>
                </div>

                <button 
                  onClick={onGoogleSignIn} 
                  disabled={isLoading}
                  className="anim-item w-full flex items-center justify-center gap-3 border border-white/10 bg-surface/50 rounded-2xl py-3 sm:py-4 hover:bg-white/5 hover:border-white/20 transition-colors disabled:opacity-50 text-sm font-bold text-white"
                >
                    {isLoading ? <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" /> : <GoogleIcon />}
                    {isLoading ? "Signing in..." : "Continue with Google"}
                </button>

                <p className="anim-item text-center text-[11px] sm:text-xs text-text-secondary mt-2">
                  {mode === 'signin' ? (
                    <>New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode?.('signup'); }} className="text-accent hover:underline transition-colors font-bold tracking-wide">Create Account</a></>
                  ) : mode === 'signup' ? (
                    <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode?.('signin'); }} className="text-accent hover:underline transition-colors font-bold tracking-wide">Sign In</a></>
                  ) : (
                    <>Remembered your password? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode?.('signin'); }} className="text-accent hover:underline transition-colors font-bold tracking-wide">Sign In</a></>
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden lg:block flex-1 relative p-4">
          <div className="anim-hero absolute inset-4 rounded-[32px] bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${heroImageSrc})` }}>
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
          </div>
          
          {testimonials.length > 0 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
              <TestimonialCard testimonial={testimonials[0]} className="anim-testimonial" />
              {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} className="anim-testimonial" /></div>}
              {testimonials[2] && <div className="hidden 2xl:flex"><TestimonialCard testimonial={testimonials[2]} className="anim-testimonial" /></div>}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
