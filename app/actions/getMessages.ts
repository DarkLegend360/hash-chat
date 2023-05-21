import prisma from "../../prisma/prismadb";
const getMessages = async (chatId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId: chatId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return messages;
  } catch {
    return [];
  }
};

export default getMessages;
