import { User } from "../models/user.models.js";
import { Message } from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";
import { getReceiverSocketId, io } from "../utils/socket.js";

export const getAllUsers = async (req, res) => {
try {
      const user = req.user;
     const filteredUsers = await User.find({ _id: { $ne: user } }).select("-password");
     return res.status(200).json({users:filteredUsers});
} catch (error) {
    return res.status(400).json({message:`getAllUsers error ${getAllUsers}`})
}
};

export const getMessages = async (req, res) => {
   try {
     const receiverId = req.params.id;
     const myId = req.user._id;
     const receiver = await User.findById(receiverId);
     if (!receiver) {
       return res.status(400).json({
         message: "Receiver Id Invalid",
       });
     }
     const messages = await Message.find({
       $or: [
         { senderId: myId, receiverId: receiverId },
         { senderId: receiverId, receiverId: myId },
       ],
     }).sort({ createdAt: 1 });
     res.status(200).json({
         success: true,
         messages,
       });
   } catch (error) {
     return res.status(500).json({message:`getmessage error ${error}`})
   }
};
export const sendMessage = async (req, res) => {
      try {
        console.log(req.body);
        
          const { text } = req?.body;
          const media = req?.files?.media;
          const { id: receiverId } = req.params;
          const senderId = req.user._id;
          const receiver = await User.findById(receiverId);
          if (!receiver) {
            return res.status(400).json({
              message: "Receiver Id Invalid",
            });
          }
          const sanitizedText = text?.trim() || "";
          if (!sanitizedText && !media) {
            return res.status(400).json({
              success: false,
              message: "Cannot send empty message.",
            });
          }
          let mediaUrl = "";

          if (media) {
           try {
             const uploadResponse = await cloudinary.uploader.upload(media.tempFilePath,
              {
                resource_type: "auto", //auto-detecy image/video
                folder: "CHAT_APP_MEDIA",
                transformation: [
                  { width: 1080, height: 1080, crop: "limit" },
                  { quality: "auto" },
                  { fetch_format: "auto" },
                ],
              }
            );
            mediaUrl = uploadResponse?.secure_url;
           } catch (error){
            return res.status(500).json({message:`Failed to upload media.Please try again later`})
           }
          }
           const newMessage = await Message.create({
            senderId,
            receiverId,
            text:sanitizedText,
            media:mediaUrl
           })
           const receiverSocketId = getReceiverSocketId(receiverId);
           if(receiverSocketId)
           {
            io.to(receiverSocketId).emit("newMessage",newMessage);
           }
           res.status(201).json(newMessage);
      } catch (error){
        return res.status(500).json({message:`sendMessage error ${error}`})
      }
    }
