import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./loading";
import Image from "next/image";

export const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) toast.error(errorMessage[0]);
      else toast.error("Failed to post! Please try again later.");
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <div className="h-[56px] w-[56px]">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: {
                width: 56,
                height: 56,
              },
            },
          }}
        />
      </div>
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            mutate({ content: input });
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })}>Post</button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};
