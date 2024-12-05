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
import { AuthService } from '@modules/auth/services/auth.service';
import { Logger } from '@utils/logger/logger.service';

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

  constructor(
    private commentSocketService: CommentSocketService,
    private authService: AuthService,
    private logger: Logger,
  ) {}

  handleConnection(client: Socket) {
    this.logger.verbose(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.verbose(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinPost')
  handleJoinPost(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { postId: string },
  ) {
    const roomName = `post_${data.postId}`;
    client.join(roomName);
    this.logger.verbose(`Client ${client.id} - joinPost: ${roomName}`);
  }

  @SubscribeMessage('createComment')
  async handleNewComment(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CommentPayload,
  ) {
    try {
      const [type, token] =
        client.handshake.headers.authorization?.split(' ') ?? [];
      if (type !== 'Bearer' && !token) return client.disconnect();
      const payloadToken = await this.authService.validateToken(token);
      const roomName = `post_${payload.postId}`;

      const response = {
        id: payload.id,
        text: payload.text,
        user: {
          userName: payloadToken.user.userName,
        },
        createdDate: payload.createdDate,
      } as CommentResponse;

      client.broadcast.to(roomName).emit('newComment', response);
      this.logger.verbose(
        `Client broadcast to ${roomName}: from ${payloadToken.user.userName}`,
      );
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
    this.logger.verbose(`Client disconnected from leavePost: ${client.id}`);
  }
}
