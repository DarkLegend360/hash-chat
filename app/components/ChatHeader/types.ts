import { Chat, User } from "@prisma/client";

export type ChatHeaderProps = {
  chat: Chat & {
    users: User[];
  };
};
