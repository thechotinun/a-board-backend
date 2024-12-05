import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class CommentSocketService {
  private connectedClients: Map<string, Socket> = new Map();

  addClient(userId: string, socket: Socket) {
    this.connectedClients.set(userId, socket);
  }

  removeClient(userId: string) {
    this.connectedClients.delete(userId);
  }

  getClientSocket(userId: string): Socket | undefined {
    return this.connectedClients.get(userId);
  }

  broadcastToRoom(room: string, event: string, data: any) {
    this.connectedClients.forEach((socket) => {
      if (socket.rooms.has(room)) {
        socket.emit(event, data);
      }
    });
  }
}
