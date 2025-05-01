import { createUser, userSignup } from "./services/firebase_service.js";

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const userEmail = data.get("email");
    const userPassword = data.get("password");
    try {
        const userCredential = await userSignup(userEmail, userPassword);
        console.log("User signed up:", userCredential);
        createUser(userCredential);
        // You can use userCredential here
    } catch (error) {
        console.error("Signup error:", error);
    }
});

