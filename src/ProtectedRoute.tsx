import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './context/user-context'; 

interface Props{
    children: ReactNode;
}
const ProtectedRoute = ({ children} : Props) => {
  const { user } = useUser(); 
  console.log("protected", user)
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = user && accessToken;

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  } else {
    return children;
  }
};

export default ProtectedRoute