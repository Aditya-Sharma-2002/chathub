import { API } from '../api';
// import '../api';
import axios from "axios";

export const login = async (email,password) => {
    try{
        const response = await axios.post(`${API}/login`,{
            email: email,
            password: password
        });
        console.log(response);
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

// export const isAuthenticated = () => {
//     if(typeof window == 'undefined')
//         return false;
//     if(localStorage.getItem('token'))
//         return JSON.parse(localStorage.getItem('token'));
//     else
//         return false;
// }