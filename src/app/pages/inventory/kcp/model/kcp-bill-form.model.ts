import {KcpBillLabourRateLinesModel} from "./kcp-bill-labour-rate-lines.model";
import {KcpBillPartsLinesModel} from "./kcp-bill-parts-lines.model";

export interface KcpBillFormModel{
  id: any | 0;
  billNo: any | '';
  workOrderNo: any | '';
  vehicleNo: any | '';
  date: any | '';
  totalBill: any | 0;
  totalPartsBill: any | 0;
  totalLabourBill : any|0;

  SaleKcpBillLabourLines: KcpBillPartsLinesModel[];
  SaleKcpBillPartsLines: KcpBillLabourRateLinesModel[];
}
