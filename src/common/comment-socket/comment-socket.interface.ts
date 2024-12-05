export interface CommentPayload {
  postId: string;
  text: string;
}

export interface CommentResponse {
  id: string;
  text: string;
  userName: string;
  createdDate: Date;
}
