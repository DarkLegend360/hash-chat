"use client";

import Link from "next/link";
import { MobileItemProps } from "./types";
import clsx from "clsx";

const MobileItem: React.FC<MobileItemProps> = (props) => {
  const { label, href, icon: Icon, active, onClick } = props;

  return (
    <Link
      href={href}
      onClick={() => onClick?.()}
      className={clsx(
        "group flex gap-x-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100 w-full justify-center p-4",
        active && "bg-gray-100 text-black"
      )}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
};

export default MobileItem;
