export function nameValidator(name,formErrors, setFormErrors){
    const error = {...formErrors}
    if(!"/^[A-Za-z]+$/".test(name))
        error.name = "Only letters are allowed"
    else if(!"/^[A-Za-z]{2,}$/".test(name))
        error.name = "Minimum length should be 2"
    else if(!"/^[A-Za-z\s]+$/".test(name))
        error.name = "No special character allowed"
    else
        delete error.name
    setFormErrors(error);
}

export function emailValidator(email, formErrors, setFormErrors){
    const error = {...formErrors};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!email)
        error.email = "Email is required"
    else if(!emailRegex.test(email))
        error.email = "Email not valid"
    else
        delete error.email
    setFormErrors(error);
}

export function passwordValidator(password, formErrors, setFormErrors){
    const error = {...formErrors};
    if(!password)
        error.password = "Password is required"
    else if(!/^.{8,}$/.test(password))
        error.password = "Minimum length should be 8"
    else if(!/[A-Z]/.test(password))
        error.password = "Atleast one Upper case character should be there"
    else if(!/[a-z]/.test(password))
        error.password = "Atleast one Lower case character should be there"
    else if(!/\d/.test(password))
        error.password = "Atleast one digit should be there"
    else if(!/[@$!%*#?&]/.test(password))
        error.password = "Atleast one special character should be there"
    else
        delete error.password;
    setFormErrors(error);
}