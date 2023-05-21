import { User } from "@prisma/client";

export type SettingsProps = {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
};
