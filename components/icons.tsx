type IconProps = {
  className?: string;
};

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function FolderIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4l2 2h7A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
    </svg>
  );
}

export function PathIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="5" cy="18" r="2" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="m6.6 16.4 4-8.6" />
      <path d="m13.4 7.8 4 8.6" />
    </svg>
  );
}

export function HelpIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.6 3 8.3 7 10 4-1.7 7-5.4 7-10V6z" />
      <path d="M9.5 9.5a2.7 2.7 0 0 1 5.1 1.2c0 1.8-2.6 2.2-2.6 3.8" />
      <path d="M12 18h.01" />
    </svg>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="m19 15 .7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
    </svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function ListIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M4 19h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-4" />
      <path d="m7 11 5-5 5 5" />
    </svg>
  );
}

export function FilterIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

export function FlagIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M5 21V4" />
      <path d="M5 4h10l-1 4 1 4H5" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="m8 5 11 7-11 7z" />
    </svg>
  );
}

export function FlameIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4-.5 2 .5 3 2 3 1-3-1-5 1-9" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function BookmarkIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M6 4h12v17l-6-4-6 4z" />
    </svg>
  );
}

export function BookmarkFilledIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} fill="currentColor" aria-hidden="true">
      <path d="M6 4h12v17l-6-4-6 4z" />
    </svg>
  );
}

export function AlertIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="m12 3 10 18H2z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M6 9a6 6 0 1 1 12 0c0 6 3 7 3 7H3s3-1 3-7" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

export function CommandIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M9 6a2 2 0 1 0-2 2h2zm0 0v10m0 0a2 2 0 1 0 2-2H9zm0 0h6m0 0V6m0 0a2 2 0 1 1 2 2h-2zm0 10a2 2 0 1 1-2-2h2z" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function CertificateIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M6 4h12v12H6z" />
      <path d="m8 17 4 3 4-3" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
