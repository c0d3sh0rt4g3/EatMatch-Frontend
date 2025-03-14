/**
 * Validates a user's name
 * 
 * @param {string} name - The name to validate
 * @returns {boolean} Returns true if the name is valid (exists and has at least 3 characters), false otherwise
 */
const validateName = (name) => {
    return !(!name || name.trim().length < 3)
}

/**
 * Validates an email address using a regular expression pattern
 * 
 * @param {string} email - The email address to validate
 * @returns {boolean} Returns true if the email format is valid, false otherwise
 */
const validateMail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email)
}

/**
 * Validates a password
 * 
 * @param {string} password - The password to validate
 * @returns {boolean} Returns true if the password is valid (exists and has at least 8 characters), false otherwise
 */
const validatePassword = (password) => {
      return !(!password || password.length < 8);
}

/**
 * Checks if repeat password matches the original password
 * 
 * @param {string} password - The original password
 * @param {string} repeatPassword - The repeated password to compare
 * @returns {boolean} Returns true if passwords don't match, false if they match
 */
const validateRepeatPassword = (password, repeatPassword) => {
    return (repeatPassword !== password)
}