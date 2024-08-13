import { createContext, ReactNode, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserData,
  login as loginUser,
  logout as logoutUser,
} from '../services/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  userData: UserData | null;
  fetchData: () => void;
}

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => {},
  logout: () => {},
  userData: null,
  fetchData: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
  // const [userData, setUserData] = useState<UserData | null>(null);
  const userDataString = localStorage.getItem('userData');
  const userData : UserData | null = userDataString ? JSON.parse(userDataString) : null;

  const fetchData = useCallback(async () => {
    if (isLoggedIn) {
      if (localStorage.getItem('authorization')) {
        const userData = await getUserData();
        console.log("userdata: ", userData)
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [fetchData, isLoggedIn]);

  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
    logoutUser();
    localStorage.removeItem('userData');
    localStorage.removeItem('authorization');
    localStorage.removeItem('x-refresh-token');
  }, [navigate]);

  const login = async (username: string, password: string) => {
    try {
      const response = await loginUser(username, password);
      if (response.status === 200) {
        const userData = await getUserData();
        console.log("userdata: ", userData)
        localStorage.setItem('userData', JSON.stringify(userData));
        navigate('/home');
        localStorage.setItem("isLoggedIn", "true");
      }
    } catch (error) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      console.error('Error during login:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, userData, fetchData }}
    >
      {children}
    </AuthContext.Provider>
  );
};