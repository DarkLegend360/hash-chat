import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "../Modal/layout";
import TextInput from "../TextInput/layout";
import { SettingsProps } from "./types";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import defaultImage from "../../images/userIcon.png";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button/layout";

const Settings: React.FC<SettingsProps> = (props) => {
  const { currentUser, isOpen, onClose } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser.name,
      image: currentUser.image,
    },
  });
  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/settings", data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("System Error: Try again!"));
  };
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="border-b border-gray-900/10  pb-8">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information.
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <TextInput
                id="name"
                label="Name"
                errors={errors}
                register={register}
              />
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <Image
                    alt="image"
                    width="48"
                    height="48"
                    className="rounded-full"
                    src={image || currentUser?.image || defaultImage}
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="p9yrv0zn"
                  >
                    <Button disabled={isLoading} secondary type="button">
                      Upload
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 sm:mt-2 sm:flex sm:flex-row-reverse gap-2  ">
            <button
              disabled={isLoading}
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Save
            </button>
            <button
              disabled={isLoading}
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default Settings;
