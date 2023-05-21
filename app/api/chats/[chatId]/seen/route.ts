import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prismadb";
import { pusherServer } from "@/app/pusher";

interface IParams {
  chatId?: string;
}
export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { chatId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    if (!chat) {
      return new NextResponse("Invalid ID", { status: 400 });
    }
    const lastMessage = chat.messages[chat.messages.length - 1];
    if (!lastMessage) {
      return NextResponse.json(chat);
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    await pusherServer.trigger(currentUser.email!, "chat:update", {
      id: chatId,
      messages: [updatedMessage],
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) != -1) {
      return NextResponse.json(chat);
    }
    await pusherServer.trigger(chatId!, "message:update", updatedMessage);
    return NextResponse.json(updatedMessage);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
