import { Component, OnInit } from '@angular/core';
import { ConfigsService } from './../services/configs.service';

@Component({
  selector: 'app-opcoes',
  templateUrl: './opcoes.page.html',
  styleUrls: ['./opcoes.page.scss'],
})
export class OpcoesPage implements OnInit {

  constructor(public configs: ConfigsService) { }

  ngOnInit() {
  }
}
 