import { NavLink } from 'react-router-dom';
import { cn } from '@utils/cn';
import { getActiveModuleNavigation } from '@app/moduleRegistry';

function NavIcon({ name, active, className }) {
  const common = {
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  // Solid bag for New Sale (matches reference)
  if (name === 'sale') {
    if (active) {
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
          <path d="M6.2 7.5h11.6c.4 0 .7.3.78.7l1.3 11c.05.5-.34.8-.78.8H4.9c-.44 0-.83-.3-.78-.8l1.3-11c.08-.4.38-.7.78-.7Z" />
          <path
            d="M8.5 10.5V6.8a3.5 3.5 0 0 1 7 0v3.7"
            fill="none"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    return (
      <svg {...common} className={className} aria-hidden="true">
        <path d="M6.2 7.5h11.6c.4 0 .7.3.78.7l1.3 11c.05.5-.34.8-.78.8H4.9c-.44 0-.83-.3-.78-.8l1.3-11c.08-.4.38-.7.78-.7Z" />
        <path d="M8.5 10.5V6.8a3.5 3.5 0 0 1 7 0v3.7" />
      </svg>
    );
  }
  const paths = {
    held: (
      <>
        <rect x="5" y="4.5" width="14" height="16" rx="2" />
        <path d="M9 4.5V3.2A1.2 1.2 0 0 1 10.2 2h3.6A1.2 1.2 0 0 1 15 3.2v1.3" />
        <path d="M9 10h6M9 14h6M9 17.5h4" />
      </>
    ),
    sales: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="2" />
        <path d="M9 8.5h6M9 12h6M9 15.5h4" />
      </>
    ),
    returns: (
      <>
        <path d="M8.5 14 4 9.5 8.5 5" />
        <path d="M4 9.5h9.5a6 6 0 0 1 0 12H11" />
        <path d="M4 9.5V5.5" opacity="0" />
      </>
    ),
    customers: (
      <>
        <circle cx="9" cy="8.5" r="3.2" />
        <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
        <path d="M15.5 5.8a3.2 3.2 0 0 1 0 5.6" />
        <path d="M17.5 14.4a5.5 5.5 0 0 1 3 5.1" />
      </>
    ),
    shift: (
      <>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
    cash: (
      <>
        <rect x="3" y="6.5" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 14.5h4" />
        <rect x="15.5" y="13.5" width="2.5" height="2.5" rx="0.5" />
      </>
    ),
    reports: (
      <>
        <rect x="4" y="3.5" width="16" height="17" rx="2" />
        <path d="M8.5 14v2.5" />
        <path d="M12 10.5V16.5" />
        <path d="M15.5 13v3.5" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M9.6 9.3A2.5 2.5 0 0 1 12 7.5c1.4 0 2.5 1 2.5 2.2 0 1.7-2.2 2-2.4 3.3" />
        <path d="M12 16.8h.01" strokeWidth="2.2" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M5 19.5a7 7 0 0 1 14 0" />
      </>
    ),
  };
  return (
    <svg {...common} className={className} aria-hidden="true">
      {paths[name] || paths.sale}
    </svg>
  );
}

export function Sidebar() {
  const navigation = getActiveModuleNavigation();
  const { primary = [] } = navigation || {};
  // Must match AppLayout content bg so active tab melts into page
  const ACTIVE_BG = '#eef0f3';
  const SIDEBAR_BG = '#0C4C2A';
  const CURVE = 18;

  return (
    <aside className="flex w-[228px] shrink-0 flex-col bg-[#0C4C2A]">
      <nav className="flex flex-1 flex-col overflow-visible pb-[28px] pl-3 pr-0 pt-[28px]">
        <div className="flex-1 space-y-[10px] overflow-visible">
          {primary.map((item, idx) => {
            const isFirst = idx === 0;
            if (!item.path) {
              return (
                <span
                  key={item.label}
                  className="mr-3 flex items-center gap-3 rounded-[12px] px-3 py-[11px] text-[14px] font-medium text-white/40"
                >
                  <NavIcon name={item.icon} active={false} className="h-[22px] w-[22px] shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
              );
            }
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 px-3 text-[14.5px]',
                    isFirst ? 'py-[13px]' : 'py-[11px]',
                    isActive
                      ? 'mr-0 rounded-l-[14px] rounded-r-none text-[#111111] text-[15px] font-semibold'
                      : 'mr-3 rounded-[12px] text-[#C9D6CC] font-medium hover:bg-white/[0.08] hover:text-white'
                  )
                }
                style={({ isActive }) =>
                  isActive ? { backgroundColor: ACTIVE_BG } : undefined
                }
              >
                {({ isActive }) => (
                  <>
                    {/* River flow — every active tab melts into the page with
                        rounded right-top & right-bottom arcs. No animation. */}
                    {isActive && (
                      <>
                        <span
                          aria-hidden="true"
                          className="absolute right-0 pointer-events-none"
                          style={{
                            top: -CURVE,
                            width: CURVE,
                            height: CURVE,
                            backgroundColor: ACTIVE_BG,
                          }}
                        >
                          <span
                            className="block h-full w-full"
                            style={{
                              backgroundColor: SIDEBAR_BG,
                              borderBottomRightRadius: CURVE,
                            }}
                          />
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute right-0 pointer-events-none"
                          style={{
                            bottom: -CURVE,
                            width: CURVE,
                            height: CURVE,
                            backgroundColor: ACTIVE_BG,
                          }}
                        >
                          <span
                            className="block h-full w-full"
                            style={{
                              backgroundColor: SIDEBAR_BG,
                              borderTopRightRadius: CURVE,
                            }}
                          />
                        </span>
                      </>
                    )}
                    <NavIcon
                      name={item.icon}
                      active={isActive}
                      className={cn(
                        'h-[22px] w-[22px] shrink-0',
                        isActive ? 'text-[#0C4C2A]' : 'text-[#A9C2B0] group-hover:text-white'
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
