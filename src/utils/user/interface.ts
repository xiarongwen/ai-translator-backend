import { User } from '../../user/schemas/user.schema';

export interface UserServiceResponse {
  success: boolean;
  user?: User;
  error?: string;
}
