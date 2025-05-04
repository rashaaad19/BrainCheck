import { auth, createUserWithEmailAndPassword, db, collection, doc, setDoc, updateProfile, provider, signInWithPopup, getDoc } from "../firebase.js";
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
        throw error; // Re-throw the error if you want calling code to handle it
    }
}


export const createUser = async (userData) => {
    console.log(userData)
    try {
        const docRef = doc(db, "users", userData.uid);
        const data = await setDoc(docRef, {
            email: userData.email,
            displayName: userData.displayName
        });
        return data;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const checkUserDoc = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    const docExist = userDoc.exists();
    return docExist

}
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