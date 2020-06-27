import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import * as THREE from 'three';
import {GLTFLoader} from 'c:/Users/basso/node_modules/three/examples/jsm/loaders/GLTFLoader';
import { ConfigsService } from './../services/configs.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(private deviceMotion: DeviceMotion, 
        private plt: Platform, 
        private screenOrientation: ScreenOrientation,
        public configs: ConfigsService) 
    {}

    //#region Variáveis
    //Loader
    private loader: GLTFLoader;
    private audioLoader: THREE.AudioLoader;

    // Tempo
    private time: Date;
	private startTime: number;
    private currentTime: number;
    private lastFrameTime: number;
    private currentFrameTime: number;
    private multFrame: number;
    // Timer
    private tempo1: number;
    private tempo2: number;
    private frst: boolean;
    private tempoAux: number;
    private bonusTimer
    public tempoShow: number;
    // Configurações do Mundo
	private scene:  THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private listener: THREE.AudioListener;
    private renderer: THREE.WebGLRenderer;
    // Configuraçoes de Luzes
	private a_light: THREE.AmbientLight;
    private p_light: THREE.PointLight;
    // Objs
    private cube: THREE.Mesh;
    private jogador: THREE.Mesh;
    private predios;
    // Configurações de Jogo
    private gameMode: boolean;
    private velocidadeHorizontal: number;
    private velocidadeFrente: number;
    private freio: boolean;
    private jogando: boolean;
    private quilometros: number;
    public quilometragem: number;
    // Configurações de Passageiros
    public nPessoasEntregues: number;
    public nPessoasPerdidas: number;
    public inverter;
    public pessoas;
    public nPessoas;
    private delayMax: number;
    private delayMin: number;
    // Configurações de Paradas
    public parada: THREE.Mesh;
    // Informações do veiculo
    private maxPessoas: number;
    public atualPessoas: number;
    private areaDeColisaoX: number;
    private nBatidas: number;
    private vooando: boolean;
    private iguinicao: boolean;
    private tempIginicao: number;
    private curvaGravidade: number;
    private velBase: number;
    public velocidadeDoJogador: number;
    // Imortalidade
    public imortal: boolean;
    private tempImortal: number;
    public tf: number
    // Onibus X Carro
    private velCarro: number;
    private velOnibus: number;
    private maxCarro: number;
    private maxOnibus: number;
    // Outros Carros na Rua
    private carsIgini;
    private carsVooando;
    private carsTempIgini;
    private carsCruGravi;
    private carrosDireita;
    private carrosEsquerda;
    private carrosDelayMax: number;
    private carrosDelayMin: number;
    private nCarrosDireita: number;
    private nCarrosEsquerda: number;
    private velCarrosDireita: number;
    private velCarrosEsquerda: number;
    private posLugares;
    // Configurações da Rampa
    public rampa: THREE.Mesh;
    // Teste
    public teste1: number;
    public teste2: number;
    public teste3: number;
    public teste4: number;    
    // Variaveis de carregamento 
	public carregouJogador: boolean = false;
	public carregouPredios: boolean = false;
	public carregouPessoas: boolean = false;
	public carregouParadas: boolean = false;
	public carregouRampas: boolean = false;
    public carregouCarros: boolean = false;
    public carregouMusica: boolean = false;
    // Para angulos
    private PI: number = 3.14159265359;
    private angulo: number = this.PI/180;
    //Musica Top
    private topGear: THREE.Audio;
    //#endregion

    ngOnInit()
    {
        // Valores globais
        const PI = 3.14159265359;

        // Timer
        this.time = new Date();
        this.startTime = this.time.getTime();

        // Orientação
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

        this.CreatScene();

        this.Update();

        console.log("IsCar: " + this.configs.isCar);
    }
    
    public CreatScene(): void{
        // Definição da Cena
        this.scene = new THREE.Scene();
        
        //Loader
        this.loader = new GLTFLoader();
        this.audioLoader = new THREE.AudioLoader();

        // Tempo
        this.multFrame = 0.002;

        // Definições do Timer
        this.tempoShow = 30;
        this.bonusTimer = 10;
        this.tempo1 = 0;
        this.tempo2 = 0;
        this.frst = true;
        this.tempoAux = 0;

        // Definição de Camera
        this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.z = 5.5;
        this.camera.position.y = 4;
        this.camera.lookAt(0, 2, 0.5);
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);
        // Definições de Renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true});
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.setClearColor('#6e6f70');
        document.body.appendChild( this.renderer.domElement );
        
        // Definições de Luzes
        this.a_light= new THREE.AmbientLight(0xffffff, 0.5);
		this.scene.add(this.a_light);
		this.p_light = new THREE.PointLight(0xffffff, 0.5);
    	this.scene.add(this.p_light);
    	this.p_light.position.x = -2;
    	this.p_light.position.y = 10;
    	this.p_light.position.z = 3;
        this.p_light.lookAt(0, 0, 0);

        // Definições do jogo
        this.velocidadeHorizontal = 1;
        this.velocidadeFrente = 50;
        this.freio = false;
        this.jogando = false;
        this.quilometragem = 0;
        this.quilometros = 0;
        
        // Definições das pessoas
        this.nPessoasPerdidas = 0;
        this.nPessoasEntregues = 0;
        this.inverter = [];
        this.delayMax = 20;
        this.delayMin = 5;
        this.nPessoas = 8;
        this.pessoas = [];


        // Definições do veiculo
        this.atualPessoas = 0;
        this.areaDeColisaoX = 0.4;
        this.nBatidas = 0;
        this.maxPessoas = 4;
        this.vooando = false;
        this.iguinicao = false;
        this.tempIginicao = 20;
        this.curvaGravidade = 0;
        this.velocidadeDoJogador = 0;
        
        // Imortalidade
        this.imortal = false;
        this.tempImortal = 80;

        // Onibus X Carro
        this.velCarro = 1;
        this.velOnibus = 0.5;
        this.maxCarro = 4;
        this.maxOnibus = 20;

        // Outros Carros na Rua
        this.carrosDelayMax = 10
        this.carrosDelayMin = 2;
        this.nCarrosDireita = 7;
        this.nCarrosEsquerda = 4;
        this.velCarrosDireita = 1.2;
        this.velCarrosEsquerda = 1.5;
        this.posLugares = [-2.2, -1.1, 1.1, 2.2];
        if(this.configs.isCar)
        {
            // Carro
            this.maxPessoas = this.maxCarro;
            this.velBase = this.velCarro;
        }
        else
        {
            // Onibus
            this.maxPessoas = this.maxOnibus;
            this.velBase = this.velOnibus;
        }
        // Testes
        this.teste1 = 0;
        this.teste2 = 0;
        this.teste3 = 0;
        this.teste4 = 0;


        
        ///////////////////////////////////////////////////////////////////////////

        // Atualização do tamanha da janela
        window.addEventListener('resize',() => {
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.camera.aspect = window.innerWidth/ window.innerHeight;
			this.camera.updateProjectionMatrix();
        })
        
        // Base para cubos
    	let geometry = new THREE.BoxGeometry(4, 0.1, 30);
        let material = new THREE.MeshLambertMaterial( { color: 0xAEAEAC } );
        
        // Calsada da direita
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.position.y = 0;
        this.cube.position.x = 4.7;
        this.cube.position.z = -12;
        this.scene.add(this.cube);

        // Calsada da esquerda
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.position.y = 0;
        this.cube.position.x = -4.7;
        this.cube.position.z = -12;
        this.scene.add(this.cube);

        // Rua
        material = new THREE.MeshLambertMaterial( { color: 0x80807E } );
        geometry = new THREE.BoxGeometry(10, 0.01, 40)
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.position.y = 0;
        this.cube.position.x = 0;
        this.cube.position.z = -12;
        this.scene.add(this.cube);

        //Caixas - Predios
        this.predios = [];
        // Predios da direita
        for(let i:number = 0; i<10; i++)
        {
            let tipo = Math.floor(Math.random() * 5 + 1);
            let obj:THREE.Mesh;
			this.LoadObj("../../assets/Predio_Antigo_" + tipo + ".glb", mesh =>{
				obj = mesh;
				obj.position.x = -5;
				obj.position.z = -i * 1.65* 1.5;
				obj.rotation.y = this.PI/2;
				this.predios[i] = obj;
				this.scene.add(this.predios[i]);
			});
        }

        // Predios da esquerda 
        for(let k:number = 10; k < 20; k++)
        {
            let tipo = Math.floor(Math.random() * 5 + 1);
            let obj:THREE.Mesh;
			this.LoadObj("../../assets/Predio_Antigo_" + tipo + ".glb", mesh =>{
				obj = mesh;
				obj.position.x = 5;
				obj.position.z = (-k * 1.65 * 1.5 ) + 22;
				obj.rotation.y = -this.PI/2;
				this.predios[k] = obj;
				this.scene.add(this.predios[k]);	
				if(k == 19)
				{
					this.carregouPredios = true;
				}
			});
        }
        
        // Pessoas
        for(let i:number = 0; i < this.nPessoas; i++)
        {
            let t = Math.floor(Math.random() * 2 + 1);
            let estado
            if (t == 1)
            {
                estado = true;
            }
            else
            {
                estado = false;
            }
            let tipo = Math.floor(Math.random() * 4 + 1);
            let obj :THREE.Mesh;
			this.LoadObj("../../assets/Generico_" + tipo + ".glb", mesh =>{
                //this.inverter[i] = estado;
                obj = mesh;
                if(estado)
                    obj.rotation.z = 0.2;
                else
                    obj.rotation.z = -0.2;
				obj.position.z = -0.1;
				obj.position.y = 0;
				obj.position.x = -3;
				this.pessoas[i] = obj
				obj.scale.set(0.1,0.1,0.1);
				this.scene.add(this.pessoas[i]);
				if(i == this.nPessoas-1){
					this.carregouPessoas = true;
				}
			})
		}

        // Outros Carros na Rua
        this.carrosDireita = [];
        this.carrosEsquerda = [];
        this.carsIgini = [];
        this.carsVooando = [];
        this.carsTempIgini = [];
        this.carsCruGravi = [];

        // Carros da Direita
        for(let j:number = 0; j < this.nCarrosDireita; j++)
        {
            let pos = Math.floor(Math.random() * 2);
            if (pos == 1)
            {
                pos = this.posLugares[2];
            }
            else
            {
                pos = this.posLugares[3];
            }
            let obj:THREE.Mesh;

            let tipo = Math.floor(Math.random() * 3 + 1);

            this.carsVooando[j] = false;
            this.carsIgini[j] = false;
            this.carsTempIgini[j] = 20;
            this.carsCruGravi[j] = 0;

			this.LoadObj("../../assets/Carro_" + tipo + ".glb", mesh =>{
			obj = mesh;
			obj.position.x = pos;
            obj.position.z = -j * 4 * 1.5;
            obj.rotation.y = this.angulo * 180;
			this.carrosDireita[j] = obj;
			obj.scale.set(0.2, 0.2, 0.15);
			this.scene.add(this.carrosDireita[j]);

         });
        }

        // Carros da Esquerda
        for(let j:number = 0; j < this.nCarrosEsquerda; j++)
        {
            let pos = Math.floor(Math.random() * 2);
            if (pos == 1)
            {
                pos = this.posLugares[1];
            }
            else
            {
                pos = this.posLugares[0];
            }
            let obj:THREE.Mesh;

            this.carsVooando[j + this.nCarrosEsquerda] = false;
            this.carsIgini[j + this.nCarrosEsquerda] = false;
            this.carsTempIgini[j + this.nCarrosEsquerda] = 20;
            this.carsCruGravi[j + this.nCarrosEsquerda] = 0;

            let tipo = Math.floor(Math.random() * 3 + 1);

			this.LoadObj("../../assets/Carro_" + tipo + ".glb", mesh =>{
            obj = mesh;
            obj.position.x = pos;
            obj.position.z = -j * 4 * 1.5;
			this.carrosEsquerda[j] = obj;
			obj.scale.set(0.2, 0.2, 0.15);
            this.scene.add(this.carrosEsquerda[j]);
            if(j == this.nCarrosEsquerda-1){
				this.carregouCarros = true;
			}
         });
        }
        
        // Parada
        let parada:THREE.Mesh;
        this.LoadObj("../../assets/Ponto.glb", mesh =>{
            this.parada = mesh;
            this.parada.position.z = -0.1;
            this.parada.position.y = 0;
            this.parada.position.x = -3.2
            this.parada.rotation.y = this.PI/2;
            this.parada.scale.set(0.15, 0.15,0.15);
            this.scene.add(this.parada)
            this.carregouParadas = true;
        });

        // Rampa
        let rampa:THREE.Mesh;
        this.LoadObj("../../assets/Rampa.glb", mesh =>{
            this.rampa = mesh;
            this.rampa.position.z = -6;
            this.rampa.position.y = 0;
            this.rampa.scale.set(0.3, 0.3, 0.3);
            this.scene.add(this.rampa);
            this.carregouRampas = true;
        });


        // Jogador
        let veiuculoDoJogador = "Carro";
        let skinDoVeiculo = 1;

        if(this.configs.isCar)
        {
            veiuculoDoJogador = "Carro" // Define o tipo do veiculo como Carro
        }
        else
        {
            veiuculoDoJogador = "Onibus" // Define o tipo do veiculo como Onibus
        }

        this.LoadObj("../../assets/" + veiuculoDoJogador +"_" + skinDoVeiculo + ".glb", mesh =>{
            this.jogador = mesh;
            this.jogador.position.z = -0.1;
            this.jogador.position.y = 0;
            
            this.jogador.scale.set(0.2, 0.2, 0.2);
            this.jogador.rotation.y = this.angulo * 180;
			//this.jogador.rotateY(this.PI);
			this.jogador.castShadow= true;
            this.jogador.receiveShadow= true;
            this.scene.add(this.jogador);

            if(this.configs.isCar)
            {
                this.jogador.scale.set(0.2, 0.2, 0.15);
            }
            else
            {
                this.jogador.scale.set(0.2, 0.2, 0.1);
            }

			this.carregouJogador = true;
        });
        
        this.LoadAudio("../../assets/audio/TopGear.mp3", sound => {
            this.topGear = sound;
            this.topGear.setLoop(true);
            this.topGear.play();
            this.carregouMusica = true;
        })
    }

     //FUNÇÃO QUE CARREGA MODELOS 
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
            //EU USEI A getObjectById(gltf.scene.id + 2) PQ A VARIÁVEL gltf.scene
            //NA VERDADE É UM GRUPO COM 2 COISAS DENTRO, UMA CÂMERA E A MESH DO OBJ.
            //O ID DA MESH É SEMPRE O ID DA CENA MAIS 2
            //(PELO MENOS EU ACHO, SE DER MERDA SEPA TEM QUE MUDAR ISSO AÍ)
			mesh = gltf.scene;
            scene.add(mesh);
			callback(mesh);
			
        }   

	}

    public LoadAudio(caminho: string, callback){

        let sound = new THREE.Audio( this.listener );

        this.audioLoader.load(caminho, handle_load);

        function handle_load( buffer ){
            sound.setBuffer( buffer );
            callback(sound);
        }
    }

    // Função de upadate do jogo
	public Update(): void{

		requestAnimationFrame(() => {
			this.Update();
		});
	  
		this.renderer.render( this.scene, this.camera );
		
		this.plt.ready().then( ()=>{
            // Funções no jogo
            if(this.carregouPredios == true && 
                this.carregouCarros == true && 
                this.carregouPessoas == true && 
                this.carregouParadas == true && 
                this.carregouRampas == true &&
                this.carregouMusica == true &&
                this.frst == true
            )
            {   
                this.Loading();
                this.jogando = true;
            }

            if(this.jogando)
            {
                this.MoverComGiroscopio();
                if(!this.vooando)
                {
                    this.ControleFreio();
                }
                this.MoverCenario();
                this.MoverPessoas();
                this.MoverParadas();
                this.Rampa();
                this.EstadoCarro();
                this.MoverCarrosDireita();
                this.MoverCarrosEsquerda();
                this.Imortal(this.tempImortal); 
                this.FimDeJogo();
            }     
            this.DeltaTimer();
		});
        
        //console.log(this.DeltaTime());
        this.time = new Date;//
        this.lastFrameTime = this.time.getTime();
    }

    // Função que retorna velocidade do mundo - Ou seja a velociade do Veiculo/Jogador
    public VelocidadeMundo(): number
    {
        let velocidadeMundo;

        velocidadeMundo = this.velocidadeFrente * this.velBase * this.multFrame;

        return velocidadeMundo;
    }

    // Função para mover os carros da direita - Mão Certa
    public MoverCarrosDireita(): void{
        let i;
        for(i = 0; i < this.nCarrosDireita; i++)
        {
            // Determina as variaveis para respawn
            let pos = Math.floor(Math.random() * 2);
            let delay = Math.floor(Math.random() * (this.delayMax - this.delayMin + 1) ) + this.delayMin;
            
            // Determina a faixa que vai estar
            if (pos == 1)
            {
                pos = this.posLugares[2];
            }
            else
            {
                pos =this.posLugares[3];
            }

            // Move o carro
            this.carrosDireita[i].position.z += this.VelocidadeMundo() - this.velCarrosDireita * 0.02;

            // Faz o respawn
            if(this.carrosDireita[i].position.z >= 1)
            {
                this.carrosDireita[i].position.x = pos;
                this.carrosDireita[i].position.z = -20 - delay;
            }
            
            // Verifica colisão, se bater perde pessoas
            if(this.ColisaoGeral(this.carrosDireita[i], 0.6, 1) && this.imortal == false)
            {
                // Verifica se existe alguem no veiculo
                if(this.atualPessoas != 0)
                {
                    // Perder pessoas
                    this.atualPessoas--;
                    this.nPessoasPerdidas++;
                }
                this.carrosDireita[i].position.x = pos;
                this.carrosDireita[i].position.z = -20 - delay;
                this.nBatidas++;
                this.imortal = true;
            }

            if(this.ColisaoUmComOutro(this.carrosDireita[i], this.rampa, i, 0.8, 0.8))
            {
                this.carsVooando = true;
                this.carsIgini = true;
                this.carsTempIgini = 20;
                this.carsCruGravi = 0;
            }

            //this.EstadoCars(this.carrosDireita[i], i);
            
        }
    }

    // Função para mover os carros da direita - Contra Mão
    public MoverCarrosEsquerda(): void{
        let i;
        for(i = 0; i < this.nCarrosEsquerda; i++)
        {
            // Determina as variaveis para respawn
            let pos = Math.floor(Math.random() * 2);
            let delay = Math.floor(Math.random() * (this.delayMax - this.delayMin + 1) ) + this.delayMin;
            
            // Determina a faixa que vai estar
            if (pos == 1)
            {
                pos = this.posLugares[1];
            }
            else
            {
                pos = this.posLugares[0];
            }

            // Move o carro
            this.carrosEsquerda[i].position.z += this.VelocidadeMundo() - this.velCarrosEsquerda * -0.02;

            // Faz o respawn
            if(this.carrosEsquerda[i].position.z >= 1)
            {
                this.carrosEsquerda[i].position.x = pos;
                this.carrosEsquerda[i].position.z = -20 - delay;
            }
            
            // Verifica colisão, se bater perde pessoas
            if(this.ColisaoGeral(this.carrosEsquerda[i], 0.6, 1) && this.imortal == false)
            {
                // Verifica se existe alguem no veiculo
                if(this.atualPessoas != 0)
                {
                    // Perder pessoas
                    this.atualPessoas--;
                    this.nPessoasPerdidas++;
                }
                this.carrosEsquerda[i].position.x = pos;
                this.carrosEsquerda[i].position.z = -20 - delay;
                this.nBatidas++;
                this.imortal = true;
            }
        }
    }

    // Função para mover predios e contar quilometragem
    public MoverCenario(): void{
    
        let i;
        for(i = 0; i < 20; i++)
        {

            this.predios[i].position.z += this.VelocidadeMundo();

            if(this.predios[i].position.z >= 2.5)
            {
                this.predios[i].position.z = -21.5;
            }
        }

        this.quilometros += this.VelocidadeMundo();
        this.quilometragem = +Number(this.quilometros).toFixed(0);
    }

    // Função de paradas - Move as paradas, descarregas as pessoas e adiciona tempo bonus
    public MoverParadas(): void
    {
        this.parada.position.z += this.VelocidadeMundo();
            
        if(this.parada.position.z >= 1)
        {
            let lado;
            lado = Math.floor(Math.random() * 2);
            if(lado == 0)
            {
                this.parada.position.x = 3.2;
                this.parada.rotation.y = this.PI/2;
            }
            else
            {
                this.parada.position.x = -3.2;
                this.parada.rotation.y = this.angulo * -90;
            }
            let delay = Math.floor(Math.random() * (this.delayMax - this.delayMin + 1) ) + this.delayMin;

            this.parada.position.z = -30 - delay * 2;
        }
        if(this.ColisaoGeral(this.parada, 1.2, 0.8))
        {
            // Verifica se existe alguem no veiculo
            if(this.atualPessoas != 0)
            {
                // Determinar o lado que vai Spawnar
                let lado;
                lado = Math.floor(Math.random() * 2);
                // Determinar o delay de Spawnar
                let delay = Math.floor(Math.random() * (this.delayMax - this.delayMin + 1) ) + this.delayMin;
                this.parada.position.z = -30 - delay * 2;

                // Descarregar pessoas
                this.nPessoasEntregues += this.atualPessoas;
                this.tempoAux += this.atualPessoas * this.bonusTimer;
                this.atualPessoas = 0;
            }      
        }
    }

    // Função para mover pessoas
    public MoverPessoas(): void
    {
        let i;
        for(i = 0; i < this.nPessoas; i++)
        {
            this.pessoas[i].position.z += this.VelocidadeMundo();
            
            // Saiu fora de camera
            if(this.pessoas[i].position.z >= 1)
            {
                let lado;
                lado = Math.floor(Math.random() * 2);
                if(lado == 0)
                {
                    this.pessoas[i].position.x = 3;
                }
                else
                {
                    this.pessoas[i].position.x = -3;
                }

                let delay = Math.floor(Math.random() * (this.delayMax - this.delayMin + 1) ) + this.delayMin;

                this.pessoas[i].position.z = -30 - delay;
            }

            // Colisao com o passageiro
            if(this.ColisaoGeral(this.pessoas[i], 1.2, 0.4))
            {
                // Pegou o passageiro
                if(this.atualPessoas < this.maxPessoas)
                {
                    let lado;
                    lado = Math.floor(Math.random() * 2);
                    let delay = Math.floor(Math.random() * (this.delayMax - this.delayMin + 1) ) + this.delayMin;
                    this.pessoas[i].position.z = -30 - delay;
    
                    this.atualPessoas++;
                }
            }
            this.AnimarPessoas(i);
        }
    }

    // Função para animar eles
    public AnimarPessoas(nPes: number): void
    {
        if(!this.inverter[nPes])
        {
            this.pessoas[nPes].rotation.z += 0.03;
        }
        else
        {
            this.pessoas[nPes].rotation.z -= 0.03;
        }

        if(this.pessoas[nPes].rotation.z >= 0.2)
        {
            this.pessoas[nPes].rotation.z = 0.2;
            this.inverter[nPes] = true;
        }
        else if(this.pessoas[nPes].rotation.z <= -0.2)
        {
            this.pessoas[nPes].rotation.z = -0.2;
            this.inverter[nPes] = false;
        } 
    }

    // Função da Rampa
    public Rampa(): void
    {

        if(this.rampa.position.z > 1)
        {
            let delay = Math.floor(Math.random() * (this.delayMax - this.delayMin + 1) ) + this.delayMin;

            this.rampa.position.z = -30 - delay;
        }
        //this.rampa.position.z = -3;
        //this.rampa.position.x = 2.5;
        this.rampa.position.z += this.VelocidadeMundo();
        if(this.ColisaoGeral(this.rampa, 1, 1,))
        {
            this.vooando = true;
            this.iguinicao = true;
            this.tempIginicao = 20;
            this.curvaGravidade = 0;
        }
    }

    // Função para a imortalidade
    public Imortal(tempoFrames: number): void
    {
        // Funciona so se tiver com o imortal ativado - Ativa quando bate em um carro
        if(this.imortal)
        {
            // Ifs para fazer o carro piscar - troca de material a cada frame
            if(this.tf % 2 == 0)
            {
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0xF70A0A } )
            }
            else
            {
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0xFAADFF } )
            }

            this.jogador.rotation.y += 0.15

            // Diminui o numero de frames - (serve como um timer em frames)
            this.tf--;
            // Verifica se ja acabou o timer para sair do imortal
            if(this.tf <= 0)
            {
                    this.imortal = false;
                    this.jogador.material = new THREE.MeshLambertMaterial( { color: 0xF70A0A } )
            }
        }
        else
        {
            // Define o tempoFrames para auxiliar tf para contar os frames/tempo
            this.tf = tempoFrames;
        }

    }

    // Colisão Gereal, retorna boolean para se colidiu
    public ColisaoGeral(objeto: THREE.Mesh, ColX: number, ColZ: number): boolean
    {
        if(!this.vooando)
        {
            if(objeto.position.z <= ColZ &&
                objeto.position.z >= -ColZ &&
                this.jogador.position.x + ColX >= objeto.position.x &&
                this.jogador.position.x - ColX <= objeto.position.x)
            {
                //this.nBatidas++;
                return true
            } 
        }
    }

    public ColisaoUmComOutro(Voce: THREE.Mesh, Outro: THREE.Mesh, nCars: number, ColX: number, ColZ: number): boolean
    {
        if(!this.carsVooando[nCars])
        {
            if(Voce.position.z <= Outro.position.z + ColZ &&
                Voce.position.z >= Outro.position.z - ColZ &&
                Outro.position.x + ColX >= Voce.position.x &&
                Outro.position.x - ColX <= Voce.position.x)
            {
                return true
            } 
        }
    }
    
    // Testar Colisão, cria tabela verdade de posição - Função para Debug
    public TestarColisao(objeto: THREE.Mesh, ColX: number, ColZ: number): void
    {
        if(objeto.position.z <= ColZ)
            this.teste1 = 1;
        else
            this.teste1 = 0;

        if(objeto.position.z >= -ColZ)
            this.teste2 = 1;
        else
            this.teste2 = 0;

        if(this.jogador.position.x + ColX >= objeto.position.x)
            this.teste3 = 1;
        else
            this.teste3 = 0;

        if(this.jogador.position.x - ColX <= objeto.position.x)
            this.teste4 = 1;
        else
            this.teste4 = 0;

    }

    // Função de giroscopio - Move o jogador
    public MoverComGiroscopio(): void{
        
        // Variaveis para criar um "map" para suavizar os valores
        let OldRange; 
        let NewRange; 
        let NewValue;

        // "Função" onde ocorre o acelerometro
        var subscription = this.deviceMotion.watchAcceleration().subscribe((acceleration: DeviceMotionAccelerationData) => 
        {
            OldRange = (9 - 0.5);
            NewRange = (0.1 - 0.02);

            if(acceleration.y > 0.5)
            {
                NewValue = (((acceleration.y - 0.5) * NewRange) / OldRange) + 0.02;
                if(this.jogador.position.x < 2.5)
                {
                    this.jogador.position.x += this.velocidadeHorizontal * NewValue;
                }
                else
                {
                    this.jogador.position.x = 2.5;
                    NewValue = 0;
                }
                if(!this.imortal)
                {
                    this.jogador.rotation.y = - this.angulo * 180 - NewValue * 10;
                    this.jogador.rotation.z = NewValue * 5;
                }
			}
            else if(acceleration.y < -0.5)
            {
                NewValue = (((acceleration.y * -1 - 0.5) * NewRange) / OldRange) + 0.02;
                if(this.jogador.position.x > -2.5)
                {
                    this.jogador.position.x -= this.velocidadeHorizontal * NewValue;
                }
                else
                {
                    this.jogador.position.x = -2.5;
                    NewValue = 0;
                }
                if(!this.imortal)
                {
                    this.jogador.rotation.y = this.angulo * 180 + NewValue * 10;
                    this.jogador.rotation.z = -NewValue * 5;
                }
            }
            else
            {
                if(!this.imortal)
                {
                    this.jogador.rotation.y = this.angulo * 180;
                    this.jogador.rotation.z = 0;
                }
            }
        });
        
        subscription.unsubscribe();
    }

    // Troca de veiculo no jogo - Função para Debug
    public TrocarVeiculo(): void{
        this.configs.isCar = !this.configs.isCar;

        if(this.configs.isCar)
        {
            // Carro
            this.maxPessoas = 4;
            this.velBase = 1;
        }
        else
        {
            // Onibus
            this.maxPessoas = 20;
            this.velBase = 0.8;
        }
        
    }

    // Timer, n to usando até
    public Timer()
    {
        //A FUNÇÃO GET TIME PEGA O TEMPO DE QUANDO O OBJ É INSTANCIADO
		//ENTÃO TEM Q REINSTANCIAR TODO CICLO
		this.time = new Date();
		//CALCULA A VARIAÇÃO DE TEMPO DO INSTANTE INICIAL ATÉ AGR
		let delta: number = (this.time.getTime() - this.startTime) / 1000;
        if(this.jogando)
        
        
		this.currentTime = +Number(delta).toFixed(0);
        console.log(this.currentTime);

    }

    // Timer do jogo - descobre o deltatime e diminui de um tempo existente
    public DeltaTimer():void
    {
        // Pega o tempo do frame, mas devido a logica do codigo funciona como o tempo do ultimo frame
        this.tempo1 = this.time.getTime();
        
        let aux

        // Subrai dois tempos pegos em momentos diferentes do jogo, não é perfeito mas funciona
        aux = (this.tempo1 - this.tempo2) / 1000;

        // Pega o tempo do ultimo frame do jogo
        this.tempo2 = this.time.getTime();

        // Se o jogo esta rolando ele calcula o tempo sem atrapalhar o delta;
        if(this.jogando)
        {
            // Verifica se é o primeiro frame (frst) ou se não
            if(!this.frst)
            {
                // Depois do primeiro, executa normalmente
                this.tempoAux -= aux;
                this.tempoShow = +Number(this.tempoAux).toFixed(0);
            }
            else
            {
                // Primeiro frame arruma uns parametros
                this.tempoAux = this.tempoShow
                this.frst = false;
            }
        }
    }

    // DelataTime, não funiciona bem e ta obsoleto, existem formas melhores
    public DeltaTime(): number{
        this.time = new Date();
        
        this.currentFrameTime = this.time.getTime();
        let delta: number = (this.currentFrameTime - this.lastFrameTime) / 1000;

        return delta;
    }

    // Estado do carro - Se esta voando e coisa e tal
    public EstadoCarro(): void
    {
        if(this.vooando)
        {
            if(this.iguinicao)
            {
                this.jogador.position.y += 2 * 3 * 0.02;
                this.tempIginicao--;
                
                if(this.tempIginicao <= 0)
                {
                    this.iguinicao = false;
                }
            }
            this.jogador.rotation.x += 0.1
        }
        if(this.jogador.position.y > 0)
        {
            this.jogador.position.y -=  this.curvaGravidade + 0.002;
            this.curvaGravidade +=0.001
        }
        else
        {
            this.vooando = false;   
            this.jogador.rotation.x = 0
        }
        
    }

    // Estado dos Carros - Se esta voando e coisa e tal
    public EstadoCars(objeto: THREE.Mesh, nCars: number)
    {
        if(this.carsVooando[nCars])
        {
            if(this.carsIgini[nCars])
            {
                objeto.position.y += 2 * 3 * 0.02;
                this.carsTempIgini[nCars]--;
                
                if(this.carsTempIgini[nCars] <= 0)
                {
                    this.carsIgini[nCars] = false;
                }
            }
            objeto.rotation.x += 0.1;
        }
        else
        {
            this.carsCruGravi[nCars] = 0;
        }
        if(objeto.position.y > 0)
        {
            objeto.position.y -= this.carsCruGravi[nCars] + 0.002;
            this.carsCruGravi[nCars] +=0.001;
        }
        else
        {
            this.carsVooando[nCars] = false;   
            objeto.rotation.x = 0;
        }
    }

    // Freio - Troca o estado do freio
    public Freio(): void
    {
        // Troca se freia ou acelera
        this.freio = !this.freio;
    }

    // Pausa o jogo - Pausa o jogo ou despausa se ja tiver pausado
    public Pausar(): void
    {
        let botaoPause = document.getElementById("pause")
        if(this.jogando)
        {
            var menuPause = document.getElementById("menuPause")
            this.jogando = !this.jogando;
            menuPause.style.visibility = "visible";
            menuPause.style.pointerEvents = "all";
            //botaoPause.style.background = "url('../assets/BotaoPause.png')"
        }
        else
        {
            //botaoPause.style.backgroundImage = "url('../assets/BotaoPlay.png')";
            this.Continuar();
        }
    }

    // Continua o jogo - Pausa e esconde a tela de pause
    public Continuar(): void
    {
        var menuPaus = document.getElementById("menuPause")
        menuPaus.style.visibility = "hidden";
        menuPaus.style.pointerEvents = "none";
        this.jogando = true;
    }

    // Controle do Freio, determina o comportamento dele
    public ControleFreio(): void
    {
        // Esta freiando
        if(this.freio)
        {
            if(this.velocidadeFrente > 5)
            {
                // Vermelho, esta diminundo a velocidade
                this.velocidadeFrente -= 15 * 0.02;
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0xF70A0A } );
            }
            else
            {
                // Amarelo, velocidade minima
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0xEDF104 } );
                this.velocidadeFrente = 5;
            }
        }
        // Esta acelerando
        else
        {
            if(this.velocidadeFrente < 50)
            {
                // Verde, esta tendo que acelerar
                this.velocidadeFrente += 10 * 0.02;
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0x40FD00 } );
            }
            else
            {
                // Azul, velocidade maxima
                this.velocidadeFrente = 50;
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0x0000FA } );
            }
        }

        // Bug
        // As vezes se deslizar o dedo pode travar e inverter o freio
        // Possiveis soluções
        // 1. Trocar para em vez de uma função de freio para duas
        
    }

    // Tela de loading o jogo - Tela de loading durante o carregamento
    public Loading(): void
    {
        let menuLoading = document.getElementById("telaLoading")
        menuLoading.style.visibility = "hidden";
        menuLoading.style.pointerEvents = "none";

        let infoDir = document.getElementById("infosDireita")
        infoDir.style.visibility = "visible";

        let infoEsq = document.getElementById("infosEsquerda")
        infoEsq.style.visibility = "visible";
    }

    // Função para reniciar
    public Reniciar(): void
    {
        if(this.tempoShow <= 0)
        {
            this.jogando = false;
            location.reload();
        }
    }

    // Testa se é fim de jogo e abre a tela de fim de jogo
    public FimDeJogo(): void
    {
        if(this.tempoShow <= 0)
        {
            let menuFim = document.getElementById("fimDeJogo")
            menuFim.style.visibility = "visible";
            menuFim.style.pointerEvents = "all";
    
            let infoDir = document.getElementById("infosDireita")
            infoDir.style.visibility = "hidden";
    
            let infoEsq = document.getElementById("infosEsquerda")
            infoEsq.style.visibility = "hidden";
        }
    }
}