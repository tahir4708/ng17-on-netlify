import {PurchaseOrderLines} from "./purchase-order-lines.model";

export interface PurchaseOrder {
  purchase_id: number;
  purchased_quantity: number | null;
  purchased_price: number | null;
  date_of_purchase: any;
  deleted: boolean;
  created_by: number | null;
  created_date: any;
  modified_by: number | null;
  modified_date: any;
  status: string;
  vendor_id: number | null;
  purchase_type_id: number | null;
  purchase_type_name: string | null;
  detail: PurchaseOrderLines[];
  total_bill_amount: number | null;
  remaining_bill_amount: number | null;
  paid_bill_amount: number | null;

}
