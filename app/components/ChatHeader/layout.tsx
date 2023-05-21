"use client";
import useOtherUser from "@/app/hooks/useOtherUser";
import { ChatHeaderProps } from "./types";
import { useMemo, useState } from "react";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import Avatar from "../Avatar/layout";
import { User } from "@prisma/client";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ChatMenu from "../ChatMenu/layout";
import useActiveList from "../../hooks/useActiveList";

const ChatHeader: React.FC<ChatHeaderProps> = (props) => {
  const { chat } = props;
  const otherUser: User = useOtherUser(chat);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const statusText = useMemo(() => {
    if (chat.isGroup) {
      return `${chat.users.length} members`;
    }
    return isActive ? "Active" : "Offline";
  }, [chat.isGroup, chat.users.length, isActive]);
  return (
    <>
      <ChatMenu
        data={chat}
        isOpen={isMenuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <div className="bg-white w-full flex board-b-[1px] sm:px-4 py-3 px-4 lg:px-5 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            className="lg:hidden block text-sky600 transition cursor-pointer"
            href="/chats"
          >
            <HiChevronLeft size={32} />
          </Link>
          <Avatar user={otherUser} />
          <div className="flex flex-col">
            <div>{chat.name || otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
          size={32}
          onClick={() => setMenuOpen(true)}
        />
      </div>
    </>
  );
};

export default ChatHeader;
