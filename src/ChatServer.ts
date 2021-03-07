import socketIo from 'socket.io';
import { Server } from 'http';

interface UsernameMap {
	[sockerId: string]: string | null;
  }
  
enum SocketEvents {
	Registration = 'registration', // name declaration right now
	ApproveName = 'approveName', // setName
	ChatMessage = 'chatMessage', //chat message
	Disconnect = 'disconnect',
	Admin = 'admin',
}

export class ChatServer {
	private usernameMap: UsernameMap = {};
	private socketServer: SocketIO.Server;
  
	constructor(httpServer: Server){
	  this.socketServer = socketIo(httpServer);
	}
  
	init() {
	  this.setupChatServer();
	}
  
	private setUser(socketId: string, name: string | null) {
	  this.usernameMap[socketId] = name;
	}
  
	private deleteUser(socketId: string) {
	  delete this.usernameMap[socketId];
	}
  
	private broadcastUsers() {
	  this.emitBroadcastEvent('users', this.usernameMap);
	}
  
	private emitBroadcastEvent(eventType: string, content: any) {
	  this.socketServer.emit(eventType, content);
	}
  
	private emitSocketEvent(socket: socketIo.Socket, eventType: string, content: any) {
	  socket.emit(eventType, content);
	}
  
	private setupChatServer() {
	  this.socketServer.on('connection', (socket) => {
		this.setUser(socket.id, null);
		this.broadcastUsers();
		this.emitSocketEvent(socket, SocketEvents.Admin, 'Oh, hey there. What\'s your name?');
	
		socket.on(SocketEvents.Registration, (name: string)=> {
  
		  const userNames = Object.values(this.usernameMap);
		  const lowercasedName = name.toLowerCase();
  
		  if(userNames.includes(lowercasedName)) {
			this.emitSocketEvent(socket, SocketEvents.Admin, `You can't be ${name}, the REAL ${name} is already here chatting. Who are you REALLY?`);
			return;
		  }
  
		  this.setUser(socket.id, lowercasedName);
		  this.emitSocketEvent(socket, SocketEvents.ApproveName, name);
		  this.emitBroadcastEvent('admin', `Hello, ${name} ;) ❤︎`);
		});
  
		socket.on(SocketEvents.ChatMessage, (msg: string) => {
		  this.emitBroadcastEvent(SocketEvents.ChatMessage, msg)
		});
  
		socket.on(SocketEvents.Disconnect, () => {
		  this.deleteUser(socket.id);
		  this.broadcastUsers();
		  console.log('user disconnected');
		});
	  });
	}
}
