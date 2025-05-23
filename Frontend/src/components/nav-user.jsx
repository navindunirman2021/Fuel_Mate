"use client"

import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"
import PropTypes from 'prop-types';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export function NavUser({
  user,
  role,
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    queryClient.removeQueries(["user"]);
    localStorage.removeItem("token");
    navigate("/admin-login");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-slate-800 data-[state=open]:bg-slate-800 data-[state=open]:text-teal-400 py-2"
            >
              <Avatar className="h-10 w-10 rounded-full border-2 border-teal-400">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-slate-700 text-teal-400 rounded-full text-lg">{user.name.charAt(0) + user.name.charAt(1)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold text-white text-base">{user.name}</span>
                <span className="truncate text-sm text-gray-300">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto h-5 w-5 text-teal-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-lg bg-slate-900 text-white border-slate-700"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-3 text-left">
                <Avatar className="h-12 w-12 rounded-full border-2 border-teal-400">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-slate-700 text-teal-400 rounded-full text-lg">{user.name.charAt(0) + user.name.charAt(1)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-white text-lg">{user.name}</span>
                  <span className="truncate text-sm text-gray-300">{user.email}</span>
                  <span className="truncate text-sm text-teal-400 font-medium">{role == "SUPER_ADMIN" ? "Super Admin" : "Station Manager"}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem 
              onClick={() => { logout() }}
              className="text-base py-3 focus:bg-slate-800 hover:bg-slate-800 focus:text-teal-400 hover:text-teal-400"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

NavUser.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired
  }).isRequired,
  role: PropTypes.string.isRequired
};
