import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const rooms: Record<string, string[]> = {};

type IRoomParams = {
  roomId: string;
  peerId: string;
};

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    socket.emit("room-created", { roomId });
    console.log("user created the room");
  };

  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    if (!rooms[roomId]) rooms[roomId] = [];
    if (rooms[roomId] && rooms[roomId].indexOf(peerId) === -1) {
      console.log("user joined the room", roomId, peerId);
      rooms[roomId].push(peerId);
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", { peerId });
      socket.emit("get-users", { roomId, participants: rooms[roomId] });
    }

    socket.on("disconnect", () => {
      console.log("user left the room", peerId);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ peerId, roomId }: IRoomParams) => {
    console.log("#########  BEFORE  #########", { rooms });
    rooms[roomId] =
      rooms[roomId] && rooms[roomId].filter((id) => id !== peerId);
    console.log("#########  BEFORE  #########", { rooms });
    socket.to(roomId).emit("user-disconnected", peerId);
  };
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};
