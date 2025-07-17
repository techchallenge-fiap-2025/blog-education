export enum UserRole {
  Student = 'student',
  Teacher = 'teacher',
}
export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  isActive: boolean;
  role: UserRole;
}
