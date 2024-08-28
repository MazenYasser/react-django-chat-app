// chat-app\src\pages\home\Home.tsx
// import Container from '@mui/material/Container';
import { AuthContext } from '../../context/AuthContext';
import { FC, useContext, useEffect } from 'react';
import { useState } from 'react';
import { Box, List, ListItemButton, ListItemText, ListItem, IconButton, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { PeopleAlt, PersonAddAlt1, Done, Clear } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { JSX } from 'react';
import { sendFriendRequest, markMessagesAsRead } from '../../services/interactions';
import { toast } from 'react-toastify';
import { getFriendList, getChatLog, getUnreadMessages, getPendingFriendRequests } from '../../services/data';
import { updateFriendRequestStatus } from '../../services/interactions';


interface User {
  id : number;
  first_name : string;
  last_name : string;
  email : string;
}

interface Message {
  sender : number;
  sender_name : string;
  receiver : number;
  content : string;
  timestamp : string;
  is_read : boolean;
}

interface PendingFriendRequest {
  id : number;
  from_user: string;
  to_user: number;
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
    const [pendingFriendRequests, setPendingFriendRequests] = useState<PendingFriendRequest[]>([]);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [openAddFriendModal, setOpenAddFriendModal] = useState<boolean>(false);
    const [openFriendRequestsModal, setOpenFriendRequestsModal] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');
    const [socket, setSocket] = useState<WebSocket>();
    const [friendId, setFriendId] = useState<number>(0);
    const [unreadFriendsIds, setUnreadFriendsIds] = useState<number[]>([]);
    const [unreadChat, setUnreadChat] = useState<boolean>(true);



    const fetchFriends = async () => {
      const friends = await getFriendList();
      setFriends(friends);
    };

    const fetchPendingFriendRequests = async () => {
      const friendRequests = await getPendingFriendRequests();
      setPendingFriendRequests(friendRequests);
    };

    useEffect(() => {
      fetchFriends();
      fetchPendingFriendRequests();
    }, [])


    const convertDateFormat = (date: string) => {
      return new Date(date).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).replace(/ GMT.+/, '')
    }

    const handleAddFriend = async (to_user: string) => {
      const response = await sendFriendRequest(to_user);
      toast.success(response);
    };

    const handleUpdateFriendRequestStatus = async(friendRequestId: number, status: "ACCEPTED" | "REJECTED") => {
      const response = await updateFriendRequestStatus(friendRequestId, status);
      toast.success(response);
      fetchFriends();
      fetchPendingFriendRequests();
    }

    const sendMessage = () => {
      console.log("newMessage: ", newMessage)
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("sending message: ", JSON.stringify({ "sender": userData?.id, "receiver": friendId, "message": newMessage }))
        socket.send(JSON.stringify({ "sender": userData?.id, "receiver": friendId, "message": newMessage }));
      }
    };

    const handleFriendClick = (friendId: number) => {
      setFriendId(friendId);
      setUnreadChat(false);
  };
  

    useEffect(() => {
        const token = sessionStorage.getItem('authorization');
        const onlineStatusSocket = new WebSocket(`ws://127.0.0.1:8000/status/?token=${token}`);
    
        // Handle the connection opening
        onlineStatusSocket.onopen = async () => {
          console.log('Online status socket: Connected');
          const unreadMessages : Message[] = await getUnreadMessages();
          unreadMessages.forEach(message => {
              setUnreadFriendsIds(prevIds => [...prevIds, message.sender]);
          });
        };
    
        // Listen for incoming messages
        onlineStatusSocket.onmessage = (event) => {
          console.log('Message from online status server:', event.data);
        };
    
        // Handle the connection closing
        onlineStatusSocket.onclose = () => {
          console.log('Online status socket: Disconnected');
        };

    }, []); 
    

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
          const chatLog = await getChatLog(friendId);
          setChatMessages([]);
          setChatMessages(chatLog);
          await markMessagesAsRead(friendId);
        };
    
        // Listen for incoming messages
        newSocket.onmessage = (event) => {
          const messageData = JSON.parse(event.data)
          console.log('Message from server:', messageData);
          setChatMessages((prevMessages) => [...prevMessages, messageData.message]);
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
            <Typography variant="h6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} gutterBottom>Hello, {userData?.first_name} {userData?.last_name}
              <IconButton color="primary" onClick={() => setOpenFriendRequestsModal(true)}>
                <PeopleAlt />
              </IconButton>
            </Typography>
            
            <Typography variant="h6" color="primary.contrastText" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Friends</span>
                <IconButton color="primary" onClick={() => setOpenAddFriendModal(true)}>
                <PersonAddAlt1 />
                </IconButton>
            </Typography>
            
            <List>
              {friends.map((friend, index) => (
                <ListItemButton key={index} onClick={() => handleFriendClick(friend.id)} style={friendId === friend.id ? { backgroundColor: theme.palette.primary.dark } : {}}>
                  <ListItemText primary={`${friend.first_name} ${friend.last_name} ${unreadFriendsIds.includes(friend.id) && unreadChat ? '*' : ''}`} />
                </ListItemButton>
              ))}
            </List>
            
          </Box>
  
          {/* Chat Box */}
          <Box flexGrow={1} p={2} display="flex" flexDirection="column">
            <Typography variant="h6" gutterBottom>Chat</Typography>
            <Box flexGrow={1} bgcolor="white" p={2} borderRadius={2} overflow="auto">
              {chatMessages.map((messageData, index) => (
                <Typography key={index} gutterBottom>
                  {convertDateFormat(messageData.timestamp)} | {messageData.sender_name} :  {messageData.content}
                </Typography>
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
        <Dialog open={openAddFriendModal} onClose={() => setOpenAddFriendModal(false)}>
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
            <Button onClick={() => setOpenAddFriendModal(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleAddFriend(newFriend)} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Friend Requests Dialog */}
        <Dialog open={openFriendRequestsModal} onClose={() => setOpenFriendRequestsModal(false)}>
          <DialogTitle>Pending Friend Requests</DialogTitle>
          <DialogContent>
            <List>
              {pendingFriendRequests.map((friendRequest, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${friendRequest.from_user}`} />
                  <Button onClick={() => handleUpdateFriendRequestStatus(friendRequest.id, "ACCEPTED")} color="primary">
                      <Done />
                  </Button>
                    <Button onClick={() => handleUpdateFriendRequestStatus(friendRequest.id, "REJECTED")} color="primary">
                      <Clear />
                  </Button>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
          <Button onClick={() => setOpenFriendRequestsModal(false)} color="primary">
            Close
          </Button>
          </DialogActions>
        </Dialog>


      </ThemeProvider>
    );
  };

export default Home;

