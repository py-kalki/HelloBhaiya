"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function WebGLBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // ── Scene setup ──
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // ── Floating particles ──
    const particleCount = 600
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40

      velocities[i * 3] = (Math.random() - 0.5) * 0.008
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.008
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003

      sizes[i] = Math.random() * 2.5 + 0.5
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xffffff) },
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.x += sin(uTime * 0.3 + position.y * 0.1) * 0.5;
          pos.y += cos(uTime * 0.2 + position.x * 0.1) * 0.5;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (20.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = 0.15 + 0.15 * sin(uTime + position.x * 0.5);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // ── Wireframe icosahedron (slowly rotating) ──
    const icoGeometry = new THREE.IcosahedronGeometry(8, 1)
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    })
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial)
    icosahedron.position.set(-12, 5, -10)
    scene.add(icosahedron)

    // ── Torus knot (right side) ──
    const torusGeometry = new THREE.TorusKnotGeometry(4, 0.5, 100, 16, 2, 3)
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.03,
    })
    const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial)
    torusKnot.position.set(15, -8, -15)
    scene.add(torusKnot)

    // ── Orbital ring ──
    const ringGeometry = new THREE.TorusGeometry(12, 0.03, 8, 100)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 3
    ring.position.set(0, 0, -5)
    scene.add(ring)

    // ── Connection lines between nearby particles ──
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.025,
    })

    const linesGroup = new THREE.Group()
    scene.add(linesGroup)

    // ── Mouse interaction ──
    const mouse = { x: 0, y: 0 }
    function onMouseMove(e: MouseEvent) {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("mousemove", onMouseMove)

    // ── Resize handler ──
    function onResize() {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", onResize)

    // ── Animation loop ──
    let frameId: number
    const startTime = performance.now()

    function animate() {
      frameId = requestAnimationFrame(animate)
      const elapsed = (performance.now() - startTime) / 1000

      // Update particle shader time
      particleMaterial.uniforms["uTime"]!.value = elapsed

      // Move particles
      const posAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute
      const pos = posAttr.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const vx = velocities[i3]!, vy = velocities[i3 + 1]!, vz = velocities[i3 + 2]!
        pos[i3]     = pos[i3]! + vx
        pos[i3 + 1] = pos[i3 + 1]! + vy
        pos[i3 + 2] = pos[i3 + 2]! + vz

        // Wrap around
        if (Math.abs(pos[i3]!)     > 40) velocities[i3]     = -vx
        if (Math.abs(pos[i3 + 1]!) > 40) velocities[i3 + 1] = -vy
        if (Math.abs(pos[i3 + 2]!) > 20) velocities[i3 + 2] = -vz
      }
      posAttr.needsUpdate = true

      // Update connection lines every 3 frames for perf
      if (Math.floor(elapsed * 60) % 3 === 0) {
        linesGroup.clear()
        const linePositions: number[] = []
        const threshold = 8
        for (let i = 0; i < Math.min(particleCount, 100); i++) {
          for (let j = i + 1; j < Math.min(particleCount, 100); j++) {
            const dx = pos[i * 3]! - pos[j * 3]!
            const dy = pos[i * 3 + 1]! - pos[j * 3 + 1]!
            const dz = pos[i * 3 + 2]! - pos[j * 3 + 2]!
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
            if (dist < threshold) {
              linePositions.push(
                pos[i * 3]!, pos[i * 3 + 1]!, pos[i * 3 + 2]!,
                pos[j * 3]!, pos[j * 3 + 1]!, pos[j * 3 + 2]!
              )
            }
          }
        }
        if (linePositions.length > 0) {
          const lineGeometry = new THREE.BufferGeometry()
          lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3))
          const lines = new THREE.LineSegments(lineGeometry, linesMaterial)
          linesGroup.add(lines)
        }
      }

      // Rotate geometry
      icosahedron.rotation.x = elapsed * 0.08
      icosahedron.rotation.y = elapsed * 0.12
      torusKnot.rotation.x = elapsed * 0.05
      torusKnot.rotation.z = elapsed * 0.07
      ring.rotation.z = elapsed * 0.03

      // Camera follows mouse gently
      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02
      camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      icoGeometry.dispose()
      icoMaterial.dispose()
      torusGeometry.dispose()
      torusMaterial.dispose()
      ringGeometry.dispose()
      ringMaterial.dispose()
      linesMaterial.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden
    />
  )
}
