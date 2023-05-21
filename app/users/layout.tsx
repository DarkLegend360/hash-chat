import getUsers from "../actions/getUsers";
import Sidebar from "../components/Sidebar/layout";
import UserList from "../components/UserList/layout";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const users = await getUsers();
  return (
    //@ts-expect-error
    <Sidebar>
      <div className="h-full">
        <UserList users={users} />
        {children}
      </div>
    </Sidebar>
  );
};
export default Layout;
