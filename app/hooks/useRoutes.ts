import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUser, HiUsers } from "react-icons/hi2";
import { signOut } from "next-auth/react";
import useConversation from "./useChat";

const useRoutes = () => {
  const pathname = usePathname();
  const { chatId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Chats",
        href: "/chats",
        icon: HiChat,
        active: pathname === "/chats" || !!chatId,
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        active: pathname === "/users",
      },
      {
        label: "Logout",
        href: "/#",
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    []
  );
  return routes;
};

export default useRoutes;
