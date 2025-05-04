import { auth, createUserWithEmailAndPassword, db, collection, doc, setDoc, updateProfile, provider, signInWithPopup, getDoc, signInWithEmailAndPassword } from "../firebase.js";
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

export const userLogin=async(email, password)=>{
  try{
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      return user;
  }
  catch(error){
    throw error; 
}
  
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