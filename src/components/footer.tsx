import { Mail, Phone, Linkedin, Twitter, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">BN</span>
              </div>
              <span className="font-bold text-lg">BN Power Enterprises</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Leading provider of power infrastructure and industrial engineering solutions.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#about" className="hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-accent transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-accent transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Mechanical Erection
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Equipment Maintenance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Fabrication Services

                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Overhauling Solutions
                </a>
              </li>
                            <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Manpower Supply
                </a>
              </li>
                            <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Rotary & Static Equipment Erection
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@bnpower.com" className="hover:text-accent transition-colors">
                  bnpowerenterprises@gmail.com

                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+919547163823" className="hover:text-accent transition-colors">
                  +91 9547163823, +91 7782901308
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-primary-foreground/80 mb-4 md:mb-0">© 2025 BN Power. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
