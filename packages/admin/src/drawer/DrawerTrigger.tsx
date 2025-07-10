import { useArchbaseDrawer } from "./useArchbaseDrawer";
import { useEffect } from "react";

export function ArchbaseDrawerTrigger({ drawerKey }: { drawerKey: string }) {
  const { openDrawer } = useArchbaseDrawer(drawerKey);
  
  useEffect(() => {
    // Abre o drawer mantendo a rota atual
    openDrawer();
  }, []);
  
  return null;
}
