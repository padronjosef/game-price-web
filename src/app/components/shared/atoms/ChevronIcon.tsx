import { DROPDOWN_DURATION } from "./animations";

type ChevronIconProps = {
  open: boolean;
  size?: number;
};

export const ChevronIcon = ({ open, size = 12 }: ChevronIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition-all ${DROPDOWN_DURATION} ${open ? "-scale-y-100" : ""}`}
    >
      <path d="M2 4L6 8L10 4" />
    </svg>
  );
};
