interface DynamicBulletIconProps {
  icon: string;
  color?: string;
}

export default function DynamicBulletIcon({ icon, color = '#1A669A' }: DynamicBulletIconProps) {
  switch (icon) {
    case 'check-circle':
      return (
        <svg
          className="w-5 h-5 shrink-0 mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'star':
      return (
        <svg
          className="w-5 h-5 shrink-0 mt-0.5"
          viewBox="0 0 24 24"
          fill={color}
          stroke={color}
          strokeWidth="1"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case 'arrow':
      return (
        <svg
          className="w-5 h-5 shrink-0 mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      );
    case 'check':
    default:
      return (
        <svg
          className="w-5 h-5 shrink-0 mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
  }
}