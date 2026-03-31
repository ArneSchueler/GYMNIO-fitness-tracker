import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

interface ButtonIconProps {
  children: ReactNode;
}

export function ButtonIcon({ children }: ButtonIconProps) {
  return (
    <Button variant="outline" size="icon" className="text-white bg-transparent">
      {children}
    </Button>
  );
}
