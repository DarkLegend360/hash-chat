"use client";
import { useEffect, useMemo, useState } from "react";
import { ChatListProps } from "./types";
import { useRouter } from "next/navigation";
import useChat from "@/app/hooks/useChat";
import clsx from "clsx";
import { MdOutlineGroupAdd } from "react-icons/md";
import ChatBox from "../ChatBox/layout";
import GroupChatModal from "../GroupChatModal/layout";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/pusher";
import { find } from "lodash";
import { FullChatType } from "@/app/types";

const ChatList: React.FC<ChatListProps> = (props) => {
  const { initialChats, users } = props;
  const router = useRouter();
  const session = useSession();
  const { chatId, isOpen } = useChat();
  const [chats, setChats] = useState<FullChatType[]>(initialChats);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const pusherKey = useMemo(
    () => session?.data?.user?.email,
    [session?.data?.user?.email]
  );
  useEffect(() => {
    if (!pusherKey) {
      return;
    }
    const handleNewChat = (chat: any) => {
      setChats((prevChats) => {
        if (find(prevChats, { id: chat.id })) {
          return prevChats;
        }
        return [chat, ...prevChats];
      });
    };
    const handleMessageUpdate = (chat: FullChatType) => {
      setChats((prevChats: FullChatType[]) =>
        prevChats.map((curChat: FullChatType) => {
          if (curChat.id === chat.id) {
            return {
              ...curChat,
              messages: chat.messages,
            };
          }
          return curChat;
        })
      );
    };
    const handleRemoveChat = (chat: FullChatType) => {
      setChats((prevChats) => [
        ...prevChats.filter((curChat) => curChat.id !== chat.id),
      ]);
      if (chatId === chat.id) {
        router.push("/chats");
      }
    };
    pusherClient.subscribe(pusherKey);
    pusherClient.bind("chat:new", handleNewChat);
    pusherClient.bind("chat:update", handleMessageUpdate);
    pusherClient.bind("chat:delete", handleRemoveChat);
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("chat:new", handleNewChat);
      pusherClient.unbind("chat:update", handleMessageUpdate);
      pusherClient.unbind("chat:delete", handleRemoveChat);
    };
  }, [chatId, pusherKey, router]);
  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
          isOpen ? "hidden" : "block"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Chats</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {chats.map((chat) => (
            <ChatBox key={chat.id} data={chat} selected={chatId === chat.id} />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ChatList;
