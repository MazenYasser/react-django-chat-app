// chat-app\src\pages\home\Home.tsx
// import Container from '@mui/material/Container';
import { AuthContext } from '../../context/AuthContext';
import { FC, useContext, useEffect } from 'react';
import { useState } from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { JSX } from 'react';
import { sendFriendRequest } from '../../services/interactions';
import { toast } from 'react-toastify';
import { getFriendList, getChatLog } from '../../services/data';

interface User {
  id : number;
  first_name : string;
  last_name : string;
  email : string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#7e57c2',
    },
    secondary: {
      main: '#9575cd',
    },
  },
});

  const Home: FC = () : JSX.Element => {
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
    const [friends, setFriends] = useState<User[]>([]);
    const [newFriend, setNewFriend] = useState<string>('');
    const [chatMessages, setChatMessages] = useState<string[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');
    const [socket, setSocket] = useState<WebSocket>();
    const [friendId, setFriendId] = useState<number>(0);
    
    useEffect(() => {
      const fetchFriends = async () => {
        const friends = await getFriendList();
        setFriends(friends);
      };
      fetchFriends();
    }, [])


    const handleAddFriend = async (to_user: string) => {
      const response = await sendFriendRequest(to_user);
      toast.success(response);
    };

    const sendMessage = () => {
      console.log("newMessage: ", newMessage)
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("sending message: ", JSON.stringify({ "sender": userData?.id, "receiver": friendId, "message": newMessage }))
        socket.send(JSON.stringify({ "sender": userData?.id, "receiver": friendId, "message": newMessage }));
      }
    };

    const handleFriendClick = (friendId: number) => {
      setFriendId(friendId);
    }

    useEffect(() => {
      if (socket) {
        // Close the existing WebSocket connection
        socket.close();
      }
    
      if (friendId && userData?.id) {
        // Generate the room name dynamically
        const roomName = `private_${Math.min(userData.id, friendId)}_${Math.max(userData.id, friendId)}`;
        const token = sessionStorage.getItem('authorization');
        // Create a new WebSocket connection
        const newSocket = new WebSocket(`ws://127.0.0.1:8000/chat/${roomName}/?token=${token}`);
        setSocket(newSocket);
    
        // Handle the connection opening
        newSocket.onopen = async () => {
          console.log('WebSocket connected');
          // To be re-enabled when backend db for message is implemented
          // const chatLog = await getChatLog(friendId);
          // setChatMessages([]);
          // setChatMessages(chatLog);
        };
    
        // Listen for incoming messages
        newSocket.onmessage = (event) => {
          console.log('Message from server:', event.data);
          setChatMessages((prevMessages) => [...prevMessages, event.data]);
        };
    
        // Handle the connection closing
        newSocket.onclose = () => {
          console.log('WebSocket disconnected');
          setChatMessages([]);
        };
      }
    
      // Cleanup the WebSocket when the component unmounts or when the friend changes
      return () => {
        if (socket) {
          socket.close();
        }
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [friendId, userData?.id]); // Depend on friendId and userData.id
  
    return (
      <ThemeProvider theme={theme}>
        <Box display="flex" height="100vh" bgcolor="secondary.light" flexDirection="row">
          {/* Friend List */}
          <Box width="25%" bgcolor="primary.light" p={2}>
            <Typography variant="h6" gutterBottom>Hello, {userData?.first_name} {userData?.last_name}</Typography>
            <Typography variant="h6" color="primary.contrastText" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Friends</span>
                <IconButton color="primary" onClick={() => setOpenDialog(true)}>
                  <AddIcon />
                </IconButton>
            </Typography>
            
            <List>
              {friends.map((friend, index) => (
                <ListItem button key={index} onClick={() => handleFriendClick(friend.id)}>
                  <ListItemText primary={friend.first_name + ' ' + friend.last_name} />
                </ListItem>
              ))}
            </List>
            
          </Box>
  
          {/* Chat Box */}
          <Box flexGrow={1} p={2} display="flex" flexDirection="column">
            <Typography variant="h6" gutterBottom>Chat</Typography>
            <Box flexGrow={1} bgcolor="white" p={2} borderRadius={2} overflow="auto">
              {chatMessages.map((message, index) => (
                <Typography key={index} gutterBottom>{message}</Typography>
              ))}
            </Box>
            <Box display="flex" mt={2}>
              <TextField fullWidth variant="outlined" label="Type a message" onChange={(e) => setNewMessage(e.target.value)} />
              <IconButton color="primary" onClick={sendMessage}>
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
  
        {/* Add Friend Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add New Friend</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Friend's Name"
              type="text"
              fullWidth
              value={newFriend}
              onChange={(e) => setNewFriend(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleAddFriend(newFriend)} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    );
  };

export default Home;

