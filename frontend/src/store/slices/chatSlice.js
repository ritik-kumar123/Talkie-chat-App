import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const getUsers = createAsyncThunk("chat/getUsers",async(_,thunkAPI)=>
{
    try {
         const res = await axiosInstance.get("/message/users");
         return res.data.users;
    } catch (error)
     {
       toast.error(error?.response?.data?.message)
       return thunkAPI.rejectWithValue(error.response?.data?.message);
     }
})
 
const chatSlice = createSlice({
    name:"chat",
    initialState:{
        messages:[],
        users:[],
        selectedUser:null, 
        isUserLoading:false,
        isMessagesLoading:false,  
    },
    reducers:{
        setSelectedUser:(state,action)=>{
           state.selectedUser=action.payload;
        },
        pushNewMessage:(state,action)=>
            {
                state.messages.push[action.payload]
            }
        },
         extraReducers:(builder)=>
            {
                builder
                .addCase(getUsers.pending,(state)=>
                {
                    state.isUserLoading=true;
                })
                .addCase(getUsers.fulfilled,(state,action)=>
                {
                    state.users=action.payload
                    state.isUserLoading=false;
                })
                .addCase(getUsers.rejected,(state)=>
                {
                    state.isUserLoading = false;
                })
            }
});

export const {setSelectedUser,pushNewMessage} = chatSlice.actions;

export default chatSlice.reducer