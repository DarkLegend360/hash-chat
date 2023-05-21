import { useSession } from "next-auth/react";
import { useMemo } from "react";

const useOtherUser = (chat: any) => {
  const session = useSession();
  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;
    const otherUser = chat.users.find(
      (user: any) => user.email !== currentUserEmail
    );
    return otherUser;
  }, [session?.data?.user?.email, chat.users]);
  return otherUser;
};

export default useOtherUser;
