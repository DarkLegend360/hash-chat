import { Chat, User } from "@prisma/client";

export type ChatMenuProps = {
  data: Chat & {
    users: User[];
  };
  isOpen: boolean;
  onClose: () => void;
};
