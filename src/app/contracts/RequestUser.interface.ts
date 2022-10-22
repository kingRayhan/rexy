export interface RequestUserDetails {
  _id: string;
  id: string;
  name: string;
  avatar: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestUser {
  subscriber: string;
  session_id: string;
  details: RequestUserDetails;
}
