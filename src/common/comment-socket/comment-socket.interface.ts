export interface CommentPayload {
  postId: string;
  id: string;
  text: string;
  createdDate: string;
}

export interface CommentResponse {
  id: string;
  text: string;
  createdDate: string;
  user: {
    userName: string;
  };
}
