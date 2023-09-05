import { useRef, useEffect, ReactNode } from 'react';

interface ArchbaseClickOutsideProps {
  children: ReactNode;
  exceptionRef?: any;
  onClick: (event: MouseEvent) => void;
  className?: string;
}

export function ArchbaseClickOutside({ children, exceptionRef, onClick, className } : ArchbaseClickOutsideProps) {
  const wrapperRef = useRef<any>();

  useEffect(() => {
    document.addEventListener('mousedown', handleClickListener);
    
    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  }, []);

  const handleClickListener = (event) => {
    let clickedInside;
    if(exceptionRef) {
      clickedInside = (wrapperRef && wrapperRef.current!.contains(event.target)) || exceptionRef.current === event.target || exceptionRef.current.contains(event.target);
    }
    else {
      clickedInside = (wrapperRef && wrapperRef.current!.contains(event.target));
    }

    if (clickedInside) return;
    else onClick(event);
  }
  
  return (
    <div ref={wrapperRef} className={`${className || ''}`}>
      {children}
    </div>
  );
};