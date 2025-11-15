import { Card } from "@/components/ui/card"

export function Projects() {
  const projects = [
    {
      title: "Sasan Ultra Mega Power Plant (6×660 MW, M.P.)",
      description: "Complete mechanical erection and overhauling works at one of India's largest thermal power sites.",
      image: "/thermal-power-plant-mechanical-erection-sasan.jpg",
    },
    {
      title: "Haldia Energy Ltd. (2×300 MW, West Bengal)",
      description: "Overhauling and maintenance of turbine auxiliaries and plant systems.",
      image: "/turbine-maintenance-haldia-power-plant.jpg",
    },
    {
      title: "Adani Power Ltd., Mundra (660 MW, Gujarat)",
      description: "TG overhauling and compressor maintenance services for high-capacity thermal units.",
      image: "/adani-power-plant-compressor-maintenance.jpg",
    },
    {
      title: "JP Nigrei Super Thermal Power Plant (M.P.)",
      description: "Specialized mechanical erection and equipment commissioning services.",
      image: "/super-thermal-power-plant-mechanical-work.jpg",
    },
    {
      title: "Talwandi Sabo Power Limited (Punjab)",
      description: "Equipment maintenance and overhauling of critical turbine and auxiliary systems.",
      image: "/power-plant-turbine-maintenance-punjab.jpg",
    },
    {
      title: "Jhabua Thermal Power Project (M.P.)",
      description: "Complete mechanical fabrication and erection of plant equipment.",
      image: "/thermal-power-project-fabrication-workshop.jpg",
    },
  ]

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Major Projects</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            BN Power Enterprises has successfully executed 100+ power and industrial projects across India, delivering
            excellence in mechanical erection, fabrication, and maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.title} className="overflow-hidden hover:shadow-xl transition-shadow border-0 bg-card">
              <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3">{project.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
