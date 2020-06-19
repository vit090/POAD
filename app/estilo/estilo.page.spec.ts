import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstiloPage } from './estilo.page';

describe('EstiloPage', () => {
  let component: EstiloPage;
  let fixture: ComponentFixture<EstiloPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstiloPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstiloPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
