import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../slices/hooks';
import { setRoom } from '../../slices/chatroom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import { fetchUsers } from '../../slices/users';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../slices/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

function ChatRoomCard({ chatroom }: { chatroom: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const thunkDispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const usersPerRoom = useAppSelector(state => state.users);
  let numOfUsers = 0;
  usersPerRoom.forEach(data => {
    if(data.chatroom === chatroom) {
      numOfUsers = data.users.length;
    }
  });

  const handleClick = () => {
    if(chatroom) {
      dispatch(setRoom(chatroom));
      navigate('/room/join/' + chatroom);  
    }
  }

  useEffect(() => {
    thunkDispatch(fetchUsers());
  }, [dispatch]);

  return (
    <Card variant="elevation" elevation={0} sx={{ backgroundColor: "#F4FAFB" }}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography gutterBottom variant="body1" component="div">
            {chatroom}
          </Typography>
        </CardContent>
        <CardContent sx={{ display: "flex", justifyContent: "end" }}>
          <Typography gutterBottom variant="body2" component="div">
            {numOfUsers + (numOfUsers >= 2 ? " people are" : " person is") + " here."}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default ChatRoomCard;
