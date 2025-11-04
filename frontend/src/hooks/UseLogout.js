import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import { useToast } from "@chakra-ui/react"

const UseLogout = () => {
 const [loading, setloading] = useState(false);
 const {Authuser, setAuthuser, signOutFirebase} = useAuthContext();
 const toast = useToast();
 
 const logout = async() => {
    setloading(true);
    try {
        // Check if it's a Firebase user
        if (Authuser?.isFirebaseUser) {
            // Use Firebase logout
            await signOutFirebase();
            toast({
                title: "Logged out successfully",
                description: "You have been signed out",
                status: "success",
                duration: 2000,
            });
        } else {
            // Use traditional backend logout for non-Firebase users
            const res = await fetch('http://localhost:5000/api/auth/logout', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            localStorage.removeItem('AuthUser');
            setAuthuser(null);
            toast({
                title: "Logged out successfully",
                description: "You have been signed out",
                status: "success",
                duration: 2000,
            });
        }
    } catch (error) {
        toast({
            title: "ERROR OCCURRED IN LOGOUT",
            description: error.message,
            status: "error",
            duration: 2000,
        });
    } finally {
        setloading(false);
    }
 }
 return {loading, logout}
}

export default UseLogout
