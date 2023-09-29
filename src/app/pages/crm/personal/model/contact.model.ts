export interface CRM_CONTACT {
  contact_id: number;
  first_name: string;
  last_name: string;
  contact_title: string;
  cnic: string;
  address_line: string;
  city_id: number | null;
  country_id: number | null;
  zip_code: string;
  contact_type_id: number;
  contact_type_name: string;
  mobile_no: string;
  created_date: string | null;
  created_by: number | null;
  modified_date: string | null;
  modified_by: number | null;
  session_id: number | null;
  status: string;
  deleted: boolean | null;
}
