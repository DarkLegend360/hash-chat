import prisma from "../../prisma/prismadb";
import getCurrentUser from "./getCurrentUser";

const getChats = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    return [];
  }
  try {
    const chats = await prisma.chat.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
    return chats;
  } catch {
    return [];
  }
};

export default getChats;
