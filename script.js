import { userSignup } from "./services/firebase_service.js";

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const userData = new FormData(event.target);
    const userEmail = userData.get("email");
    const userPassword = userData.get("password");
    userSignup(userEmail, userPassword)
});

