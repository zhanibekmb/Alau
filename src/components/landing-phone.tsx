import Image from "next/image";

// A phone for the landing page: a drawn frame around a real screenshot of the app
// (public/landing/phone-*.png, 390×797 CSS px at 2x, taken from the running site at phone width).
// The phone is drawn at its natural size (414×868) and scaled with the --s variable,
// so set the size from outside with classes like "[--s:0.66] md:[--s:0.8]".

export type PhoneShot = "reader" | "dictionary" | "review";

/** Background behind the status bar: must match the top of the screenshot. */
// The review sheet dims the page behind it, so its status bar is the dimmed white.
const STATUS_BG: Record<PhoneShot, string> = { reader: "#fcfbf7", dictionary: "#ffffff", review: "#8c8c8c" };

export function Phone({ shot, className = "", priority = false }: { shot: PhoneShot; className?: string; priority?: boolean }) {
  return (
    <div className={`relative h-[calc(868px*var(--s))] w-[calc(414px*var(--s))] shrink-0 ${className}`}>
      <div
        className="relative h-[868px] w-[414px] origin-top-left rounded-[60px] p-[3px] [transform:scale(var(--s))]"
        style={{
          background: "linear-gradient(135deg,#e4e1db 0%,#8d8a85 22%,#f1eee8 45%,#7b7873 70%,#d6d3cd 100%)",
          boxShadow: "0 2px 3px rgba(0,0,0,.25), 0 30px 60px -18px rgba(32,31,75,.5), 0 60px 110px -30px rgba(32,31,75,.4)",
        }}
      >
        {/* Side buttons. */}
        <span className="absolute -left-[3px] top-[178px] h-[34px] w-1 rounded-sm bg-[#9a9792]" />
        <span className="absolute -left-[3px] top-[240px] h-[60px] w-1 rounded-sm bg-[#9a9792]" />
        <span className="absolute -left-[3px] top-[312px] h-[60px] w-1 rounded-sm bg-[#9a9792]" />
        <span className="absolute -right-[3px] top-[250px] h-[96px] w-1 rounded-sm bg-[#9a9792]" />

        <div className="h-full rounded-[57px] bg-[#050506] p-[9px]">
          <div className="relative h-full overflow-hidden rounded-[48px]" style={{ background: STATUS_BG[shot] }}>
            <div className="flex h-[47px] items-center justify-between pl-[38px] pr-[30px] pt-1.5 text-base font-semibold leading-none text-black">
              <span>9:41</span>
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 18 12" className="h-3 w-auto" fill="currentColor">
                  <rect x="0" y="8" width="3" height="4" rx=".8" />
                  <rect x="5" y="5.5" width="3" height="6.5" rx=".8" />
                  <rect x="10" y="3" width="3" height="9" rx=".8" />
                  <rect x="15" y="0" width="3" height="12" rx=".8" />
                </svg>
                <svg viewBox="0 0 17 12" className="h-3 w-auto" fill="currentColor">
                  <path d="M8.5 2.6c2.3 0 4.4.9 6 2.4l1-1.1A10.2 10.2 0 0 0 8.5 1a10.2 10.2 0 0 0-7 2.900l1 1.100a8.700 8.700 0 0 1 6-2.400zm0 3.300c1.400 0 2.700.5 3.700 1.400l1-1.100a7 7 0 0 0-9.400 0l1 1.100c1-.9 2.300-1.400 3.700-1.400zm0 3.200c-.7 0-1.300.3-1.800.7l1.800 2 1.800-2c-.5-.4-1.100-.7-1.800-.7z" />
                </svg>
                <svg viewBox="0 0 27 12" className="h-3 w-auto" fill="currentColor">
                  <rect x=".5" y=".5" width="22" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".4" />
                  <rect x="2" y="2" width="19" height="8" rx="2" />
                  <path d="M24 4v4c.8-.3 1.500-1.100 1.500-2S24.800 4.300 24 4z" opacity=".45" />
                </svg>
              </span>
            </div>
            {/* Camera cut-out. */}
            <span className="absolute left-1/2 top-[11px] h-[35px] w-[122px] -translate-x-1/2 rounded-[20px] bg-black" />
            <Image
              src={`/landing/phone-${shot}.png`}
              alt=""
              width={390}
              height={797}
              sizes="390px"
              priority={priority}
              className="h-[797px] w-[390px] max-w-none"
            />
            <span className="absolute bottom-2 left-1/2 h-[5px] w-[136px] -translate-x-1/2 rounded-full bg-black/85" />
          </div>
        </div>
      </div>
    </div>
  );
}
