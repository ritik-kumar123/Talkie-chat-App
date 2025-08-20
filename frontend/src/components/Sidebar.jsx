import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { getUsers } from "../store/slices/chatSlice";
import { User } from "lucide-react";

const Sidebar = () => {
  const[showOnlineOnly,setShowOnlineOnly]=useState(false);
  const {users,selectedUser,isUserLoading} = useSelector(state=>state.chat)
  const {onlineUsers} = useSelector(state=>state.auth)
  const dispatch = useDispatch()
  useEffect(()=>
  {
   dispatch(getUsers());
  },[dispatch]);
  const filteredUsers = showOnlineOnly?users.filter(user=>onlineUsers.includes(user._id)):users;
  if(isUserLoading) return <SidebarSkeleton/>
  return <>
  <aside className="h-full w-20 lg:w-72 border-r border-gray-200 flex flex-col
  transition-all duration-200 bg-white">
               {/* HEADER */}
               <div className="border-b border-gray-200 w-full p-5">
                  <div className="flex items-center gap-2">
                     <User className="w-6 h-6 text-gray-700"/>
                     <span className="font-medium">Contacts</span>
                  </div>
               </div>
  </aside>
  </>;
};

export default Sidebar;
