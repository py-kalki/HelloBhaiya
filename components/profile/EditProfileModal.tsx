"use client"

import { useState, useRef } from "react"
import { updateUserProfile } from "@/actions/updateUserProfile"
import { X, Upload, Camera } from "lucide-react"
import Image from "next/image"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

interface EditProfileModalProps {
  initialName: string
  initialPhotoUrl: string
  onClose: () => void
}

export function EditProfileModal({ initialName, initialPhotoUrl, onClose }: EditProfileModalProps) {
  const [name, setName] = useState(initialName)
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
    )
  }, [])

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0, scale: 0.95, y: 20, duration: 0.3, ease: "power2.in",
      onComplete: onClose
    })
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = document.createElement("img")
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const MAX_WIDTH = 200
          const MAX_HEIGHT = 200
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0, width, height)
          
          // Use WebP format for maximum compression
          const dataUrl = canvas.toDataURL("image/webp", 0.8)
          resolve(dataUrl)
        }
        img.onerror = (error) => reject(error)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB.")
      return
    }

    try {
      const compressedBase64 = await compressImage(file)
      setPhotoUrl(compressedBase64)
      setError(null)
    } catch (err) {
      setError("Failed to process image. Please try another one.")
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty.")
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      await updateUserProfile({
        name: name.trim(),
        photo_url: photoUrl
      })
      handleClose()
    } catch (err) {
      setError("Failed to save profile. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="w-full max-w-sm bg-surface border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 blur-[60px] rounded-full pointer-events-none" />

        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Edit Profile</h2>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-surface-2 flex items-center justify-center relative">
                {photoUrl ? (
                  <Image src={photoUrl} alt="Profile" fill className="object-cover" />
                ) : (
                  <span className="text-4xl text-text-muted">{name.charAt(0).toUpperCase()}</span>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 right-0 w-8 h-8 rounded-full bg-accent border-2 border-surface flex items-center justify-center text-black shadow-lg">
                <Upload className="w-4 h-4" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Change Photo</p>
          </div>

          {/* Name Input */}
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary mb-2 block">Full Name</label>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-accent/50 focus-within:bg-accent/5">
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-transparent text-sm text-white placeholder:text-text-muted p-4 rounded-2xl focus:outline-none" 
              />
            </div>
          </div>

          <button 
            onClick={handleSave} 
            disabled={loading}
            className="w-full rounded-2xl bg-white text-black font-bold py-4 text-sm hover:bg-white/90 transition-colors uppercase tracking-widest mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
