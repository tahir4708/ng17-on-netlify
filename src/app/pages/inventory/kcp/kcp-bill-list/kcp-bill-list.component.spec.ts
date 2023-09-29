import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcpBillListComponent } from './kcp-bill-list.component';

describe('KcpBillListComponent', () => {
  let component: KcpBillListComponent;
  let fixture: ComponentFixture<KcpBillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KcpBillListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KcpBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
