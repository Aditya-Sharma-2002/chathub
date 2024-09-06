import { API } from '../api';

export const login = (email,password) => {
    return fetch(`${API}/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-type" : 'application/json',
        },
        body: JSON.stringify({email, password})
    })
    .then((response) => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const signup = (name,email,password) => {
    return fetch(`${API}/signup`, {
        method : "POST",
        headers : {
            Accept : 'application/json',
            "Content-type" : "application/json"
        },
        body: JSON.stringify({name, email, password})
    })
    .then(response => {return response.json()})
    .catch(err => console.log(err))
}

export const forgot = () => {
    return fetch(`${API}/forgot`, {
        method : "GET",
        headers : {
            Accept : 'applcation/json',
            "Content-type" : "application/json"
        }
    })
    .then(response => {return response.json()})
    .catch(err => console.log(err))
}