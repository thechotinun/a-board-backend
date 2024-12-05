// post-socket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CommentSocketService } from './comment-socket.service';
import { CommentPayload, CommentResponse } from './comment-socket.interface';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'api/v1/socket-post',
  pingInterval: 10000,
  pingTimeout: 5000,
})
@Injectable()
export class CommentSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clientRooms = new Map<string, Set<string>>();

  constructor(private commentSocketService: CommentSocketService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinPost')
  handleJoinPost(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { postId: string },
  ) {
    const roomName = `post_${data.postId}`;
    client.join(roomName);
    console.log(`Client: ${client.id} - joinPost: ${roomName}`);
  }

  @SubscribeMessage('createComment')
  async handleNewComment(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CommentPayload,
  ) {
    try {
      const roomName = `post_${payload.postId}`;

      const response = {
        id: 'generated-id',
        text: payload.text,
        userName: 'User Name',
        createdDate: new Date(),
      } as CommentResponse;

      client.broadcast.to(roomName).emit('newComment', response);
    } catch (error) {
      client.emit('error', {
        message: 'Failed to create comment',
      });
    }
  }

  @SubscribeMessage('leavePost')
  handleLeavePost(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { postId: string },
  ) {
    const roomName = `post_${data.postId}`;
    client.leave(roomName);
    client.disconnect();
    console.log(`Client disconnected from leavePost: ${client.id}`);
  }
}
