import { auth, createUserWithEmailAndPassword, db, collection, doc, setDoc, updateProfile, provider,signInWithPopup } from "../firebase.js";
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
    try {
        const docRef = doc(db, "users", userData.uid);
        await setDoc(docRef, {
            email: userData.email,
            displayName:userData.displayName
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const createWithGoogle=async ()=>{
try{
    const userCredential =await signInWithPopup(auth, provider);
    console.log(userCredential);
}
catch(e){
    console.log(e)
}
}