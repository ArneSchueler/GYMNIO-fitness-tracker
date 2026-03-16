import { Button } from "@/components/ui/button";

export function ButtonIcon({ children }) {
  return (
    <Button variant="outline" size="icon" className="text-white bg-transparent">
      {children}
    </Button>
  );
}
