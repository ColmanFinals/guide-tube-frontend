import {ReactElement} from "react";
import {GoogleOAuthProvider} from '@react-oauth/google'
import {UserProvider} from '../context/user-context'

const ContextProvider = ({children}: { children: ReactElement }) => {


    return (
        <GoogleOAuthProvider clientId="996842994144-lqu1gcagi4joo1l4m3lffdituof7sver.apps.googleusercontent.com">
            <UserProvider>
                {children}
            </UserProvider>
        </GoogleOAuthProvider>
    );
};
export default ContextProvider;