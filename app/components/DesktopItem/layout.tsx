"use client";
import clsx from "clsx";
import Link from "next/link";
import { DesktopItemProps } from "./types";

const DesktopItem: React.FC<DesktopItemProps> = (props) => {
  const { label, href, icon: Icon, active, onClick } = props;
  return (
    <li onClick={() => onClick?.()}>
      <Link
        href={href}
        className={clsx(
          "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100",
          active && "bg-gray-100 text-black"
        )}
      >
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;
