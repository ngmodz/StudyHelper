
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Function to check mobile status
    const checkMobile = () => {
      // Use both media query and screen size check for more reliability
      const isMobileByMedia = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
      const isMobileBySize = window.innerWidth < MOBILE_BREAKPOINT;
      
      // Additional check for mobile devices by user agent
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Set as mobile if either condition is true
      setIsMobile(isMobileByMedia || isMobileBySize || isMobileDevice);
    };
    
    // Initial check
    checkMobile();
    
    // Set up event listeners for resize and orientation change
    window.addEventListener("resize", checkMobile);
    window.addEventListener("orientationchange", checkMobile);
    
    // Media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
      mql.removeEventListener("change", checkMobile);
    }
  }, [])

  return !!isMobile
}

export default useMobile;
