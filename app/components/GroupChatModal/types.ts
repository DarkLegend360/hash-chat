import { User } from "@prisma/client";

export type GroupChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
};
