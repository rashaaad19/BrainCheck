import { auth, signInWithEmailAndPassword } from "../firebase.js";
import { checkUserDoc, createWithGoogle } from "../services/firebase_service.js";

const form = document.getElementById('loginForm');
const googleButton = document.getElementById('googleAuth');

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


googleButton.addEventListener('click', async () => {
    try {
        const userCredential = await createWithGoogle();
        const existingStatus = await checkUserDoc(userCredential);
        if (existingStatus === false) {
            const userDoc = await createUser(userCredential);
            console.log('Doc Saved!', userDoc)
            location.replace('/pages/home.html')

        }
        if (existingStatus === true) {
            console.log('User Already exists, no need for new docs')
            location.replace('/pages/home.html')
        }

    }
    catch (e) {
        console.log(e)
    }

})
