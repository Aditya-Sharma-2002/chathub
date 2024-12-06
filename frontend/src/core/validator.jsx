export function nameValidator(name, formErrors, setFormErrors) {
    const error = { ...formErrors };

    const nameRegex = /^[A-Za-z\s]{2,}$/;

    if (!name) {
        error.name = "Name is required";
    } else if (!nameRegex.test(name)) {
        error.name = "Only letters and spaces are allowed, minimum length 2";
    } else {
        delete error.name;
    }

    setFormErrors(error);
}

export function emailValidator(email, formErrors, setFormErrors) {
    const error = { ...formErrors };
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email.trim()) {
        error.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
        error.email = "Email is not valid";
    } else {
        delete error.email;
    }

    setFormErrors(error);
}

export function passwordValidator(password, formErrors, setFormErrors){
    const error = {...formErrors};
    if(!password)
        error.password = "Password is required"
    else if(password.length < 8)
        error.password = "Minimum length should be 8"
    else if(!/[A-Z]/.test(password))
        error.password = "Atleast one Upper case character should be there"
    else if(!/[a-z]/.test(password))
        error.password = "Atleast one Lower case character should be there"
    else if(!/\d/.test(password))
        error.password = "Atleast one digit should be there"
    // else if(!/[@$!%*#?&]/.test(password))
    //     error.password = "Atleast one special character should be there"
    else
        delete error.password;
    setFormErrors(error);
}