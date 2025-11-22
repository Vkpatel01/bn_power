import { getLastTenFinancialYears } from "@/lib/fy-utils"

interface FYDropdownProps {
  value: string
  onChange: (fy: string) => void
}

export function FYDropdown({ value, onChange }: FYDropdownProps) {
  const fyOptions = getLastTenFinancialYears()

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-muted-foreground">FY:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium"
      >
        {fyOptions.map((fy) => (
          <option key={fy} value={fy}>
            FY {fy}
          </option>
        ))}
      </select>
    </div>
  )
}
