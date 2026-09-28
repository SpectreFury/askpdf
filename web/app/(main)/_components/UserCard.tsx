'use client';

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { urls } from "@/utils/env";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchUser } from "../_api/home";

const UserCard = () => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const user = data?.data;
  const name = user ? `${user.first_name} ${user.last_name}`.trim() : "";
  const initials = user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
    : "";

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
    <div className="mt-auto flex w-full shrink-0 items-center gap-4 rounded-md bg-card p-4">
      <div>
        <Avatar>
          <AvatarFallback className="bg-primary text-card">{initials}</AvatarFallback>
        </Avatar>
      </div>

      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{name}</div>
        <div className="truncate text-xs text-secondary">{user?.email}</div>
      </div>

      <Button
        className="ml-auto cursor-pointer"
        onClick={handleLogOut}
        aria-label="Log out"
      >
        <LogOut />
      </Button>
    </div>
  );
};

export default UserCard;
