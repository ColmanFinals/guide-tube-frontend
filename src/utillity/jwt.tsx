import {jwtDecode} from 'jwt-decode'

interface DecodedToken {
    _id: string;
}

export const extractUserIdFromToken = (token: string): string | null => {
    try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log(decoded);

        return decoded._id;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
};
