import {Injectable} from '@angular/core';
import {jqxGridComponent} from 'jqwidgets-ng/jqxgrid';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  public theme: 'OFFICE'
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  generateDropDownAdapter(data: any[], labelAttribute?: string, valueAttribute?: string, dataFields?: any[]): any {
    // const tempData = [{value: -1, label: '            '}];
    // data = tempData.concat(data);
    let fields: any = [];
    if (labelAttribute === undefined) {
      labelAttribute = 'label';
    }
    if (valueAttribute === undefined) {
      valueAttribute = 'value';
    }
    if (dataFields === undefined) {
      fields = [
        {name: labelAttribute, type: 'string'},
        {name: valueAttribute, type: 'string'},
        {name: 'code', type: 'string'}
      ];
    } else {
      for (const field of dataFields) {
        fields.push({name: field, type: 'string'});
      }
    }
    const adapter = new jqx.dataAdapter({
      datatype: 'json',
      datafields: fields,
      localdata: data
    });
    return adapter;
  }

  /*generateTableColumns(dataGrid: jqxGridComponent, fields: GridFieldModel[], lovMap: any, editRoute: string): any[] {
    const tableColumn = [];
    for (const field of fields) {
      if (field.filterable === undefined || field.filterable === null) {
        field.filterable = true;
      }
      const colMeta: any = {};
      colMeta.text = '<b >' + field.label + '</b>';
      colMeta.datafield = field.name;
      colMeta.filterable = field.filterable;
      if (field.gui === 'time') {
        colMeta.cellsformat = 'hh:mm:ss tt';
      } else if (field.gui === 'datetime') {
        colMeta.cellsformat = 'dd/MM/yyyy hh:mm:ss tt';
      } else if (field.gui === 'date') {
        colMeta.cellsformat = 'dd/MM/yyyy';
      } else if (field.gui === undefined || field.gui === null) {
        // tableColumn.push({ text: '<b style='color:#32c5d2'>'+field.label+'</b>', datafield: field.name });

      } else if (field.gui === 'hidden') {
        // tableColumn.push({ text: '<b style='color:#32c5d2'>'+field.label+'</b>', datafield: field.name , hidden:true});
        colMeta.hidden = true;

      } else if (field.gui === 'list') {


        if (field.filterable === true) {
          colMeta.filtertype = 'list';
          colMeta.filteritems = this.generateDropDownAdapter(lovMap[field.name]);
          colMeta.createfilterwidget = (column, htmlElement, editor) => {
            editor.jqxDropDownList({filterable: true, displayMember: 'label', valueMember: 'value'});
          };
        }
        colMeta.displayfield = field.labelAttribute;
      }
      if (field.gui !== 'skip') {
        tableColumn.push(colMeta);
      }
    }
    tableColumn.push({
      text: '<b > Action </b>',
      datafield: 'Edit',
      columntype: 'button',
      filterable: false,
      sortable: false,
      width: '50px',
      cellsrenderer: () => {
        return 'Edit';
      },
      buttonclick: (row) => {
        const rowData = dataGrid.getrowdata(row);
        if (editRoute === undefined) {
          this.toastr.warning('No Edit Route Defined', environment.PRODUCT_TITLE);
        } else {
          this.router.navigateByUrl(editRoute.replace(':id', rowData.id));
        }
      }
    });
    return tableColumn;
  }*/

  /*generateSource(dataGrid: jqxGridComponent, fields: GridFieldModel[], data: any): any {
    return {
      datatype: 'json',
      datafields: fields,
      root: 'data',
      id: 'id',
      localdata: data,
      deleterow: (rowid, commit) => {
        commit(true);
      }
    };


  }*/

  public deleteRows(ids: number [], endpointDelete: string): Observable<any> {

    return this.http.post<Observable<any>>(endpointDelete, ids).pipe(
      map((result: any) => {
        if (result.dataHeader.messageType === 'SUCCESS') {
          if (result.data === false) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }

      })
    );
  }

  public getLov(lovUrl: string): Observable<any> {
    return this.http.get<Observable<any>>(lovUrl);
  }

  public generateGridDropDownList = (container, data, labelAttribute, valueAttribute, dataFields?: any[]) => {
    console.log(container);
    if (labelAttribute === undefined) {
      labelAttribute = 'label';
    }
    if (valueAttribute === undefined) {
      valueAttribute = 'key';
    }

    container.jqxDropDownList({
      theme: this.theme,
      height: '32px',
      autoItemsHeight: false,
      autoDropDownHeight: false,
      itemHeight: 20,
      dropDownHeight: 200,
      source: this.generateDropDownAdapter(data, labelAttribute, valueAttribute, dataFields),
      displayMember: labelAttribute,
      valueMember: valueAttribute,
      filterable: 'true',
      searchMode: 'containsignorecase'


    });
  }

  deleteAction(dataGrid, stageData): void {
    const ids = [];
    const changedData = [];
    for (const row of dataGrid.getselectedrowindexes()) {
      const deletedRow = dataGrid.getrowdata(row);
      deletedRow.recordStatus = 'D';
      stageData.deleted.push(deletedRow);
      const rowid = dataGrid.getrowid(row);
      ids.push(rowid);
      const rowData = dataGrid.getrowdata(row);
      rowData.recordStatus = 'D';
      if (rowData.id > 0) {
        changedData.push(rowData);
      }
    }
    dataGrid.deleterow(ids);
    dataGrid.clearselection();
    stageData.data = dataGrid.getrows();

  }

  fetchGridRecord(service, data, parentId, lovMap, dataGrid): void {
    service.findByParent(parentId).subscribe(resp => {
      data = resp.data;
      lovMap = resp.lovMap;
      (dataGrid.source() as any)._source.localdata = data;
      dataGrid.updatebounddata('cells');
      dataGrid.refresh();
      dataGrid.autoresizecolumns();
      dataGrid.clearselection();
    });
  }

  validateUnique(dataGrid: any, uniqueFields: any[], dataField: string, row: number, value: any, message = 'Row Already Exist'): any {
    const firstRow = dataGrid.getrowdata(row);
    firstRow[dataField] = value.value;
    const gridData = dataGrid.getrows();
    let totalFound = 0;
    let findKey = '';
    for (const uf of uniqueFields) {
      findKey += firstRow[uf];
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < gridData.length; i++) {

      let rowKey = '';
      for (const uf of uniqueFields) {
        if (gridData[i][uf] !== null) {
          rowKey += gridData[i][uf];
        }

      }
      if (rowKey === findKey) {
        totalFound++;
      }
    }
    if (totalFound <= 1) {
      return true;
    }
    return {result: false, message: message};
  }

  public cellRenderer(grid, row, columnproperties, value): any {
    if (grid !== undefined) {
      if (grid.getcellvalue(row, 'recordStatus') === 'U') {
        return '<span style="margin: 4px; margin-top:8px; float: ' + columnproperties.cellsalign + '; color: blue;">' + value + '</span>';
      } else if (grid.getcellvalue(row, 'recordStatus') === 'N') {
        return '<span style="margin: 4px; margin-top:8px; float: ' + columnproperties.cellsalign + '; color: #c2c2c2;">' + value + '</span>';
      }
    }
  }

  public requiredDropDownValidation(cell, value): any {
    if (value.value > 0) {
      return true;
    }
    return {result: false, message: 'Value is Required'};
  }

  public requiredStringValidation(cell, value): any {
    if (value.trim().length > 0) {
      return true;
    }
    return {result: false, message: 'Value is Required'};
  }

  public requiredPositiveNumberValidation(cell, value): any {
    if (value > 0) {
      return true;
    }
    return {result: false, message: '+ve Value is Required'};
  }

  public positiveNumberValidation(cell, value): any {
    if (value >= 0) {
      return true;
    }
    return {result: false, message: '+ve Value is Required'};
  }

  public rangeValidation(value: number, min: number, max: number): any {
    if (value >= min) {
      if (value <= max) {
        return true;
      } else {
        return {result: false, message: 'Maximum allowed value is ' + max};
      }
    }
    return {result: false, message: 'Minimum allowed value is ' + min};
  }

  cellClass(row, columnfield, value): any {
    if (value.length === 0) {
      return 'required-cell';
    }
  }

  public requiredDateValidation(cell, value): any {
    if (value) {
      return true;
    }
    return {result: false, message: 'Value is Required'};
  }

  public requiredUrlValidation(cell, value): any {
    if (value.trim().length > 0) {
      const valid = /^(ftp|http|https):\/\/[^ "]+$/.test(value.trim());
      if (valid) {
        return true;
      } else {
        return {result: false, message: 'Invalid URL'};
      }
    } else {
      return {result: false, message: 'Value is Required'};
    }
  }
}
