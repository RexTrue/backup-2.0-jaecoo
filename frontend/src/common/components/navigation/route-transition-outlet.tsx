import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

type TransitionStage = 'enter' | 'exit';

export function RouteTransitionOutlet({ className = '' }: { className?: string }) {
  const location = useLocation();
  const outlet = useOutlet();
  const [displayOutlet, setDisplayOutlet] = useState<ReactNode>(outlet);
  const [displayPath, setDisplayPath] = useState(location.pathname);
  const [stage, setStage] = useState<TransitionStage>('enter');

  useEffect(() => {
    if (location.pathname === displayPath) {
      setDisplayOutlet(outlet);
      return;
    }

    setStage('exit');
    const switchTimer = window.setTimeout(() => {
      setDisplayOutlet(outlet);
      setDisplayPath(location.pathname);
      setStage('enter');
    }, 140);

    return () => window.clearTimeout(switchTimer);
  }, [displayPath, location.pathname, outlet]);

  return (
    <div className={[className, 'route-transition-shell', stage === 'enter' ? 'route-transition-enter' : 'route-transition-exit'].join(' ').trim()}>
      {displayOutlet}
    </div>
  );
}
