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
            hashed_password: password
        })
        return response;
    }
    catch(err){
        console.log(err)
    }
}

export const forgot = async (email) => {
    try{
        const response = await axios.get(`${API}/forgot`, {
            email: email
        })
        return response;
    }    
    catch(err){
        console.log(err)
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
              'Content-Type': 'multipart/form-data', // Ensure proper content type for file upload
            },
          });
        return response;
    }catch(err){
        return err.response;
        // console.log(err);
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