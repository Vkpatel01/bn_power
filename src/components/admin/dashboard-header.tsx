import Image from "next/image";
interface DashboardHeaderProps {
  onLogout: () => void
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
           <Image    src="/bnpe-logo.jpg" alt="BN Power Logo" width={50} height={50} className="w-full h-full object-cover"  />
          </div>

          <span className="font-bold text-lg">BN Power Admin</span>
        </div>
      </div>
    </header>
  )
}
