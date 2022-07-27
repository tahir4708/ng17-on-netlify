export interface PurchaseOrderLines {
  puchase_detail_id: number;
  purchase_id: number;
  product_id: number;
  product_name: string;
  purchase_price: number;
  purchase_quantity: number;
  unit_type_id: number | null;
  unit_type_name: string | null;
  allowed_discount: number | null;
  allowed_tax: number | null;
  sale_price: number | null;
  profit_percentage: number | null;
  deleted: boolean | null;
}
