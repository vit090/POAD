import { ConfigsService } from './../services/configs.service';
import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import {GLTFLoader} from 'c:/Users/viviR/node_modules/three/examples/jsm/loaders/GLTFLoader';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';


@Component({
  selector: 'app-estilo',
  templateUrl: './estilo.page.html',
  styleUrls: ['./estilo.page.scss'],
})
export class EstiloPage implements OnInit {

  constructor(private screenOrientation: ScreenOrientation, private configsService: ConfigsService) { }

  private loader: GLTFLoader;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private rendererr: THREE.WebGLRenderer;
  //Luzes
  private p_light: THREE.PointLight;
  private a_light: THREE.AmbientLight;

  //Lista dos carros e dos onibus
  private listaCarros: THREE.Mesh[];
  private listaOnibus: THREE.Mesh[];
  private numeroCarros: number;
  private numeroOnibus: number;

  //Lista de posições dos carros e dos onibus
  private posicoesCarros: number[];
  private posicoesOnibus: number[];

  //Variaveis de loading
  private carregouCarros: boolean = false;
  private carregouOnibus: boolean = false;

  //Variável de seleção
  private indiceSeleção: number;  

  private rodando;

  ngOnInit() {
    // Orientação
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    //SE O isCar N FOR DEFINIDO, É SETADO PARA TRUE
    if(this.configsService.isCar == undefined){
      this.configsService.isCar = true;
    }

    if(this.configsService.voltou)
    {
      this.Recarregar();
    }

    this.CreateScene1();

    this.Update();
  }

  CreateScene1() {
            

    console.log("CreateScene");

    // Definição da Cena
    this.scene = new THREE.Scene();

    //Loader
    this.loader = new GLTFLoader();

    //seta o indice de seleção para 0
    this.indiceSeleção = 0; 

    //Câmera
    this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
    this.camera.position.z = 12;
    this.camera.position.y = 4;
    this.camera.lookAt(0, 0, -5);
    //Renderer
    this.rendererr = new THREE.WebGLRenderer({ antialias: true});
		this.rendererr.setSize( window.innerWidth, window.innerHeight );
    this.rendererr.setClearColor('#303030');
  
    document.body.appendChild( this.rendererr.domElement );

    // Atualização do tamanha da janela
    window.addEventListener('resize',() => {
			this.rendererr.setSize( window.innerWidth, window.innerHeight );
			this.camera.aspect = window.innerWidth/ window.innerHeight;
			this.camera.updateProjectionMatrix();
    })

    // Definições de Luzes
    this.a_light = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.a_light);
    this.p_light = new THREE.PointLight(0xffffff, 0.5);
    this.scene.add(this.p_light);
    this.p_light.position.x = -2;
    this.p_light.position.y = 10;
    this.p_light.position.z = 3;
    this.p_light.lookAt(0, 0, 0);

    //Definindo numero de carros e onibus
    this.numeroCarros = 3;
    this.numeroOnibus = 4;

    //Inicilaiza as listas
    this.listaCarros = [];
    this.posicoesCarros = [];

    this.listaOnibus = [];
    this.posicoesOnibus = [];

    //CARREGA OS CARROS
    if(this.configsService.isCar){
      let pos = 0;
      for(let tipo: number = 0; tipo < this.numeroCarros; tipo ++){
        this.LoadObj("../../assets/Carro_" + (tipo + 1) +".glb", obj =>{
          this.listaCarros[tipo] = obj;
          this.posicoesCarros[tipo] = pos;
          pos += 7;
          this.scene.add(this.listaCarros[tipo]);
          this.listaCarros[tipo].position.set(this.posicoesCarros[tipo], 0, 0);
          if(tipo = this.numeroCarros -1 ){
            this.carregouCarros = true;
          }
        })
      }
    }

    // Carregar os Onibus
    else if(!this.configsService.isCar){
      let pos = 0;
      for(let tipo: number = 0; tipo < this.numeroOnibus; tipo ++){
        this.LoadObj("../../assets/Onibus_" + (tipo + 1) +".glb", obj =>{
          this.listaOnibus[tipo] = obj;
          this.posicoesOnibus[tipo] = pos;
          pos += 7;
          this.scene.add(this.listaOnibus[tipo]);
          this.listaOnibus[tipo].position.set(this.posicoesOnibus[tipo], 0, 0);
          if(tipo = this.numeroCarros -1 ){
            this.carregouCarros = true;
          }
        })
      }
    }
  }

  public MoverDireita(){

    console.log("Entrou MoverDireita, Indice: " + this.indiceSeleção);
    if(this.configsService.isCar){
      if(this.indiceSeleção != this.numeroCarros - 1){
        for(let i:number = 0; i < this.numeroCarros; i++){
          this.posicoesCarros[i] -= 7;
          this.listaCarros[i].position.set(this.posicoesCarros[i], 0, 0);
        }
        this.indiceSeleção ++;
      }
    }

    else if(!this.configsService.isCar){
      if(this.indiceSeleção != this.numeroOnibus - 1){
        for(let i:number = 0; i < this.numeroOnibus; i++){
          this.posicoesOnibus[i] -= 7;
          this.listaOnibus[i].position.set(this.posicoesOnibus[i], 0, 0);
        }
        this.indiceSeleção ++;
      }
    }
  }

  public MoverEsquerda(){
    console.log("Entrou MoverEsquerda, Indice: " + this.indiceSeleção);
    if(this.configsService.isCar){
      if(this.indiceSeleção > 0){
        for(let i:number = 0; i < this.numeroCarros; i++){
          this.posicoesCarros[i] += 7;
          this.listaCarros[i].position.set(this.posicoesCarros[i], 0, 0);
        }
        this.indiceSeleção --;
      }
      this.rendererr.clear();
    }

    else if(!this.configsService.isCar){
      if(this.indiceSeleção > 0){
        for(let i:number = 0; i < this.numeroOnibus; i++){
          this.posicoesOnibus[i] += 7;
          this.listaOnibus[i].position.set(this.posicoesOnibus[i], 0, 0);
        }
        this.indiceSeleção --;
      }
    }

  }

  public Escolher(){
    if(this.configsService.isCar){
      this.configsService.veiculo = "Carro_" + this.indiceSeleção;
    }
    else if(!this.configsService.isCar){
      this.configsService.veiculo = "Onibus_" + this.indiceSeleção;
    }
    console.log("Entrou");
    this.scene.dispose();
    this.rendererr.dispose();
    while(this.scene.children.length > 0){ 
      this.scene.remove(this.scene.children[0]); 
    }
    this.rendererr.clear();
    this.rendererr.resetGLState();
    this.rendererr.setClearAlpha(1);
    this.rendererr = null;
    this.camera = null;

    
  }

  public Update(){
    
    requestAnimationFrame(() => {
      this.Update();
    });
          
    this.rendererr.render( this.scene, this.camera );

    //se carregous os carros rotaciona eles
    if(this.configsService.isCar){
      if(this.carregouCarros){
        this.listaCarros[this.indiceSeleção].rotateY(0.05);
      }
    }

    //se carregous os onibus rotaciona eles
    else if(!this.configsService.isCar){

    }
    else if(this.carregouOnibus){
      this.listaOnibus[this.indiceSeleção].rotateY(0.05);
    }

    if(this.indiceSeleção == 2)
    {
      
    }

  }

  public LoadObj(caminho: string, callback){

    //UMA MESH QUE É CRIADA
    let mesh: THREE.Mesh;
    //VARIÁVEL CONTENDO A CENA  
    let scene: THREE.Scene = this.scene;

    //LOADER DA THREE JS
    this.loader.load (caminho, handle_load, 
      function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      function(error) {
        console.error( error );
      }
    );

    function handle_load(gltf){
      mesh = gltf.scene;
      scene.add(mesh);
      callback(mesh);
    }   
  }

  // Recarregar a Cena
  public Recarregar(): void{
    if(this.configsService.voltou)
    {
      location.reload();
    }
  }

  // Função obrigatoria para voltar
  public Voltar(): void
  {
      this.configsService.voltou = true;
  }
}
