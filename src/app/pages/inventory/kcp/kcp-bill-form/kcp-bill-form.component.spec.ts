import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcpBillFormComponent } from './kcp-bill-form.component';

describe('KcpBillFormComponent', () => {
  let component: KcpBillFormComponent;
  let fixture: ComponentFixture<KcpBillFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KcpBillFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KcpBillFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
