"use client";
import { Fragment, useCallback, useMemo, useState } from "react";
import useOtherUser from "../../hooks/useOtherUser";
import { ChatMenuProps } from "./types";
import { format } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose, IoTrash } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";
import Avatar from "../Avatar/layout";
import Modal from "../Modal/layout";
import { useRouter } from "next/navigation";
import useChat from "@/app/hooks/useChat";
import axios from "axios";
import { toast } from "react-hot-toast";
import useActiveList from "@/app/hooks/useActiveList";

const ChatMenu: React.FC<ChatMenuProps> = (props) => {
  const { data, isOpen, onClose } = props;
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { chatId } = useChat();
  const otherUser = useOtherUser(data);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(`/api/chats/${chatId}`)
      .then(() => {
        setConfirmOpen(false);
        onClose();
        router.push("/chats");
        router.refresh();
      })
      .catch(() => toast.error("System Error: Try again!"))
      .finally(() => setIsLoading(false));
  }, [router, chatId, onClose]);

  const joinedDate = useMemo(
    () => format(new Date(otherUser.createdAt), "PP"),
    [otherUser.createdAt]
  );
  const title = useMemo(
    () => data.name || otherUser.name,
    [data.name, otherUser.name]
  );
  const statusText = useMemo(
    () =>
      data.isGroup
        ? `${data.users.length} members`
        : isActive
        ? "Active"
        : "Offline",
    [data.isGroup, data.users.length, isActive]
  );

  const confirmModal = useMemo(() => {
    return (
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="sm:flex sm:items-start">
          <div
            className="
            mx-auto 
            flex 
            h-12 
            w-12 
            flex-shrink-0 
            items-center 
            justify-center 
            rounded-full 
            bg-red-100 
            sm:mx-0 
            sm:h-10 
            sm:w-10
          "
          >
            <FiAlertTriangle
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <div
            className="
            mt-3 
            text-center 
            sm:ml-4 
            sm:mt-0 
            sm:text-left
          "
          >
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              Delete conversation
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this conversation? This action
                cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2  ">
          <button
            disabled={isLoading}
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            disabled={isLoading}
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => setConfirmOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    );
  }, [confirmOpen, isLoading, onDelete]);

  return (
    <>
      {confirmModal}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-start justify-end">
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        onClick={onClose}
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                      >
                        <span className="sr-only">Close panel</span>
                        <IoClose size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <div className="flex flex-col items-center">
                      <div className="mb-2">
                        <Avatar user={otherUser} />
                      </div>
                      <div>{title}</div>
                      <div className="text-sm text-gray-500">{statusText}</div>
                      <div className="flex gap-10 my-8">
                        <div
                          className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75"
                          onClick={() => setConfirmOpen(true)}
                        >
                          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                            <IoTrash size={32} />
                          </div>
                          <div className="text-sm font-light text-neutral-600 ">
                            Delete
                          </div>
                        </div>
                      </div>
                      <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                        <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                          {!data.isGroup && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                Email
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                {otherUser.email}
                              </dd>
                            </div>
                          )}
                          {!data.isGroup && (
                            <>
                              <hr />
                              <div>
                                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                  Joined
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                  <time dateTime={joinedDate}>
                                    {joinedDate}
                                  </time>
                                </dd>
                              </div>
                            </>
                          )}
                        </dl>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ChatMenu;
