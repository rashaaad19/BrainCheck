import { auth, createUserWithEmailAndPassword } from "../firebase.js";

export const userSignup = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(`${user} signed up`)
            // ...
        })

}