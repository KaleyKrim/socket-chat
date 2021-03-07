import socketIo from 'socket.io';
import { Server } from 'http';

interface UsernameMap {
	[socketId: string]: string | null;
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
  
	constructor(private httpServer: Server){
	  this.socketServer = socketIo(httpServer);
	}
  
	listen(port: number) {
	  this.setupChatServer();
	  this.httpServer.listen(port, () => {
		console.log(`Chat server listening on ${port}`)
	  }); 
	}
  
	private setUser(socketId: string, name: string | null) {
	  this.usernameMap[socketId] = name;
	}
  
	private deleteUser(socketId: string) {
	  delete this.usernameMap[socketId];
	}
  
	private broadcastUsers() {
	  this.emitBroadcastEvent<UsernameMap>('users', this.usernameMap);
	}
  
	private emitBroadcastEvent<T>(eventType: string, content: T) {
	  this.socketServer.emit(eventType, content);
	}
  
	private emitSocketEvent<T>(socket: socketIo.Socket, eventType: string, content: T) {
	  socket.emit(eventType, content);
	}

	private registerRegistrationEvent(socket: socketIo.Socket) {
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
	}

	private registerChatMessageEvent(socket: socketIo.Socket) {
		socket.on(SocketEvents.ChatMessage, (msg: string) => {
			this.emitBroadcastEvent(SocketEvents.ChatMessage, msg)
		});
	}

	private registerDisconnectEvent(socket: socketIo.Socket) {
		socket.on(SocketEvents.Disconnect, () => {
			this.deleteUser(socket.id);
			this.broadcastUsers();
			console.log('user disconnected');
		});
	}

	private registerSocketEvents(socket: socketIo.Socket) {
		this.registerRegistrationEvent(socket);
		this.registerChatMessageEvent(socket);
		this.registerDisconnectEvent(socket);
	}
  
	private setupChatServer() {
		this.socketServer.on('connection', (socket) => {
			this.registerSocketEvents(socket);

			this.setUser(socket.id, null);
			this.broadcastUsers();
			this.emitSocketEvent(socket, SocketEvents.Admin, 'Oh, hey there. What\'s your name?');
		});
	}
}
