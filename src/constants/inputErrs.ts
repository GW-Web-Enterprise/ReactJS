import {
    REGEX_EMAIL,
    REGEX_FULLNAME,
    REGEX_LETTERS_ONLY_NO_LEADING_TRAILING_DOUBLE_SPACES,
    REGEX_NO_SPACES
} from '@app/constants/regexes';
import { RegisterOptions } from 'react-hook-form';

// 📌 USER
const fullnameErr = 'Your fullname must contain between 4 and 64 characters';
export const FULLNAME_INP_ERR: RegisterOptions = {
    required: fullnameErr,
    minLength: { value: 4, message: fullnameErr },
    maxLength: { value: 64, message: fullnameErr },
    pattern: {
        value: REGEX_FULLNAME,
        message:
            'Please enter a valid fullname (alphabet characters only, no space at both end, and no consecutive spaces)'
    }
};
const emailErr = 'Please enter a valid email';
export const EMAIL_INP_ERR: RegisterOptions = {
    required: emailErr,
    minLength: { value: 5, message: emailErr },
    maxLength: { value: 50, message: emailErr },
    pattern: { value: REGEX_EMAIL, message: emailErr }
};
const passwordErr = 'Your password must contain between 6 and 60 characters';
export const PASSWORD_INP_ERR: RegisterOptions = {
    required: passwordErr,
    minLength: { value: 6, message: passwordErr },
    maxLength: { value: 60, message: passwordErr },
    pattern: { value: REGEX_NO_SPACES, message: 'Password should not contain any whitespace' }
};

// 📌 FACULTY
const facultyNameErr = 'Must contain between 3 and 50 characters';
export const FACULTY_NAME_ERR: RegisterOptions = {
    required: facultyNameErr,
    minLength: { value: 3, message: facultyNameErr },
    maxLength: { value: 50, message: facultyNameErr },
    pattern: {
        value: REGEX_LETTERS_ONLY_NO_LEADING_TRAILING_DOUBLE_SPACES,
        message:
            'Only letters and single spaces are accepted. Remove any leading or traling space you might have entered'
    }
};

// 📌 REPO
export const REPO_NAME_ERR: RegisterOptions = {
    required: `Please enter the repo's name`,
    maxLength: { value: 100, message: `Repo's name is limited to 100 characters` }
};
export const REPO_DESC_ERR: RegisterOptions = {
    maxLength: { value: 100, message: `Description is limited to 100 characters` }
};
