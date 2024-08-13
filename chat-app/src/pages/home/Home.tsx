// chat-app\src\pages\home\Home.tsx
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useEffect } from 'react';

export default function Home() {
  const { logout, userData } = useContext(AuthContext);
  console.log("userData: ", userData)

  useEffect(() => {
    if (!userData) {
      logout();
    }
  }, [userData, logout])

  const handleLogout = () => {
    logout();
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Home
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Welcome {userData?.first_name} {userData?.last_name} to the chat app
        </Typography>
        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
}

