"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { urls } from "@/utils/env";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const UserCard = () => {
  const router = useRouter();

  const handleLogOut = async () => {
    localStorage.setItem("access_token", "");

    const response = await fetch(urls.LOGOUT, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) return;

    router.replace("/");
  };

  return (
    <div className="flex bg-card p-4 w-full mt-auto gap-4 items-center">
      <div>
        <Avatar>
          <AvatarFallback className="bg-primary text-card">AS</AvatarFallback>
        </Avatar>
      </div>

      <div className="">
        <div className="text-sm font-medium">Ava Researcher</div>
        <div className="text-xs text-secondary">Workspace owner</div>
      </div>

      <Button className="ml-auto cursor-pointer" onClick={handleLogOut}>
        <LogOut />
      </Button>
    </div>
  );
};

export default UserCard;
