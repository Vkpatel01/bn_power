import { Card } from "@/components/ui/card"
import { Wrench, Cog, Hammer, Zap, Users, Briefcase } from "lucide-react"

export function Services() {
  const services = [
    {
      title: "Mechanical Erection",
      description:
        "Precision installation of rotary and static equipment following international safety and quality standards.",
      icon: Wrench,
    },
    {
      title: "Equipment Maintenance",
      description: "Expert maintenance and performance optimization of turbines, compressors, and plant machinery.",
      icon: Cog,
    },
    {
      title: "Fabrication Services",
      description: "Mastery in structural and piping fabrication with impeccable quality and technical precision.",
      icon: Hammer,
    },
    {
      title: "Overhauling Solutions",
      description: "Complete overhauling of critical industrial equipment, enhancing longevity and reliability.",
      icon: Zap,
    },
    {
      title: "Manpower Supply",
      description: "Skilled, experienced manpower for industrial, thermal, and power plant operations.",
      icon: Users,
    },
    {
      title: "Rotary & Static Equipment Erection",
      description: "Specialized erection services for turbines, pumps, compressors, and related mechanical systems.",
      icon: Briefcase,
    },
  ]

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            BN Power Enterprises delivers a comprehensive range of mechanical and engineering services, specializing in
            erection, fabrication, maintenance, and overhauling for power and industrial projects across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card key={service.title} className="p-8 hover:shadow-lg transition-shadow border border-border bg-card">
                <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
