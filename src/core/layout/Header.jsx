export function Header() {
  return (
    <header className="flex h-[52px] w-full shrink-0 items-center bg-white">
      {/* Brand slot — owns the sidebar width */}
      <span className="flex w-[228px] shrink-0 items-center gap-1.5 pl-5">
        <svg viewBox="0 0 36 36" className="h-[30px] w-[30px]" aria-hidden="true">
          {/* 3D cube matching reference — greens */}
          <path d="M18 2 32 10v16L18 34 4 26V10L18 2z" fill="#0B6B3A" />
          <path d="M18 2 32 10 18 18 4 10 18 2z" fill="#2FA36B" />
          <path d="M18 18v16L4 26V10l14 8z" fill="#0A4A29" />
          <path d="M18 18v16l14-8V10l-14 8z" fill="#147A45" />
          <path d="M18 2 32 10 18 18 4 10 18 2z" fill="white" fillOpacity="0.08" />
        </svg>
        <span className="text-[22px] font-bold leading-none tracking-tight text-[#12372A]">
          OnePos
        </span>
      </span>

      {/* Store name — right after the brand slot */}
      <span className="text-[24px] font-bold leading-none tracking-tight text-[#111111]">
        Takshi
      </span>

      {/* Spacer for future header features */}
      <span className="flex-1" />
    </header>
  );
}
