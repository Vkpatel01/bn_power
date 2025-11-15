"use client"

import { useEffect, useState } from "react"

export function Stats() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
      }
    })
    const element = document.getElementById("stats-section")
    if (element) observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const Counter = ({ value, label }: { value: number; label: string }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isVisible) return
      let current = 0
      const increment = value / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, 30)
      return () => clearInterval(timer)
    }, [isVisible])

    return (
      <div className="text-center">
        <div className="text-5xl md:text-6xl font-bold text-accent mb-2">
          {count}
          {value >= 1000 ? "+" : "+"}
        </div>
        <p className="text-muted-foreground text-lg">{label}</p>
      </div>
    )
  }

  return (
    <section id="stats-section" className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <Counter value={150} label="Projects Completed" />
          <Counter value={15} label="Years of Experience" />
          <Counter value={30} label="Permanent Team Members" />
        </div>
      </div>
    </section>
  )
}
