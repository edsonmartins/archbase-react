import { useLocation, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

export function useArchbaseDrawer(drawerKey: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const openDrawer = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('drawer', drawerKey);
    
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString()
    });
  };

  return { openDrawer };
}