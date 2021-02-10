import { RegisterOptions } from "react-hook-form";

// eslint-disable-next-line
export const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s-@#$!%^&*+=_/`?{}|'"]+(\.[^<>()\[\]\\.,;:\s-@_!#$%^&*()=+/`?{}|'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
export const REGEX_NO_SPACES = /^\S*$/
export const REGEX_NO_LEADING_TRAILING_DOUBLE_SPACES = /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/
export const REGEX_FULLNAME = /^([a-zA-Z]+\s)*[a-zA-Z]+$/

const fullnameErr = 'Your fullname must contain between 4 and 64 characters'
export const FULLNAME_INP_ERR: RegisterOptions = {
    required: fullnameErr,
    minLength: { value: 4, message: fullnameErr },
    maxLength: { value: 64, message: fullnameErr },
    pattern: { value: REGEX_FULLNAME, message: 'Please enter a valid fullname (alphabet characters only, no space at both end, and no consecutive spaces)' }
}

const emailErr = 'Please enter a valid email';
export const EMAIL_INP_ERR: RegisterOptions = {
    required: emailErr,
    minLength: { value: 5, message: emailErr },
    maxLength: { value: 50, message: emailErr },
    pattern: { value: REGEX_EMAIL, message: emailErr }
}

const passwordErr = 'Your password must contain between 4 and 60 characters';
export const PASSWORD_INP_ERR: RegisterOptions = {
    required: passwordErr,
    minLength: { value: 6, message: passwordErr },
    maxLength: { value: 60, message: passwordErr },
    pattern: { value: REGEX_NO_SPACES, message: 'Password should not contain any whitespace' }
}

