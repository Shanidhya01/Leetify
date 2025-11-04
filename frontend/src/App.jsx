import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import { useAuthContext } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import UserStat from "./pages/UserStat";
import { Spinner, Flex } from "@chakra-ui/react";

function App() {
  const { Authuser, loading } = useAuthContext();

  // Show loading spinner while Firebase is checking auth state
  if (loading) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={Authuser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={Authuser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={Authuser ? <Navigate to="/" /> : <Signup />}
        />
        {/*       <Route path="/" element={<Home/>}/> */}
        <Route path="/user-stat" element={<UserStat />} />
      </Routes>
    </div>
  );
}

export default App;