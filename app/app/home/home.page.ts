import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx'
import * as THREE from 'three';
import { getLocaleTimeFormat } from '@angular/common';


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
    // Informações do veiculo
    private maxPessoas: number;
    private atualPessoas: number;

    ngOnInit()
    {
        //Valores globais
        const PI = 3.14159265359;

        //Timer
        this.time = new Date();
        this.startTime = this.time.getTime();

        //Orientação
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

        this.CreatScene();

        this.Update();

    }
    
    
    public CreatScene(): void{
        // Definição da Cena
        this.scene = new THREE.Scene();

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

        // Definições do veiculo
        this.atualPessoas = 0;

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
        this.cube.position.x = 5
        this.cube.position.z = -12
        this.scene.add(this.cube);

        // Calsada da esquerda
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.position.y = -2;
        this.cube.position.x = -5
        this.cube.position.z = -12
        this.scene.add(this.cube);

        // Rua
        material = new THREE.MeshLambertMaterial( { color: 0x80807E } );
        geometry = new THREE.BoxGeometry(10, 0.01, 40)
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.position.y = -2.5;
        this.cube.position.x = 0
        this.cube.position.z = -12
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
        
        

        
        // Jogador
    	geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    	material = new THREE.MeshLambertMaterial( { color: 0xf717ff } );
        this.jogador = new THREE.Mesh( geometry, material );
        this.jogador.position.z = -1;
        this.jogador.position.y = -2;
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
                this.ControleFreio();
            }         
		});

        this.Timer();
        
        //console.log(this.DeltaTime());
        //this.time = new Date;
        //this.lastFrameTime = this.time.getTime();
    }	
    
    public MoverCenario(): void{
    
        let i;
        for(i = 0; i < 10; i++)
        {

            this.caixas[i].position.z += this.velocidadeFrente * 0.002;

            if(this.caixas[i].position.z >= 2.5)
            {
                this.caixas[i].position.z = -21.5;
            }
        }

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
                if(this.jogador.position.x < 2)
                {
                    this.jogador.position.x += this.velocidadeHorizontal * NewValue;
                }
                else
                {
                    this.jogador.position.x = 2;
                }
                this.jogador.rotation.y = -NewValue * 10;
                this.jogador.rotation.z = -NewValue * 5;
			}
            else if(acceleration.y < -0.5)
            {
                NewValue = (((acceleration.y * -1 - 0.5) * NewRange) / OldRange) + 0.02;
                if(this.jogador.position.x > -2)
                {
                    this.jogador.position.x -= this.velocidadeHorizontal * NewValue;
                }
                else
                {
                    this.jogador.position.x = -2;
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

    




    // Freio
    public Freio(): void
    {
        // Troca se freia ou acelera
        this.freio = !this.freio;
    }

    //Pausa o jogo
    public Pausar(): void
    {
        this.jogando = !this.jogando;
    }
    // Continua o jogo
    public Continuar(): void
    {
        this.jogando = true;
    }
    




    public ControleFreio(): void
    {
        // Esta freiando
        if(this.freio)
        {
            if(this.velocidadeFrente > 5)
            {
                // Vermelho, esta diminundo a velocidade
                this.velocidadeFrente -= 15 * 0.02;
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0xF70A0A } )
            }
            else
            {
                // Amarelo, velocidade minima
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0xEDF104 } )
                this.velocidadeFrente = 5
            }
        }
        // Esta acelerando
        else
        {
            if(this.velocidadeFrente < 50)
            {
                // Verde, esta tendo que acelerar
                this.velocidadeFrente += 10 * 0.02;
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0x40FD00 } )
            }
            else
            {
                // Azul, velocidade maxima
                this.velocidadeFrente = 50;
                this.jogador.material = new THREE.MeshLambertMaterial( { color: 0x0000FA } )
            }
        }

        // Bug
        // As vezes se deslizar o dedo pode travar e inverter o freio
        // Possiveis soluções
        // 1. Trocar para em vez de uma função de freio para duas
        
    }
    


}




