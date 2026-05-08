"use client"

import dynamic from "next/dynamic"

const WebGLBackground = dynamic(() => import("@/components/auth/WebGLBackground"), {
  ssr: false,
})

export default function LandingScene() {
  return <WebGLBackground />
}
