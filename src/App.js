import React, { useState, useEffect } from "react";
import SignInSingUp from "./pages/SignInSingUp";
import { ToastContainer } from "react-toastify"
import { AuthContext } from "./utils/contexts"
import { isUserLoggedApi } from "./api/auth"
import Routing from "./routes/Routing";

export default function App() {
  const [user, setUser] = useState(null); // Estado para guardar la información del usuario logueado
  const [loadUser, setLoadUser] = useState(false); // Estado para controlar el loading del usuario logueado
  const [refreshCheckLogin, setRefreshCheckLogin] = useState(false); // Estado para controlar el refresh del usuario logueado

  useEffect(() => {
    setUser(isUserLoggedApi());
    setRefreshCheckLogin(false);
    setLoadUser(true);
  }, [refreshCheckLogin]);

  if (!loadUser) return null; // Si no se ha cargado el usuario, no se muestra nada

  return (
    <AuthContext.Provider value={user}>
      {user ? (
          <Routing setRefreshCheckLogin={setRefreshCheckLogin}/>
        ) : (
          <SignInSingUp setRefreshCheckLogin={setRefreshCheckLogin} />
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </AuthContext.Provider>
  );
}
