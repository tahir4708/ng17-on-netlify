import { Component, OnInit } from '@angular/core';
import {TreeNode} from "primeng/api";
import {MenuServiceService} from "../service/menu-service.service";
import {TreeData} from "../TreeData.model";

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  json: any;
  files1: TreeData[];

  files2: TreeData[];

  cols: any[];

  constructor(private nodeService: MenuServiceService) { }

  ngOnInit() {
    this.json = '{\n' +
      '    "data":\n' +
      '    [\n' +
      '        {\n' +
      '            "data":{\n' +
      '                "name":"Documents",\n' +
      '                "size":"75kb",\n' +
      '                "type":"Folder"\n' +
      '            },\n' +
      '            "children":[\n' +
      '                {\n' +
      '                    "data":{\n' +
      '                        "name":"Work",\n' +
      '                        "size":"55kb",\n' +
      '                        "type":"Folder"\n' +
      '                    },\n' +
      '                    "children":[\n' +
      '                        {\n' +
      '                            "data":{\n' +
      '                                "name":"Expenses.doc",\n' +
      '                                "size":"30kb",\n' +
      '                                "type":"Document"\n' +
      '                            }\n' +
      '                        },\n' +
      '                        {\n' +
      '                            "data":{\n' +
      '                                "name":"Resume.doc",\n' +
      '                                "size":"25kb",\n' +
      '                                "type":"Resume"\n' +
      '                            }\n' +
      '                        }\n' +
      '                    ]\n' +
      '                },\n' +
      '                {\n' +
      '                    "data":{\n' +
      '                        "name":"Home",\n' +
      '                        "size":"20kb",\n' +
      '                        "type":"Folder"\n' +
      '                    },\n' +
      '                    "children":[\n' +
      '                        {\n' +
      '                            "data":{\n' +
      '                                "name":"Invoices",\n' +
      '                                "size":"20kb",\n' +
      '                                "type":"Text"\n' +
      '                            }\n' +
      '                        }\n' +
      '                    ]\n' +
      '                }\n' +
      '            ]\n' +
      '        },\n' +
      '        {\n' +
      '            "data":{\n' +
      '                "name":"Pictures",\n' +
      '                "size":"150kb",\n' +
      '                "type":"Folder"\n' +
      '            },\n' +
      '            "children":[\n' +
      '                {\n' +
      '                    "data":{\n' +
      '                        "name":"barcelona.jpg",\n' +
      '                        "size":"90kb",\n' +
      '                        "type":"Picture"\n' +
      '                    }\n' +
      '                },\n' +
      '                {\n' +
      '                    "data":{\n' +
      '                        "name":"primeui.png",\n' +
      '                        "size":"30kb",\n' +
      '                        "type":"Picture"\n' +
      '                    }\n' +
      '                },\n' +
      '                {\n' +
      '                    "data":{\n' +
      '                        "name":"optimus.jpg",\n' +
      '                        "size":"30kb",\n' +
      '                        "type":"Picture"\n' +
      '                    }\n' +
      '                }\n' +
      '            ]\n' +
      '        }\n' +
      '    ]\n' +
      '}';


    this.nodeService.getFilesystem().then(files => this.files1 = files);
    this.nodeService.getFilesystem().then(files => this.files2 = files);

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'size', header: 'Size' },
      { field: 'type', header: 'Type' }
    ];
  }

}
