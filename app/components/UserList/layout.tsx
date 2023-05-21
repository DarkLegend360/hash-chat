"use client";

import UserItem from "../UserItem/layout";
import { UserList } from "./types";

const UserList: React.FC<UserList> = (props) => {
  const { users } = props;

  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0">
      <div className="px-5">
        <div className="flex-col">
          <div className="text-2xl font-bold text-neutral-800 py-4s">
            People
          </div>
        </div>
        {users.map((user) => (
          <UserItem key={user.email} user={user} />
        ))}
      </div>
    </aside>
  );
};

export default UserList;
