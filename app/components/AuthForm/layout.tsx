"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthVariantEnum } from "./enums";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../TextInput/layout";
import { Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<AuthVariantEnum>(
    AuthVariantEnum.Login
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      console.log("Authenticated");
      router.push("/users");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    setVariant((prevVariant) =>
      prevVariant === AuthVariantEnum.Login
        ? AuthVariantEnum.Register
        : AuthVariantEnum.Login
    );
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant == AuthVariantEnum.Register) {
      axios
        .post("/api/register", data)
        .then(() => signIn("credentials", data))
        .catch(() => toast.error("Something went wrong"))
        .finally(() => setIsLoading(false));
    } else if (variant == AuthVariantEnum.Login) {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid Credentials");
          }
          if (callback?.ok && !callback?.error) {
            toast.success("Logged In");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialLogin = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid Credentials");
        }
        if (callback?.ok && !callback?.error) {
          toast.success("Logged In");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm:max-auto sm:w-full sm:max-w-md">
      <div className="px-4 py-8 shadow sm:rounded-lg bg-white flex flex-col items-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center gap-y-2 w-64">
            {variant === AuthVariantEnum.Register && (
              <TextInput
                id="name"
                label="Name"
                errors={errors}
                register={register}
              />
            )}
            <TextInput
              id="email"
              label="Email"
              errors={errors}
              register={register}
            />
            <TextInput
              id="password"
              label="Password"
              type="password"
              errors={errors}
              register={register}
            />
            <Button
              className="bg-blue-500"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
            >
              {variant === AuthVariantEnum.Login ? "Login" : "Register"}
            </Button>
            <Button
              className="bg-green-500"
              variant="contained"
              onClick={() => socialLogin("google")}
            >
              Google Login
            </Button>
          </div>
        </form>
        {variant === AuthVariantEnum.Login
          ? "Create an account?"
          : "Already a user"}
        <div className="cursor-pointer underline" onClick={toggleVariant}>
          {variant == AuthVariantEnum.Login ? "Click Here" : "Login here"}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
