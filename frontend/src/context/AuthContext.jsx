import { createContext, useContext, useState, useEffect } from "react";
import { auth, signInWithGoogle, firebaseSignOut } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext=createContext();
export const useAuthContext=()=>{
    return useContext(AuthContext);
}
export const AuthContextProvider=({children})=>{
    const [Authuser,setAuthuser]=useState( JSON.parse(localStorage.getItem("AuthUser"))|| null);
    const [loading, setLoading] = useState(true);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in with Firebase
                const firebaseUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    username: user.displayName || user.email?.split('@')[0],
                    isFirebaseUser: true
                };
                setAuthuser(firebaseUser);
                localStorage.setItem("AuthUser", JSON.stringify(firebaseUser));
            } else if (!Authuser || Authuser.isFirebaseUser) {
                // Only clear if it was a Firebase user or no user
                setAuthuser(null);
                localStorage.removeItem("AuthUser");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Google sign in function
    const signInWithGoogleAuth = async () => {
        try {
            const user = await signInWithGoogle();
            return user;
        } catch (error) {
            console.error("Google sign in error:", error);
            throw error;
        }
    };

    // Firebase sign out function
    const signOutFirebase = async () => {
        try {
            await firebaseSignOut();
            setAuthuser(null);
            localStorage.removeItem("AuthUser");
        } catch (error) {
            console.error("Sign out error:", error);
            throw error;
        }
    };

    return <AuthContext.Provider value={{
        Authuser,
        setAuthuser,
        loading,
        signInWithGoogleAuth,
        signOutFirebase
    }}>
        {children}
        </AuthContext.Provider>
}