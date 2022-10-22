export interface AccessTokenPayload {
  subscriber: string;
  session_id: string;
}
export interface RefreshTokenPayload {
  subscriber: string;
  session_id: string;
  rt_token: string;
}
