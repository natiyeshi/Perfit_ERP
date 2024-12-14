export interface IEmployee {
  first_name: string;
  last_name: string;
  grand_father_name: string;
  email: string;
  phone_number: string;
  position: string;
  department: string;
  date_hired: string; 
  status: string;
  birth_date: string;
  gender: string;
}

export interface IDBEmployee extends IEmployee {
  id: string;
}



