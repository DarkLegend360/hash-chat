import getChats from "../actions/getChats";
import getUsers from "../actions/getUsers";
import ChatList from "../components/ChatList/layout";
import Sidebar from "../components/Sidebar/layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = await getChats();
  const users = await getUsers();

  return (
    //@ts-expect-error
    <Sidebar>
      <div className="h-full">
        <ChatList initialChats={chats} users={users} />
        {children}
      </div>
    </Sidebar>
  );
}
