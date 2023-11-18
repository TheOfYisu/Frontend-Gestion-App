export interface data_user_uploader_interface {
  id: string;
  name: string;
  photo: string;
  lastname: string;
}

export interface data_user_profile_interface {
  id_users: number;
  name: string;
  charge: string;
  leader: string;
  photo: string;
  dni: string;
  dob: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  date_enter: string;
  status: string;
}

export interface table_schedules_interface {
  id: number;
  date: string;
  entry: string;
  break_1: string;
  lunch: string;
  break_2: string;
  exit: string;
}

export interface chatinterface {
  class_style: string;
  user: string;
  message: string;
}
