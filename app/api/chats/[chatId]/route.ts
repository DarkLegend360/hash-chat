import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prismadb";
import { pusherServer } from "@/app/pusher";

export async function DELETE(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chatExists = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });

    if (!chatExists) {
      return new NextResponse("Invalid Id", { status: 400 });
    }

    chatExists.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "chat:delete", chatExists);
      }
    });

    const deleteChat = await prisma.chat.deleteMany({
      where: {
        id: chatId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    return NextResponse.json(deleteChat);
  } catch (err) {
    console.log(err, "ERROR_DELETE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
