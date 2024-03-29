// eslint-disable-next-line
export const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s-@#$!%^&*+=_/`?{}|'"]+(\.[^<>()\[\]\\.,;:\s-@_!#$%^&*()=+/`?{}|'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
export const REGEX_NO_SPACES = /^\S*$/
export const REGEX_NO_LEADING_TRAILING_DOUBLE_SPACES = /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/
export const REGEX_LETTERS_ONLY_NO_LEADING_TRAILING_DOUBLE_SPACES = /^([a-zA-Z]+\s)*[a-zA-Z]+$/
export const REGEX_FULLNAME = /^([a-zA-Z]+\s)*[a-zA-Z]+$/
export const REGEX_FILENAME = /^[\w,\s-'’!()+.]+\.[A-Za-z]{3,4}$/
