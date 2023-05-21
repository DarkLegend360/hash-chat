"use client";

import clsx from "clsx";
import useConversation from "../hooks/useChat";
import EmptyState from "../components/EmptyState/page";

const Chats = () => {
  const { isOpen } = useConversation();
  return (
    <div
      className={clsx("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
};

export default Chats;
