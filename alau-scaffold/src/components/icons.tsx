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
