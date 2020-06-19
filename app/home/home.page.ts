import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx'
import * as THREE from 'three';
import { getLocaleTimeFormat } from '@angular/common';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { VirtualTimeScheduler } from 'rxjs';
import { createGesture, Gesture } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(private deviceMotion: DeviceMotion, private plt: Platform, private screenOrientation: ScreenOrientation) {	}

    // Tempo
    private time: Date;
	private startTime: number;
    private currentTime: number;
    private lastFrameTime: number;
    private currentFrameTime: number;
    public tempoShow: number;
    private multFrame: number;
    // Configurações do Mundo
	private scene:  THREE.Scene;
	private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    // Configuraçoes de Luzes
	private a_light: THREE.AmbientLight;
    private p_light: THREE.PointLight;
    // Objs
    private cube: THREE.Mesh;
    private jogador: THREE.Mesh;
    private caixas;
    // Configurações de Jogo
    private gameMode: boolean;
    private velocidadeHorizontal: number;
    private velocidadeFrente: number;
    private freio: boolean;
    private jogando: boolean;
    private quilometros: number;
    public quilometragem: number;
    // Configurações de Passageiros
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
    public tipoVeiculo: boolean; // True = Carro || False = Onibus \\
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
    



    ngOnInit()
    {
        // Valores globais
        const PI = 3.14159265359;

        // Seletor de Veiculo
        this.tipoVeiculo = true;
        // Timer
        this.time = new Date();
        this.startTime = this.time.getTime();

        // Orientação
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

        this.CreatScene();

        this.Update();

    }
    
    
    public CreatScene(): void{
        // Definição da Cena
        this.scene = new THREE.Scene();
        
        // Tempo
        this.multFrame = 0.002;

        // Definição de Camera
        this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.z = 5;
        this.camera.position.y = 2;
        this.camera.lookAt(0, 0, 0);
        
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
        this.jogando = true;
        this.quilometragem = 0;
        this.quilometros = 0;
        
        // Definições das pessoas
        this.delayMax = 10;
        this.delayMin = 2;
        this.nPessoas = 5;
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
        if(this.tipoVeiculo)
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

        // Definição de tempo
        this.tempoShow = 0;
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
        this.cube.position.y = -2;
        this.cube.position.x = 5;
        this.cube.position.z = -12;
        this.scene.add(this.cube);

        // Calsada da esquerda
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.position.y = -2;
        this.cube.position.x = -5;
        this.cube.position.z = -12;
        this.scene.add(this.cube);

        // Rua
        material = new THREE.MeshLambertMaterial( { color: 0x80807E } );
        geometry = new THREE.BoxGeometry(10, 0.01, 40)
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.position.y = -2.2;
        this.cube.position.x = 0;
        this.cube.position.z = -12;
        this.scene.add(this.cube);

        //Caixas - Predios
        this.caixas = [];
        let i;
        // Predios da direita
        for(i = 0; i<5; i++)
        {
            let geometry = new THREE.BoxGeometry(2, 3, 4);
            let material = new THREE.MeshLambertMaterial( { color: 0x46484C } );
            let obj = new THREE.Mesh( geometry, material );
            obj.position.x = -4.5;
            obj.position.y = 0;
            obj.position.z = -i * 4 * 1.5;
            this.caixas[i] = obj;
            this.scene.add(this.caixas[i]);
        }
        // Predios da esquerda
        for(i = 5; i< 10; i++)
        {
            let geometry = new THREE.BoxGeometry(2, 3, 4);
            let material = new THREE.MeshLambertMaterial( { color: 0x46484C } );
            let obj = new THREE.Mesh( geometry, material );
            obj.position.x = 4.5;
            obj.position.y = 0;
            obj.position.z = (-i * 4 * 1.5 ) + 30;
            this.caixas[i] = obj;
            this.scene.add(this.caixas[i]);
        }
        
        // Pessoas
        for(i = 0; i < this.nPessoas; i++)
        {
            geometry = new THREE.BoxGeometry(0.3, 0.5, 0.3);
            material = new THREE.MeshLambertMaterial( { color: 0xf717ff } );
            let obj = new THREE.Mesh( geometry, material );
            obj.position.z = -0.1;
            obj.position.y = -1.5;
            obj.position.x = -3;
            this.pessoas[i] = obj
            this.scene.add(this.pessoas[i]);
        }

        // Outros Carros na Rua
        this.carrosDireita = [];
        this.carrosEsquerda = [];

        // Carros da Direita
        let j;
        for(j = 0; j < this.nCarrosDireita; j++)
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
            let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            let material = new THREE.MeshLambertMaterial( { color: 0x7322AB } );
            let obj = new THREE.Mesh( geometry, material );
            obj.position.x = pos;
            obj.position.y = -1.5;
            obj.position.z = -(j + 5) * 4 * 1.5; 
            this.carrosDireita[j] = obj;
            this.scene.add(this.carrosDireita[j]);
        }

        // Carros da Direita
        for(j = 0; j < this.nCarrosEsquerda; j++)
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
            let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            let material = new THREE.MeshLambertMaterial( { color: 0x7322AB } );
            let obj = new THREE.Mesh( geometry, material );
            obj.position.x = pos;
            obj.position.y = -1.5;
            obj.position.z = -(j + 5) * 4 * 1.5; 
            this.carrosEsquerda[j] = obj;
            this.scene.add(this.carrosEsquerda[j]);
        }
        

        // Parada
        geometry = new THREE.BoxGeometry(0.3, 0.7, 1);
    	material = new THREE.MeshLambertMaterial( { color: 0xfffff } );
        this.parada = new THREE.Mesh( geometry, material );
        this.parada.position.z = -0.1;
        this.parada.position.y = -1.5;
        this.parada.position.x = -3.2
        this.scene.add(this.parada);

        // Rampa
        geometry = new THREE.BoxGeometry(1, 1, 1);
    	material = new THREE.MeshLambertMaterial( { color: 0xfffff } );
        this.rampa = new THREE.Mesh( geometry, material );
        this.rampa.position.z = -6;
        this.rampa.position.y = -2.1;
        this.rampa.rotation.x = 59;
        this.scene.add(this.rampa);

        // Jogador
    	geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    	material = new THREE.MeshLambertMaterial( { color: 0xf717ff } );
        this.jogador = new THREE.Mesh( geometry, material );
        this.jogador.position.z = -0.1;
        this.jogador.position.y = -1.5;
        this.scene.add(this.jogador);
        

    }


	public Update(): void{

        

		requestAnimationFrame(() => {
			this.Update();
		});
	  
		this.renderer.render( this.scene, this.camera );
		
		this.plt.ready().then( ()=>{
            // Funções no jogo
            if(this.jogando)
            {
                //this.jogador.rotation.x += 0.05;
                this.MoverComGiroscopio();
                this.MoverCenario();
                if(!this.vooando)
                {
                    this.ControleFreio();
                }
                this.MoverPessoas();
                this.MoverParadas();
                //this.Rampa();
                this.EstadoCarro();
                this.MoverCarrosDireita();
                this.MoverCarrosEsquerda();
                this.Imortal(this.tempImortal);
            }         
		});

        this.Timer();
        
        //console.log(this.DeltaTime());
        //this.time = new Date;
        //this.lastFrameTime = this.time.getTime();
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
            if(this.ColisaoGeral(this.carrosDireita[i], 0.5, 0.5) && this.imortal == false)
            {
                // Verifica se existe alguem no veiculo
                if(this.atualPessoas != 0)
                {
                    // Perder pessoas
                    this.atualPessoas--;
                }
                this.carrosDireita[i].position.x = pos;
                this.carrosDireita[i].position.z = -20 - delay;
                this.nBatidas++;
                this.imortal = true;
            }
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
            if(this.ColisaoGeral(this.carrosEsquerda[i], 0.5, 0.5) && this.imortal == false)
            {
                // Verifica se existe alguem no veiculo
                if(this.atualPessoas != 0)
                {
                    // Perder pessoas
                    this.atualPessoas--;
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
        for(i = 0; i < 10; i++)
        {

            this.caixas[i].position.z += this.VelocidadeMundo();

            if(this.caixas[i].position.z >= 2.5)
            {
                this.caixas[i].position.z = -21.5;
            }
        }

        this.quilometros += this.VelocidadeMundo();
        this.quilometragem = +Number(this.quilometros).toFixed(0);
    }

    // Função de paradas
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
                }
                else
                {
                    this.parada.position.x = -3.2;
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
                    this.tempoShow += this.atualPessoas * 15;
                    this.atualPessoas = 0;
                }
                
            }

            this.TestarColisao(this.parada, 1.2, 0.4);
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
                    this.pessoas[i].position.x = 3
                }
                else
                {
                    this.pessoas[i].position.x = -3
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
        }
    }

    // Função da Rampa
    public Rampa(): void
    {

        if(this.rampa.position.z > 1)
        {
            this.rampa.position.z = -30;
        }
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
        if(this.imortal)
        {
            if(this.tf % 2 == 0)
            {
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0xF70A0A } )
            }
            else
            {
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0xFAADFF } )
            }


            this.tf--;
            if(this.tf <= 0)
            {
                    this.imortal = false;
                    this.jogador.material = new THREE.MeshLambertMaterial( { color: 0xF70A0A } )
            }
        }
        else
        {
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

    // Função de giroscopio
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
                this.jogador.rotation.y = -NewValue * 10;
                this.jogador.rotation.z = -NewValue * 5;
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
                this.jogador.rotation.y = NewValue * 10;
                this.jogador.rotation.z = NewValue * 5;
            }
            else
            {
                this.jogador.rotation.y = 0;
                this.jogador.rotation.z = 0;
            }
        });
        
        subscription.unsubscribe();
    }

    // Troca de veiculo no jogo - Função para Debug
    public TrocarVeiculo(): void{
        this.tipoVeiculo = !this.tipoVeiculo;

        if(this.tipoVeiculo)
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

    public Timer(){
		//A FUNÇÃO GET TIME PEGA O TEMPO DE QUANDO O OBJ É INSTANCIADO
		//ENTÃO TEM Q REINSTANCIAR TODO CICLO
		this.time = new Date();
		//CALCULA A VARIAÇÃO DE TEMPO DO INSTANTE INICIAL ATÉ AGR
		let delta: number = (this.time.getTime() - this.startTime) / 1000;
		//USA O toFixed(0) PRA ARREDONDAR E, JÁ QUE O RETORNO É UMA STRING, COLOCA O + NA FRENTE PRA CONVERTER PARA NUMBER
		this.currentTime = +Number(delta).toFixed(0);
		
    }
    
    DeltaTime(): number{
        this.time = new Date();
        
        this.currentFrameTime = this.time.getTime();
        let delta: number = (this.currentFrameTime - this.lastFrameTime) / 1000;

        return delta;
    }

    // Estado do carro
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
        }
        if(this.jogador.position.y > -1.5)
        {
            this.jogador.position.y -=  this.curvaGravidade + 0.002;
            this.curvaGravidade +=0.001
        }
        else
        {
            this.vooando = false;   
        }
        
    }

    // Freio
    public Freio(): void
    {
        // Troca se freia ou acelera
        this.freio = !this.freio;
    }

    //Pausa o jogo
    public Pausar(): void
    {
        if(this.jogando)
        {
            var menuPause = document.getElementById("menuPause")
            this.jogando = !this.jogando;
            menuPause.style.visibility = "visible";
            menuPause.style.pointerEvents = "all";
        }
        else
        {
            this.Continuar();
        }
    }

    // Continua o jogo
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
    


}




