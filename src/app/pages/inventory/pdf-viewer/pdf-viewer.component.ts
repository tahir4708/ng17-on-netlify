import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {
  pdfData: string | ArrayBuffer | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    debugger;
    this.route.queryParams.subscribe(params => {
      const base64Pdf = params['base64Pdf'];
      if (base64Pdf) {
        // Decode the Base64 PDF to a binary array
        this.pdfData = atob(base64Pdf);
      }
    });
  }

}
