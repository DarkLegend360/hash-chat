import getMessages from "@/app/actions/getMessages";
import getChatsById from "../../actions/getChatById";
import { ChatProps, IParams } from "./types";
import EmptyState from "../../components/EmptyState/page";
import ChatHeader from "../../components/ChatHeader/layout";
import ChatBody from "../../components/ChatBody/layout";
import ChatFooter from "../../components/ChatFooter/layout";

const chatId = async ({ params }: { params: IParams }) => {
  const chat = await getChatsById(params.chatId);
  const messages = await getMessages(params.chatId);
  if (!chat) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <ChatHeader chat={chat} />
        <ChatBody initialMessages={messages} />
        <ChatFooter />
      </div>
    </div>
  );
};

export default chatId;
