import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Component, OnInit } from '@angular/core';
import { ConfigsService } from './../services/configs.service';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private vibration: Vibration, private screenOrientation: ScreenOrientation, public configs: ConfigsService) { }

  public i = 0;

  ngOnInit() {
    this.screenOrientation.lock('landscape-primary');
    this.configs.sound = true;
    this.vibration.vibrate(1000);
  }

  public Logo()
  {
    let logo = document.getElementById("Logo");
    let tamanho = 0;

    tamanho++;
    logo.style.backgroundSize = tamanho + "%, " + tamanho + "%";
    
  }

  // Recarregar a Cena
  public Recarregar(): void{
    location.reload();
  }
}
