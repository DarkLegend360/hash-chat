import prisma from "../../prisma/prismadb";
import getCurrentUser from "./getCurrentUser";

const getChatsById = async (chatId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return null;
    }
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });
    return chat;
  } catch {
    return null;
  }
};

export default getChatsById;
