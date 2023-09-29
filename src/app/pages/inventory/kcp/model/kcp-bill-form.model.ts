import {KcpBillLabourRateLinesModel} from "./kcp-bill-labour-rate-lines.model";
import {KcpBillPartsLinesModel} from "./kcp-bill-parts-lines.model";

export interface KcpBillFormModel{
  id: any | 0;
  billNo: any | '';
  workOrderNo: any | '';
  date: any | '';
  kcpBillPartsLines: KcpBillPartsLinesModel[];
  kcpBillLabourRatesLines: KcpBillLabourRateLinesModel[];
  partsLinesTotal: any | 0;
  labourRatesLinesTotal: any | 0;
  totalBill: any | 0;
  totalPartsBill: any | 0;
  totalLabourBill : any|0;
}
