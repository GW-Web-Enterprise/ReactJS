import { REGEX_EMAIL, REGEX_FULLNAME, REGEX_NO_SPACES } from "@app/constants/regexes";
import { RegisterOptions } from "react-hook-form";

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
