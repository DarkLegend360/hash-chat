"use client";
import { useRouter } from "next/navigation";
import { UserItem } from "./types";
import { useCallback, useState } from "react";
import axios from "axios";
import Avatar from "../Avatar/layout";

const UserItem: React.FC<UserItem> = (props) => {
  const { user } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);
    axios
      .post("/api/chats", { userId: user.id })
      .then((res) => router.push(`/chats/${res.data.id}`))
      .finally(() => setIsLoading(false));
  }, [router, user.id]);

  return (
    <div
      className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
      onClick={handleClick}
    >
      <Avatar user={user} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
