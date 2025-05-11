import { checkUserDoc, createUser } from '../services/firestore_service.js';
import { createWithGoogle, userSignup } from './../services/auth_service.js';

const form = document.getElementsByTagName('form')[0];
const email = document.getElementById('email');
const emailHint = document.getElementById('email-hint')
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const googleButton = document.getElementById('googleAuth');

//custom validation to check passwords matching
confirmPassword.addEventListener('input', (event) => {
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity('Enter correct password');
    }
    else {
        confirmPassword.setCustomValidity('');
    }
});

// fix custom validity glitch
email.addEventListener('input', () => {
    email.setCustomValidity('');
    emailHint.textContent = 'Enter valid email address'
})

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const userEmail = data.get("email");
    const userPassword = data.get("password");
    const userName = data.get('name');
    const userRole = data.get('role')

    try {
        const userCredential = await userSignup(userEmail, userPassword, userName);
        const userData = {
            name: userCredential.displayName,
            email: userCredential.email,
            id: userCredential.uid,
            role: userRole,
            exams: []
        }
        console.log(userData)
        localStorage.setItem('userId', userData.id);
        console.log("User signed up:", userCredential);
        const userDoc = await createUser(userData);
        console.log('Doc Saved!', userDoc)
        location.replace('/pages/login.html')
    } catch (e) {
        const errorMessage = e.message;
        const errorCode = e.code
        if (errorCode === 'auth/email-already-in-use') {
            console.log('email already in use error')
            email.setCustomValidity('Email already in use');
            emailHint.textContent = 'This Email is already in use'
        }

    }


});

googleButton.addEventListener('click', async () => {
    try {
        const userCredential = await createWithGoogle();
        const existingStatus = await checkUserDoc(userCredential);

        if (existingStatus === false) {
            //create new user document for first time users
            const userData = {
                name: userCredential.displayName,
                email: userCredential.email,
                id: userCredential.uid,
                role: 'student',
                exams: []
            }
            const userDoc = await createUser(userData);
            console.log('Doc Saved!', userDoc)
            location.replace('/pages/home.html')

        }
        if (existingStatus === true) {
            console.log('User Already exists, no need for new docs')
            location.replace('/pages/home.html')
        }

        localStorage.setItem('userId', userCredential.uid);


    }
    catch (e) {
        const errorMessage = e.message;
        const errorCode = e.code
        console.log(errorMessage)

    }

})

