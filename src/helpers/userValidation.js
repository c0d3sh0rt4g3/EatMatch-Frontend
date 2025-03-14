const validateName = (name) => {
    return !(!name || name.trim().length < 3)
}
const validateMail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email)
}

const validatePassword = (password) => {
      return !(!password || password.length < 8);
}

const validateRepeatPassword = (password, repeatPassword) => {
    return (repeatPassword !== password)
}