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

export function passwordValidator(password, formErrors, setFormErrors) {
    const error = { ...formErrors };

    if (!password) {
        error.password = "Password is required";
    } else if (password.length < 8) {
        error.password = "Minimum 8 characters";
    } else if (!/[A-Z]/.test(password)) {
        error.password = "At least one uppercase character required";
    } else if (!/[a-z]/.test(password)) {
        error.password = "At least one lowercase character required";
    } else if (!/\d/.test(password)) {
        error.password = "At least one digit required";
    } else {
        delete error.password;
    }

    setFormErrors(error);
}

export function validateAllFields({ name, email, password, repassword }) {
    const errors = {};

    if (!name) {
        errors.name = "Name is required";
    } else if (!/^[A-Za-z\s]{2,}$/.test(name)) {
        errors.name = "Only letters and spaces allowed, min 2 characters";
    }

    if (!email.trim()) {
        errors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        errors.email = "Email is not valid";
    }

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 8) {
        errors.password = "Minimum length should be 8";
    } else if (!/[A-Z]/.test(password)) {
        errors.password = "At least one uppercase character required";
    } else if (!/[a-z]/.test(password)) {
        errors.password = "At least one lowercase character required";
    } else if (!/\d/.test(password)) {
        errors.password = "At least one digit required";
    }

    if (!repassword || repassword !== password) {
        errors.repassword = "Passwords do not match";
    }

    return errors;
}
