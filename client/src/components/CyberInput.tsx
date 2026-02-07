import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  ({ label, error, className, icon, ...props }, ref) => {
    return (
      <div className="space-y-2 group">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors flex items-center gap-2">
          {icon && <span className="text-primary/70">{icon}</span>}
          {label}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              "cyber-input h-10 bg-background/50 border-white/10 text-white placeholder:text-white/20",
              error && "border-destructive/50 focus:border-destructive ring-destructive/20",
              className
            )}
            {...props}
          />
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-focus-within:w-full" />
        </div>
        {error && <p className="text-xs text-destructive font-mono mt-1">{error}</p>}
      </div>
    );
  }
);
CyberInput.displayName = "CyberInput";
