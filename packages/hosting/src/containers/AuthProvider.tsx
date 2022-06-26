import React, { createContext, useContext } from "react";
import { getAuth, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const AuthenticationContext = createContext<User | null>(null);

type AuthProviderProps = { children: React.ReactNode | React.ReactNode[] };

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, isLoading, didError] = useAuthState(getAuth());

  return (
    <AuthenticationContext.Provider value={user ?? null}>
      {didError ? "Error" : isLoading ? "Loading" : children}
    </AuthenticationContext.Provider>
  );
};

export function useFirebaseAuthUser() {
  return useContext(AuthenticationContext);
}

export default AuthProvider;
