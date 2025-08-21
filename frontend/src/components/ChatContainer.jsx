import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../store/slices/chatSlice";
import { getSocket } from "../lib/socket";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
const ChatContainer = () =>
{
  const {messages,isMessagesLoading,selectedUser} = useSelector(state=>state.chat)
  const {authUser} = useSelector(state=>state.auth)
  const dispatch = useDispatch()
  const messageEndRef =useRef(null);
  useEffect(()=>
  {
    dispatch(getMessages(selectedUser?._id))
  },[selectedUser?._id])

  useEffect(()=>
  {
    if(messageEndRef.current && messages)
    {
      messageEndRef.current.scrollIntoView({behaviour:"smooth"})
    }
  },[messages]);

  function formatMessageTime(date)
  {
    return new Date(date).toLocaleTimeString("en-us",{
      hour:"2-digit",
      minute:"2-digit",
      hour12:false
    })
  }


  useEffect(()=>
  {
    if(!selectedUser?._id) return;
    dispatch(getMessages(selectedUser?._id));
    const socket = getSocket();
    if(!socket)return;
  },[selectedUser?._id])

  if(isMessagesLoading)
  {
    return(
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader/>
        <MessageSkeleton/>
        <MessageInput/>
      </div>
    )
  }
  

  return <>
   <div className="flex-1 flex flex-col overflow-hidden bg-white">
    <ChatHeader/>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-6 ">
      {
        messages.length>0 && messages.map((message,index)=>{
          const isSender=message.senderId === authUser?._id;
          return(
            <div key={index} className={`flex items-end ${isSender?"justify-end":"justify-start"}`}
                 ref={index=== messages.length-1? messageEndRef:null}>

                  {/* AVATAR  */}
                  <div className={`w-10 h-10 rounded-full border shrink-0 
                    ${isSender?"order-2 ml-3":"order-1 mr-3"}`}>
                      <img src={isSender? authUser?.avatar?.url || "/profile.png"
                                        : selectedUser?.avatar?.url || "/profile.png"}
                      className="w-full h-full object-cover" alt="avatar" />
                   </div>

                   {/* BUbble */}
                   <div className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-xl text-sm
                    ${isSender?"bg-blue-400/20 text-black order-1":"bg-gray-200 text-black order-2"}`}>
                        {
                          message?.media &&(
                            <>
                            {
                              message.media.includes(".mp4 ")||
                              message.media.includes(".webm")||
                              message.media.includes(".mov")?(
                                <video src={message.media} controls className="w-full rounded-md mb-2"/>
                              ):(
                                <img src={message.media} alt="Attachment" className="w-full rounded-md mb-2" />
                              )
                            }
                            </>
                          )}
                            {message.text && <p>{message.text}</p>}
                            <span className="block text-[10px] mt-1 text-right text-gray-400">
                              {formatMessageTime(message.createdAt)}
                            </span>
                    </div>
            </div>
          )
        })
      }
    </div>
    <MessageInput/>
   </div>
  </>;
};

export default ChatContainer;
