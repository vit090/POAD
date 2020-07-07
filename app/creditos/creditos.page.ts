import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.page.html',
  styleUrls: ['./creditos.page.scss'],
})
export class CreditosPage implements OnInit {

  constructor(private screenOrientation: ScreenOrientation) { }

  

  
  ngOnInit() {
    this.screenOrientation.lock('landscape-primary');//
  }

}
