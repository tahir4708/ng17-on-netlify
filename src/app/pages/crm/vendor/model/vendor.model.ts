import { CRM_CONTACT } from "../../personal/model/contact.model";


export interface CRM_VENDOR {
  vendor_id: number;
  contact_id: number;
  shop_name: string;
  created_by: number | null;
  created_date: string | null;
  modified_by: number | null;
  modified_date: string | null;
  deleted: boolean | null;
  status: string;
  contact: CRM_CONTACT;
}
