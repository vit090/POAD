import { Component, OnInit } from '@angular/core';
import { ConfigsService } from './../services/configs.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-opcoes',
  templateUrl: './opcoes.page.html',
  styleUrls: ['./opcoes.page.scss'],
})
export class OpcoesPage implements OnInit {

  constructor(private screenOrientation: ScreenOrientation, public configs: ConfigsService) { }

  ngOnInit() {
  }

  public Audio()
  {
    this.screenOrientation.lock('landscape-primary');
    this.configs.sound = !this.configs.sound;
  }
}


