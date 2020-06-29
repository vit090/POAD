import { ConfigsService } from './../services/configs.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-selecao',
  templateUrl: './selecao.page.html',
  styleUrls: ['./selecao.page.scss'],
})
export class SelecaoPage implements OnInit {

  constructor(private screenOrientation: ScreenOrientation, public configs: ConfigsService) { }

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  public SelecionarCarro():void{
    this.configs.isCar = true;
    
  }

  public SelecionarOnibus():void{
    this.configs.isCar = false;
    
  }
}
