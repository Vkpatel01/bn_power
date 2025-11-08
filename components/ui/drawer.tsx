'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DrawerContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DrawerContext = React.createContext<DrawerContextType | undefined>(undefined)

function Drawer({ open, onOpenChange, children }: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setOpen = React.useCallback((newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }, [isControlled, onOpenChange])

  return (
    <DrawerContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DrawerContext.Provider>
  )
}

function DrawerTrigger({ children, ...props }: React.ComponentProps<'button'>) {
  const context = React.useContext(DrawerContext)
  if (!context) throw new Error('DrawerTrigger must be used within Drawer')
  
  return (
    <button
      {...props}
      onClick={() => context.setOpen(true)}
    >
      {children}
    </button>
  )
}

function DrawerPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DrawerClose({ children, ...props }: React.ComponentProps<'button'>) {
  const context = React.useContext(DrawerContext)
  if (!context) throw new Error('DrawerClose must be used within Drawer')
  
  return (
    <button
      {...props}
      onClick={() => context.setOpen(false)}
    >
      {children}
    </button>
  )
}

function DrawerOverlay({ className, ...props }: React.ComponentProps<'div'>) {
  const context = React.useContext(DrawerContext)
  if (!context) throw new Error('DrawerOverlay must be used within Drawer')
  
  if (!context.open) return null
  
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/50 animate-in fade-in-0',
        className,
      )}
      onClick={() => context.setOpen(false)}
      {...props}
    />
  )
}

function DrawerContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  const context = React.useContext(DrawerContext)
  if (!context) throw new Error('DrawerContent must be used within Drawer')
  
  if (!context.open) return null
  
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[80vh] flex-col rounded-t-lg border-t bg-background animate-in slide-in-from-bottom-0',
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full bg-muted" />
        {children}
      </div>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 p-4 text-center', className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  )
}

function DrawerDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
