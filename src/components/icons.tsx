import type { ReactNode, SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: Props & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: Props) => (
  <Icon {...p}><path d="M3 11l9-8 9 8" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></Icon>
);
export const BookOpenIcon = (p: Props) => (
  <Icon {...p}><path d="M12 6c-2-1.5-5-2-9-2v15c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2z" /><path d="M12 6v15" /></Icon>
);
export const WordsIcon = (p: Props) => (
  <Icon {...p}><path d="M6 3h13v18H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M4 18a2 2 0 0 1 2-2h13" /><path d="M9 8h6" /></Icon>
);
export const UserIcon = (p: Props) => (
  <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></Icon>
);
export const SearchIcon = (p: Props) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></Icon>
);
export const MenuIcon = (p: Props) => (
  <Icon {...p}><path d="M4 6h16" /><path d="M4 12h10" /><path d="M4 18h16" /></Icon>
);
export const CaretIcon = (p: Props) => (
  <Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>
);
export const CloseIcon = (p: Props) => (
  <Icon {...p}><path d="M6 6l12 12" /><path d="M18 6L6 18" /></Icon>
);
export const ArrowRightIcon = (p: Props) => (
  <Icon {...p}><path d="M4 12h16" /><path d="M14 6l6 6-6 6" /></Icon>
);
export const ArrowLeftIcon = (p: Props) => (
  <Icon {...p}><path d="M20 12H4" /><path d="M10 6l-6 6 6 6" /></Icon>
);
export const BookmarkIcon = ({ filled, ...p }: Props & { filled?: boolean }) => (
  <Icon {...p} fill={filled ? "currentColor" : "none"}><path d="M6 3h12v18l-6-4-6 4z" /></Icon>
);
export const CheckIcon = (p: Props) => (
  <Icon {...p}><path d="M4 12l5 5L20 6" /></Icon>
);
export const PanelIcon = (p: Props) => (
  <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16" /></Icon>
);
export const RepeatIcon = (p: Props) => (
  <Icon {...p}><path d="M4 12a8 8 0 0 1 14-5.3L20 9" /><path d="M20 4v5h-5" /><path d="M20 12a8 8 0 0 1-14 5.3L4 15" /><path d="M4 20v-5h5" /></Icon>
);
export const LogoutIcon = (p: Props) => (
  <Icon {...p}><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="M9 8l-4 4 4 4" /><path d="M5 12h11" /></Icon>
);
export const SpeakerIcon = (p: Props) => (
  <Icon {...p}><path d="M11 5L6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></Icon>
);
export const CardsIcon = (p: Props) => (
  <Icon {...p}><rect x="8" y="3" width="12" height="16" rx="2" /><path d="M16 21H6a2 2 0 0 1-2-2V7" /><path d="M14 8.5l-2 2.5 2 2.5 2-2.5z" /></Icon>
);
export const SortIcon = (p: Props) => (
  <Icon {...p}><path d="M4 7h16" /><path d="M7 12h10" /><path d="M10 17h4" /></Icon>
);
export const FolderIcon = (p: Props) => (
  <Icon {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M8 13h8" /></Icon>
);
export const PageIcon = (p: Props) => (
  <Icon {...p}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /></Icon>
);
export const LockIcon = (p: Props) => (
  <Icon {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Icon>
);
