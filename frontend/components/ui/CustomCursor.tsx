"use client"

import { useEffect, useState, useRef } from "react"

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(true)

  const mousePos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const hasMoved = useRef(false)

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    // Detecta se é dispositivo com suporte a mouse de precisão (desktop)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0

    if (!hasFinePointer || isTouch) {
      setIsTouchDevice(true)
      return
    }

    setIsTouchDevice(false)

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY

      if (!hasMoved.current) {
        hasMoved.current = true
        // Inicializa o anel exatamente na posição do cursor no primeiro movimento
        ringPos.current.x = e.clientX
        ringPos.current.y = e.clientY
        setIsVisible(true)
      }
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const isInteractive = Boolean(
        target.closest("a, button, input, select, textarea, [role='button'], .group, label, [data-interactive='true']")
      )
      setIsHovered(isInteractive)
    }

    const onMouseLeave = () => {
      setIsVisible(false)
      setIsHovered(false)
    }

    const onMouseEnter = () => {
      setIsVisible(true)
    }

    // Animação contínua do anel e do ponto
    const animate = () => {
      const lerpFactor = 0.18
      const dx = mousePos.current.x - ringPos.current.x
      const dy = mousePos.current.y - ringPos.current.y

      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        ringPos.current.x = mousePos.current.x
        ringPos.current.y = mousePos.current.y
      } else {
        ringPos.current.x += dx * lerpFactor
        ringPos.current.y += dy * lerpFactor
      }

      // translate(-50%, -50%) garante centralização absoluta e simétrica em qualquer escala
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true })
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("mouseover", onMouseOver)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mouseenter", onMouseEnter)

    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("mouseover", onMouseOver)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mouseenter", onMouseEnter)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  // Não renderiza em dispositivos móveis ou tablets
  if (isTouchDevice) {
    return null
  }

  return (
    <>
      {/* Ponto Central Sólido */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform transition-opacity duration-150 ${
          !isVisible ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full bg-emerald-700 transition-all duration-150 ease-out origin-center ${
            isHovered ? "scale-0 opacity-0" : isClicking ? "scale-75 bg-emerald-800" : "scale-100 opacity-100"
          }`}
        />
      </div>

      {/* Anel Externo Translúcido com Efeito Trailing */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform transition-opacity duration-200 ${
          !isVisible ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className={`rounded-full transition-all duration-200 ease-out origin-center flex items-center justify-center ${
            isHovered
              ? "w-12 h-12 border-2 border-emerald-600 bg-emerald-500/25 shadow-sm"
              : isClicking
              ? "w-7 h-7 border border-emerald-600 bg-emerald-500/30"
              : "w-8 h-8 border border-emerald-500/50 bg-emerald-500/5"
          }`}
        />
      </div>
    </>
  )
}
