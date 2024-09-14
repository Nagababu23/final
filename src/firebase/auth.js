import { GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const doSignInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
};

export const doSignOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
};

export const doSendEmailVerification = async () => {
    try {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser, {
                url: `${window.location.origin}/home`,
            });
        } else {
            throw new Error("No user is currently signed in.");
        }
    } catch (error) {
        console.error("Error sending email verification:", error);
        throw error;
    }
};
