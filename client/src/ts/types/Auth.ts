export type AuthData = {
  username: string;
  email: string;
  password: string;
};

export interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}