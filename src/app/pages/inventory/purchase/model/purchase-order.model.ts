import {PurchaseOrderLines} from "./purchase-order-lines.model";

export interface PurchaseOrder {
  purchase_id: number;
  purchased_quantity: number | null;
  purchased_price: number | null;
  date_of_purchase: string | null;
  deleted: boolean | null;
  created_by: number | null;
  created_date: string | null;
  modified_by: number | null;
  modified_date: string | null;
  status: string;
  vendor_id: number | null;
  purchase_type_id: number | null;
  purchase_type_name: string | null;
  detail: PurchaseOrderLines[];
}
