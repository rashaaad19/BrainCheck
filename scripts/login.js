import { auth, signInWithEmailAndPassword } from "../firebase.js";

const form = document.getElementById('loginForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const userEmail = data.get('email');
    const userPassword = data.get('password');
    try {
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword)
        const user = userCredential.user;
        location.replace('/pages/home.html')
    }
    catch (e) {
        const errorCode = error.code;
        const errorMessage = error.message;
    }
})