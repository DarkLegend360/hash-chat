import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "../../../prisma/prismadb";
import { pusherServer } from "@/app/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { userId, isGroup, members, name } = await request.json();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }
    if (isGroup) {
      const newChat = await prisma.chat.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              { id: currentUser.id },
            ],
          },
        },
        include: { users: true },
      });
      newChat.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "chat:new", newChat);
        }
      });
      return NextResponse.json(newChat);
    }
    const existingChats = await prisma.chat.findMany({
      where: {
        OR: [
          { userIds: { equals: [currentUser.id, userId] } },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const chatExists = existingChats[0];
    if (chatExists) {
      return NextResponse.json(chatExists);
    }

    const newChat = await prisma.chat.create({
      data: {
        users: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: {
        users: true,
      },
    });

    newChat.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "chat:new", newChat);
      }
    });
    return NextResponse.json(newChat);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
