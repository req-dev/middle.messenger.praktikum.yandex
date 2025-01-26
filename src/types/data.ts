export interface UserModel {
  id: number,
  first_name: string,
  second_name: string,
  display_name: string,
  phone: string,
  login: string,
  avatar: string,
  email: string
}

export interface UpdateProfileRequest {
  first_name: string,
  second_name: string,
  display_name: string,
  login: string,
  email: string,
  phone: string
}

export interface UpdatePasswordRequest {
  oldPassword: string,
  newPassword: string
}

export interface LoginFormModel {
  login: string;
  password: string;
}

export interface SignupFormModel {
  email: string,
  login: string,
  first_name: string,
  second_name: string,
  phone: string
  password: string,
}
