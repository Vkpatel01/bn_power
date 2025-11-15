import { Button } from "@/components/ui/button"

export function About() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/mechanical-fabrication-turbine-erection-heavy-indu.jpg"
              alt="BN Power Mechanical Fabrication and Industrial Operations"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">About BN Power Enterprises</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed text-lg">
              Founded by Mr. Baidhnath Prasad, BN Power Enterprises is a distinguished name in mechanical erection,
              equipment maintenance, fabrication, and overhauling services. Our team of professional engineers and
              technicians is committed to delivering excellence, safety, and innovation across every project we
              undertake.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
              With successful partnerships including Sasan Ultra Mega Power Plant, Power Mech Projects Ltd., and
              Kirloskar Pneumatic Company, BN Power has consistently proven its expertise and reliability in the power
              and industrial sectors.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
              We operate with integrity and hold registrations under MSME, GST, EPFO, and ESIC — reflecting our
              compliance and professionalism.
            </p>
            <a
  href="/BNPower_Profile.pdf"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button className="bg-primary hover:bg-primary/90">
    Download Profile
  </Button>
</a>

          </div>
        </div>
      </div>
    </section>
  )
}
