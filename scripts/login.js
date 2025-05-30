import { createWithGoogle, userLogin } from "../services/auth_service.js";
import { checkUserDoc, createUser } from "../services/firestore_service.js";

const form = document.getElementById("loginForm");
const passwordInput = document.getElementById('password');
const googleButton = document.getElementById("googleAuth");

// fix custom validity glitch
passwordInput.addEventListener('input', () => {
  passwordInput.setCustomValidity('');
})


form.addEventListener("submit", async (event) => {
  event.preventDefault();
  passwordInput.setCustomValidity('');
  const data = new FormData(event.target);
  const userEmail = data.get("email");
  const userPassword = data.get("password");

  try {
    const userCredentials = await userLogin(userEmail, userPassword);
    console.log(userCredentials);
    console.log(passwordInput.reportValidity());
    passwordInput.setCustomValidity('');
    localStorage.setItem('userId', userCredentials.uid);


    location.replace("/pages/home.html");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode)
    if (errorCode === 'auth/invalid-credential') {
      passwordInput.setCustomValidity('Enter correct credentials');

    }
  }
});

googleButton.addEventListener("click", async () => {
  console.log("clicked");

  try {
    const userCredential = await createWithGoogle();
    const existingStatus = await checkUserDoc(userCredential);
    console.log("created");

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
      console.log("User Already exists, no need for new docs");
      location.replace("/pages/home.html");
    }

    localStorage.setItem('userId', userCredential.uid);

  } catch (e) {
    console.log(e);
  }
});
