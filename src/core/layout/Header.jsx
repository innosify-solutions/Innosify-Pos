import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@utils/cn';

const iconBtn =
  'flex h-9 w-9 items-center justify-center rounded-full text-emerald-700 transition-colors hover:text-[#0C4C2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1';

/**
 * Manual sync trigger (left of OnePos).
 * Today it runs a simulated sync so the spin-to-done motion is reviewable;
 * later, pass `onSync` that calls the real sync APIs (it may return a promise).
 */
export function Header({ onSync }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('idle'); // idle | syncing | done
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Module base (e.g. /retail) derived from the current URL so core stays generic.
  const base = `/${location.pathname.split('/')[1] || 'retail'}`;

  const handleSync = async () => {
    if (status === 'syncing') return;
    setStatus('syncing');
    try {
      if (onSync) {
        await onSync();
      } else {
        // Simulated sync — replace with real API calls via onSync later.
        await new Promise((resolve) => {
          timers.current.push(setTimeout(resolve, 2000));
        });
      }
      setStatus('done');
      timers.current.push(setTimeout(() => setStatus('idle'), 1500));
    } catch {
      setStatus('idle');
    }
  };

  return (
    <header className="flex h-[52px] w-full shrink-0 items-center justify-between bg-white px-5">
      {/* Left edge — store name */}
      <span className="text-[24px] font-bold leading-none tracking-tight text-[#111111]">
        Takshi
      </span>

      {/* Right edge — utility icons, then OnePos brand */}
      <span className="flex items-center">
        <button
          type="button"
          onClick={handleSync}
          disabled={status === 'syncing'}
          title={status === 'syncing' ? 'Syncing…' : status === 'done' ? 'Sync complete' : 'Sync now'}
          aria-label={status === 'syncing' ? 'Syncing' : status === 'done' ? 'Sync complete' : 'Sync now'}
          className={cn(
            iconBtn,
            status === 'done' && 'text-green-600',
            status === 'syncing' && 'opacity-70'
          )}
        >
          {status === 'done' ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className={cn('h-5 w-5', status === 'syncing' && 'animate-spin')}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.2}
            >
              <defs>
                <linearGradient id="onepos-sync-grad" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#0C4C2A" />
                </linearGradient>
              </defs>
              <path
                stroke="url(#onepos-sync-grad)"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4"
              />
              <circle cx="20" cy="16.5" r="1.4" fill="#059669" stroke="none" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate(`${base}/help`)}
          title="Help & Support"
          aria-label="Help and Support"
          className={cn(iconBtn, 'ml-1')}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 2.6-3 4.5M12 17.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => navigate(`${base}/profile`)}
          title="Settings"
          aria-label="Settings"
          className={cn(iconBtn, 'ml-1')}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
          </svg>
        </button>

        {/* Brand — about an inch clear of the icons */}
        <span className="ml-24 flex items-center gap-1.5">
          <span className="text-[22px] font-bold leading-none tracking-tight text-[#12372A]">
            OnePos
          </span>
          <svg viewBox="0 0 36 36" className="h-[30px] w-[30px]" aria-hidden="true">
            {/* 3D cube matching reference — greens */}
            <path d="M18 2 32 10v16L18 34 4 26V10L18 2z" fill="#0B6B3A" />
            <path d="M18 2 32 10 18 18 4 10 18 2z" fill="#2FA36B" />
            <path d="M18 18v16L4 26V10l14 8z" fill="#0A4A29" />
            <path d="M18 18v16l14-8V10l-14 8z" fill="#147A45" />
            <path d="M18 2 32 10 18 18 4 10 18 2z" fill="white" fillOpacity="0.08" />
          </svg>
        </span>
      </span>
    </header>
  );
}
