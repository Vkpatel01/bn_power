"use client"

import { useEffect, useState } from "react"

export function Clients() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const clients = [
    {
      name: "Reliance – Sasan Ultra Mega Power Plant",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Reliance-eJp6hbtoMrmFJ5J7c5PmIjfASdRTGn.jpeg",
    },
    {
      name: "Kirloskar Pneumatic Company Limited",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kirloskar-IrJ2xkb618uRej8wGInO0P9EBw4k9L.png",
    },
    {
      name: "Power Mech Projects Limited",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Power%20Mech-tn0iOXot6OnkxdIIhrtiQejtaZJDq1.png",
    },
    {
      name: "SIMAR Infrastructures Limited",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Simar-sLOthPJKvUSUQgWOYSgKKItgb07tqC.png",
    },
    {
      name: "Adani Power Ltd.",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adani-power-logo-UIuQgWsMMBRKACm1jEBKznxpB43ava.png",
    },
  ]

  return (
    <section id="clients" className="py-24 bg-gradient-to-b from-muted/40 to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Clients & Partners</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trusted by industry leaders across India for mechanical erection, maintenance, and fabrication excellence.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
          {clients.map((client, index) => (
            <div
              key={client.name}
              className={`flex flex-col items-center justify-center p-6 bg-card rounded-xl border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group ${
                isLoaded ? "animate-in fade-in duration-700" : "opacity-0"
              }`}
              style={{
                animationDelay: isLoaded ? `${index * 50}ms` : "0ms",
              }}
            >
              <img
                src={client.logo || "/placeholder.svg"}
                alt={client.name}
                className="h-12 w-32 object-contain mb-3 group-hover:brightness-110 transition-all"
              />
              <span className="text-muted-foreground font-medium text-center text-sm group-hover:text-primary transition-colors">
                {client.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm max-w-3xl mx-auto leading-relaxed">
            Proudly partnering with India's most trusted power and industrial enterprises to deliver excellence through
            innovation and precision.
          </p>
        </div>
      </div>
    </section>
  )
}
