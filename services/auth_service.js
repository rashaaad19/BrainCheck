import { auth, createUserWithEmailAndPassword,updateProfile, provider, signInWithPopup, getDoc, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "../firebase.js";

//Signup with email and password funciton
export const userSignup = async (email, password, userName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Signed up 
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: userName
        })
        console.log(`${user.email} signed up`);
        return user;
    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
}


//Login with email and password function
export const userLogin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        return user;
    }
    catch (error) {
        throw error;
    }

}

//Continue with google function
export const createWithGoogle = async () => {
    try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        return user;


    }
    catch (e) {
        console.log(e)
    }
}


//watch for auth changes, and returns a promise that resolve to the user id
export const getCurrentUserId = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Stop listening after the first response
            if (user) {
                resolve(user.uid);
            } else {
                reject("No user signed in");
            }
        });
    });
};


//Logout the user
export const logout = async () => {
    try {
        await signOut(auth)
    }
    catch (e) {
        throw new Error(e);
    }
}