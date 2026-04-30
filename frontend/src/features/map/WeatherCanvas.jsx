import { useEffect, useRef } from 'react'
import useMapStore from '../../store/useMapStore.js'

function createRainDrop(w, h) {
  return {
    x: Math.random() * (w + 100) - 50,
    y: Math.random() * h,
    speed: 12 + Math.random() * 8,
    length: 10 + Math.random() * 12,
    opacity: 0.25 + Math.random() * 0.3,
  }
}

function createSnowFlake(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    radius: 2 + Math.random() * 3,
    speed: 0.8 + Math.random() * 1.2,
    drift: Math.random() * Math.PI * 2,
    driftSpeed: 0.01 + Math.random() * 0.015,
    opacity: 0.55 + Math.random() * 0.35,
  }
}

function drawRain(ctx, drops, w, h) {
  const angle = Math.PI / 12
  const dx = Math.sin(angle)
  const dy = Math.cos(angle)

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(180, 200, 220, 0.10)'
  ctx.fillRect(0, 0, w, h)
  ctx.lineWidth = 1.5

  drops.forEach((d) => {
    ctx.beginPath()
    ctx.moveTo(d.x, d.y)
    ctx.lineTo(d.x + dx * d.length, d.y + dy * d.length)
    ctx.strokeStyle = `rgba(120, 180, 255, ${d.opacity})`
    ctx.stroke()

    d.x += dx * d.speed
    d.y += dy * d.speed

    if (d.y > h || d.x > w) {
      d.x = Math.random() * (w + 100) - 100
      d.y = -d.length
    }
  })
}

function drawSnow(ctx, flakes, w, h) {
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(210, 220, 235, 0.12)'
  ctx.fillRect(0, 0, w, h)

  flakes.forEach((f) => {
    ctx.beginPath()
    ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(220, 235, 255, ${f.opacity})`
    ctx.fill()

    f.drift += f.driftSpeed
    f.x += Math.sin(f.drift) * 0.6
    f.y += f.speed

    if (f.y > h) {
      f.y = -f.radius
      f.x = Math.random() * w
    }
  })
}

export default function WeatherCanvas() {
  const weather = useMapStore((s) => s.weather)
  const canvasRef = useRef(null)

  const isActive = weather === 'rain' || weather === 'snow'

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const w = () => canvas.width
    const h = () => canvas.height

    const particles =
      weather === 'rain'
        ? Array.from({ length: 120 }, () => createRainDrop(w(), h()))
        : Array.from({ length: 90 }, () => createSnowFlake(w(), h()))

    let rafId
    const draw = () => {
      if (weather === 'rain') drawRain(ctx, particles, w(), h())
      else drawSnow(ctx, particles, w(), h())
      rafId = requestAnimationFrame(draw)
    }
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [weather, isActive])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-canvas pointer-events-none"
    />
  )
}
