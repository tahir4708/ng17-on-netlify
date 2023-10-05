export interface INV_PRODUCTS {

  product_id: number;
  product_name: string;
  product_code: string;
  product_description: string;
  product_barcode: string;
  product_price: number;
  brand_id: number | null;
  brand_name: string;
  category_id: number | null;
  category_name: string | null;
  product_alias_name: string;
  created_date: string | null;
  created_by: number | null;
  modified_date: string | null;
  modified_by: number | null;
  session_id: number | null;
  session_name: string | null;
  status: string;
  product_type_id: number | null;
  product_type_name: string | null;
  deleted: boolean | null;
  stock_quantity: number | null;
  location_id: number | null;
  location_name: string | null;
  stock_unit: string;
  grade: string;
  size: string;
}
