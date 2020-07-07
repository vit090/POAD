import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstiloBasicoPage } from './estilo-basico.page';

describe('EstiloBasicoPage', () => {
  let component: EstiloBasicoPage;
  let fixture: ComponentFixture<EstiloBasicoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstiloBasicoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstiloBasicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
