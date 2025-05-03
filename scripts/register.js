import { checkUserDoc, createUser, createWithGoogle, userSignup } from './../services/firebase_service.js';

const form = document.getElementsByTagName('form')[0];
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const googleButton = document.getElementById('googleAuth');

//custom validation to check passwords matching
confirmPassword.addEventListener('input', (event) => {
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity('invalid');
    }
    else {
        confirmPassword.setCustomValidity('');
    }
});


form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const userEmail = data.get("email");
    const userPassword = data.get("password");
    const userName = data.get('name');
    try {
        const userCredential = await userSignup(userEmail, userPassword, userName);
        console.log("User signed up:", userCredential);
        const userDoc = await createUser(userCredential);
        console.log('Doc Saved!', userDoc)
        location.replace('/pages/login.html')
    } catch (error) {
        console.error("Signup error:", error);
    }

});

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

