export enum AppMessage {
  INVALID_CREDENTIALS = 'Invalid credentials',
  USERNAME_ALREADY_EXISTS = 'Username already exists',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
  USER_NOT_FOUND = 'User not found',
  REGISTER_SUCCESS = 'Register success',
  LOGOUT_SUCCESS = 'Logout success',
  LOGIN_SUCCESS = 'Login success',
  LOGIN_USING_COOKIE_SUCCESS = 'Login using cookie success',
  TOKEN_REFRESH = 'New token generated using refresh token',
  AUTHENTICATED_USER = 'Authenticated user',

  // books
  PRODUCT_BOOKED = 'Product booked',
  PRODUCT_ALREADY_BOOKED_ERROR = 'You already have a booking for this product',
  BOOKED_ENTRY_FOUND = 'Booked entry found',
  MY_BOOKINGS = 'My bookings',
}
