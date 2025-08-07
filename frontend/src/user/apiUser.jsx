import { API } from '../core/api';
import axios from "axios";

export const login = async (email,password) => {
    try{
        const response = await axios.post(`${API}/login`,{
            email: email,
            password: password
        });
        return response;
    }catch(err){
        return err;
    }
}

export const signup = async (name,email,password) => {
    try{
        const response = await axios.post(`${API}/signup`,{
            name: name,
            email: email,
            hashedPassword: password
        })
        return response;
    }
    catch(err){
        console.log(err)
    }
}

/*export const forgot = async (email) => {
    try{
        const response = await axios.post(`${API}/forgot`, { email });
        return response.data;
    }    
    catch(err){
        // console.log(err.response.data);
        if(err.response.data.error)
            return err.response
        return err.response;
    }
}*/

export const forgot = async (email) => {
  try {
    const response = await axios.post(`${API}/forgot`, { email });
    return response.data; // expected { message, otp }
  } catch (err) {
    return {
      error: err.response?.data?.error || "Something went wrong",
      status: err.response?.status || 500
    };
  }
};

export const resetPassword = async (email, newPassword) => {
    try{
        const response = await axios.post(`${API}/resetPassword`,{ email, newPassword })
        return response.data;
    }catch(err){
        return err.response;
    }
}

export const logout = async () => {
    try{
        const response = await axios.get(`${API}/logout`)
        localStorage.removeItem('token');
        window.location.href = '/'
        return response
    }catch(err){
        console.log(err);
    }
}

export const setProfile = async (formData) => {
    try{
        const response = await axios.post(`${API}/profile`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        return response;
    }catch(err){
        return `Error generated : ${err.response}`;

    }
}

export const getProfile = async (email) => {
    try{
        const response = await axios.get(`${API}/getProfile`,{
            params : {
                email : email
            }
        });
        return response;
    }catch(err){
        return err.response;
    }
}

export const searchUsers = async (username) => {
    try{
        const response = await axios.get(`${API}/searchUsers`, {
            params : {
                username : username
            }
        });
        return response;
    }catch(err){
        return err.response;
    }
}

export const setNames = async (name, username) => {
    try{
        const response = axios.put(`${API}/setNames`, {
            _id : JSON.parse(localStorage.getItem('token')).user._id,
            name : name,
            username : username
        })
        return response;
    }catch(err){
        return err.response;
    }
}

export const fetchMessages = async (chatId, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API}/messages/${chatId}`, {
      params: { page, limit }
    });
    return response.data;  // expected { messages, hasMore }
  } catch (err) {
    return {
      error: err.response?.data?.error || "Failed to fetch messages",
      status: err.response?.status || 500
    };
  }
};

export const sendMessage = async (senderId, receiverId, text) => {
  try {    
    const response = await axios.post(`${API}/messages`, {
      senderId,
      receiverId,
      text
    });
    return response.data; // expected { message }
  } catch (err) {
    return {
      error: err.response?.data?.error || "Failed to send message",
      status: err.response?.status || 500
    };
  }
};

export const getFriends = async (userId) => {
    try {
        const res = await axios.get(`${API}/friends`, {
            params: { userId }
        });
        return res;
    } catch (err) {
        console.log("Failed to load friends:", err);
    }
};

export const getChat = async (userId, friendId) => {
  try {
    const response = await axios.get(`${API}/chat/${userId}/${friendId}`);
    return response.data;
  } catch (err) {
    return {
      error: err.response?.data?.error || "Failed to fetch chat",
      status: err.response?.status || 500
    };
  }
};