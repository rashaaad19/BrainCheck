import { auth, createUserWithEmailAndPassword, db, collection, doc, setDoc, updateProfile } from "../firebase.js";

export const userSignup = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Signed up 
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: 'John Doe'
        })
        console.log(`${user.email} signed up`);
        return user;
    } catch (error) {
        console.error('Error during signup:', error);
        throw error; // Re-throw the error if you want calling code to handle it
    }
}


export const createUser = async (userData) => {
    try {
        const docRef = doc(db, "users", userData.uid);
        await setDoc(docRef, {
            email: userData.email,
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}