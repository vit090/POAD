import { Component, OnInit } from '@angular/core';
import { ConfigsService } from './../services/configs.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-estilo-basico',
  templateUrl: './estilo-basico.page.html',
  styleUrls: ['./estilo-basico.page.scss'],
})

export class EstiloBasicoPage implements OnInit {

  constructor(private screenOrientation: ScreenOrientation, private configsService: ConfigsService) { }

  // 
  private nMaxVeiculos: number; // Numero maximo de veiculos
  private nVeiculo: number; // Numero atual do veiculo
  private imagemShow;

  ngOnInit() {
    this.imagemShow = document.getElementById("Exibicao");

    this.nVeiculo = 1;

    this.screenOrientation.lock('landscape-primary');//
    
    //this.configsService.isCar = true;

    // Configurações Se for carro
    if(this.configsService.isCar)
    {
      // Maximo de skins do tipo
      this.nMaxVeiculos = 4;
      // Definição padrao
      this.configsService.veiculo = "Carro_1"
      this.imagemShow.style.background = "url('../../assets/img_Veiculos/img_Carro_1.png')"
    }
    else // Configurações se for Onibus
    {
      // Maximo de skins do tipo
      this.nMaxVeiculos = 4;
      // Definição padrao
      this.configsService.veiculo = "Onibus_1"
      this.imagemShow.style.background = "url('../../assets/img_Veiculos/img_Onibus_1.png')"
    }
  }

  public AoCarregar(): void
  {
    // Configurações Se for carro
    if(this.configsService.isCar)
    {
      // Maximo de skins do tipo
      this.nMaxVeiculos = 4;
      // Definição padrao
      this.configsService.veiculo = "Carro_1"
      this.imagemShow.style.background = "url('../../assets/img_Veiculos/img_Carro_1.png')"
    }
    else // Configurações se for Onibus
    {
      // Maximo de skins do tipo
      this.nMaxVeiculos = 4;
      // Definição padrao
      this.configsService.veiculo = "Onibus_1"
      this.imagemShow.style.background = "url('../../assets/img_Veiculos/img_Onibus_1.png')"
    }
  }

  public MoverDireita(): void
  {
    if(this.nVeiculo < this.nMaxVeiculos)
    {
      // Verifica se é carro ou onibus
      if(this.configsService.isCar)
        this.configsService.veiculo = "Carro_";
      else
        this.configsService.veiculo = "Onibus_";

      this.nVeiculo++;
      this.configsService.veiculo += this.nVeiculo;
    }
    this.imagemShow = document.getElementById("Exibicao");
    this.imagemShow.style.background = "url('../../assets/img_Veiculos/img_" + this.configsService.veiculo + ".png')";
  }

  public MoverEsquerda(): void
  {

    if(this.nVeiculo > 1)
    {
      // Verifica se é carro ou onibus
      if(this.configsService.isCar)
        this.configsService.veiculo = "Carro_";
      else
        this.configsService.veiculo = "Onibus_";

      this.nVeiculo--;
      this.configsService.veiculo += this.nVeiculo;
    }
    this.imagemShow = document.getElementById("Exibicao");
    this.imagemShow.style.background = "url('../../assets/img_Veiculos/img_" + this.configsService.veiculo + ".png')";
  }

  public Escolher(): void
  {

  }

}
