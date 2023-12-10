// app.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers: Map<string, number> = new Map(); // Store user's last activity timestamp

  handleConnection(client: Socket) {
    console.log(`Client connected: ${JSON.stringify(client.data)}`);
    const userId = client.data.userId;
    this.activeUsers.set(userId, Date.now()); // Set initial last activity timestamp
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const userId = client.data.userId;
    this.activeUsers.delete(userId);
  }

  setUserInactive(userId: string) {
    // Implement your logic here to set the user status to "inactive" in your database.
    // For this example, we will just emit an "inactive" event to the specific client.
    const socket = this.server.sockets.sockets.get(userId);
    if (socket) {
      socket.emit('inactive');
      socket.disconnect(); // Disconnect the socket to simulate logout
    }
  }

  // Implement the auto logout logic here using timers or timeouts
  // For example, you can periodically check the last activity timestamp
  // and call setUserInactive(userId) when the user is inactive for a certain period.
}
