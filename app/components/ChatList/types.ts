import { FullChatType } from "@/app/types";
import { Chat, User } from "@prisma/client";

export type ChatListProps = {
  initialChats: FullChatType[];
  users: User[];
};
