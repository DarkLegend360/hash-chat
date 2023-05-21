"use client";

import useChat from "@/app/hooks/useChat";
import { useEffect, useRef, useState } from "react";
import MessageBox from "../MessageBox/layout";
import { FullMessageType } from "../../types";
import axios from "axios";
import { pusherClient } from "../../pusher";
import { find } from "lodash";

const ChatBody = (props: any) => {
  const { initialMessages } = props;
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);
  const ref = useRef<HTMLDivElement>(null);
  const { chatId } = useChat();

  useEffect(() => {
    axios.post(`/api/chats/${chatId}/seen`);
  }, [chatId]);

  useEffect(() => {
    pusherClient.subscribe(chatId);
    ref?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/chats/${chatId}/seen`);
      setMessages((current: FullMessageType[]) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });
      ref?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [chatId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message: FullMessageType, i: number) => (
        <MessageBox
          key={message.id}
          data={message}
          isLast={i === messages.length - 1}
        />
      ))}
      <div ref={ref} className="pt-24" />
    </div>
  );
};

export default ChatBody;
