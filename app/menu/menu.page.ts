import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Component, OnInit } from '@angular/core';
import { ConfigsService } from './../services/configs.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private screenOrientation: ScreenOrientation, public configs: ConfigsService) { }

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  // Recarregar a Cena
  public Recarregar(): void{
    location.reload();
  }
}
