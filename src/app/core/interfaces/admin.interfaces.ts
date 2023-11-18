export interface get_listable_rol_interface {
  id_rol: number;
  name: string;
  description: string;
  status: number;
}

export interface get_listable_modules_interface {
  id_modules: number;
  name: string;
  description: string;
  status: number;
}

export interface get_listable_position_interface {
  id_position: number;
  name: string;
  description: string;
  status: boolean;
}

export interface get_listable_additional_fields_interface {
  id_additional_fields: number;
  name: string;
  description: string;
  status: boolean;
}

export interface get_listable_status_time_interface {
  id_status_time: number;
  name: string;
  description: string;
  status: boolean;
}

export interface get_listable_type_requests_interface {
  id_type_requests: number;
  name: string;
  description: string;
  status: boolean;
}

export interface get_listable_status_requests_interface {
  id_status_requests: number;
  name: string;
  description: string;
  status: boolean;
}

export interface create_user_interface {
  name: string;
  name2: string;
  lastname: string;
  lastname2: string;
  dni: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  date_entry: string;
  status: string;
  password: string;
  typeuser: number;
  hours_weekly: string;
  position: number;
  card: string;
}
