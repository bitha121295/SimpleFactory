// PARQUE 3D CON Simple Factory
//Nombre: Alas Guzman Damaris
var loadingManager = null;//objeto de la clase   LoadingManager que da seguimiento a el cargado de recursos

function ParkeFactory(tipo){//declarando funcion parkefactory pasando el paramtero tipo
	var objeto;//declarando objeto
	if (tipo == 1) {//si le paso al parametro tipo la opcion 1 entonces el objeto retornara la nueva escena
		objeto= new ParkeFactory();
		return objeto.escena();
		}
    if (tipo == 2) {// cuando le paso el parametro con opcion 2
		objeto= new ParkeFactory(); //llama a la varible objeto la cual retorna  a la camara 
		return objeto.camara();
		}	
	if (tipo == 3) {
		objeto= new ParkeFactory();
		return objeto.LoadingManager();//me retorna la carga de recursos
		}	
    if (tipo == 4) {
		objeto= new ParkeFactory();
		return objeto.LuzAmbiental();//retornando la luz ambiental para la carga del objeto parkefactory
		}		
	if (tipo == 5) {
		objeto= new ParkeFactory();
		return objeto.Luz();//retornando la luz
		}			
	if (tipo == 6) {
		objeto= new ParkeFactory();
		return objeto.Caja();//retornando la caja
		}	
	if (tipo == 7) {
		objeto= new ParkeFactory();
		return objeto.Renderer();
		}							
	this.escena = function(tipo) {//metodo escena que pasa el parametro tipo en la  funcion
		return new THREE.Scene();//retornando la libreria three escena
        }
   
	this.camara = function(tipo) {
		return new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);//retornando la libreria three con la perspectiva de la cmara
	
        }    
    this.LoadingManager = function(tipo) {
		return new THREE.LoadingManager()
	
        }  
    this.LuzAmbiental = function(tipo)   { 
		return new THREE.AmbientLight(0xffffff, 0.2);// el color de esta luz se aplica a todo los objetos (color,intensidad) en el mundo	    
	}
	this.Luz = function(tipo)     {
		return new THREE.PointLight( 0xddffdd, 1.0);//Afecta a los objetos utilizando MeshLambertMaterial o MeshPhongMaterial.(color,intensidad,distancia)

		}
	this.Caja = function(tipo)   {
		return new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5),new THREE.MeshBasicMaterial({ color:0xFFCC00 }));//creando el cubito que aparece antes de crear el parque
		}	
	this.Renderer = function(tipo)   {
		return new THREE.WebGLRenderer();//instancia que sirve para procesar y dibujar en la pantalla por medio de WebGL
		}		
}

var scene = new ParkeFactory(1);//definiendo la escena 3d para crear parque con su factoria
var camera = new ParkeFactory(2);//definiendo la camara para la perspectiva3d
var loadingManager =  new ParkeFactory(3);//defininendo el cargado de los datos
var ambientLight  =  new ParkeFactory(4);//definiendo la luzambiental del parque
var light = new ParkeFactory(5);//luz oscura para el parque 
var box = new ParkeFactory(6);//creando el cubito que aparecera antes de cargar el parque
var renderer = new ParkeFactory(7);//creando el renderizador para el ParqueFactory
var  mesh; //declarando al mesh

var keyboard = {};
var parque = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;//activa el algoritmo de renderizado tipo wireframe, el cual activa mostrar solo aristas del modelo

//**************************************************************************
var loadingScreen = {scene,camera,box};//cargando pantalla 
var RESOURCES_LOADED = false;//bandera que indica si se cargaron todos los recursos
//*****************************************************************************
function init(){

	loadingScreen.box.position.set(0,0,5);//aplica cordenadas de posicion de la caja  en la scena llamada loadingScreen
	loadingScreen.camera.lookAt(loadingScreen.box.position);//la camara observa en dirección a la caja
	loadingScreen.scene.add(loadingScreen.box);//agrega la caja a la scena
	
	loadingManager.onProgress = function(item, loaded, total){//Se llamará mientras que la carga progresa
		console.log(item, loaded, total);//llamando a que muestre loaled total y item
	};
	
	loadingManager.onLoad = function(){//se ejecuta cuando se han cargado los recursos
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
	};
	
	scene.add(ambientLight);//se agrega a la scene
	
	light.position.set(-2,15,9);//posicion de la luz -3,6,-3
	light.castShadow = false;//activa sombra
	light.shadow.camera.near = 4;//distancia cercana en la luz
	light.shadow.camera.far = 25;//distancia lejana maxima
	
	scene.add(light);//agrega luz
	
	
//agregando modelo obj 	
	
	var mtlLoader = new THREE.MTLLoader(loadingManager);
	mtlLoader.load("park.mtl", function(materials){//cargando el mtl del parque con su parametro de materiales
		
		materials.preload();
		var objLoader = new THREE.OBJLoader(loadingManager);//cargando el objloader con su cargador de recursos
		objLoader.setMaterials(materials);
		
		objLoader.load("park.obj", function(mesh){//cargando el obj jutno con el mesh
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});
		
			scene.add(mesh);
			mesh.position.set(0, 0, 0);
			mesh.rotation.y = Math.PI;
		});
		
	});
	
	
	camera.position.set(0, parque.height, -5);//posiciona la camara en un punto
	camera.lookAt(new THREE.Vector3(0,parque.height,0));//apunta la camara 
	
	renderer.setSize(1280, 720);//tamaño del canvas donde se renderiza

	renderer.shadowMap.enabled = true;//activa sombras
	renderer.shadowMap.type = THREE.BasicShadowMap;//tipo de filtrado de sombras
	
	document.body.appendChild(renderer.domElement);//agraga pantalla en el body de la pagina web
	
	animate();
}

function animate(){

	//*******************************************************************************
	if( RESOURCES_LOADED == false ){//si no se pueden cargar los recursos
		requestAnimationFrame(animate);//permite ejecutar cualquier tipo de animaciçon en el navegador
		
		loadingScreen.box.position.x -= 0.05;//decrementa  la posicion del cubo en la coordenada x  
		if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;//si la posicion del cubo es menr d -10,se pone nuevamente el cubo en x=10
		loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);//efecto senoidal en Y
		
		renderer.render(loadingScreen.scene, loadingScreen.camera);//carga a la tarjeta grafica
		return; // se detiene la funcion
	}
//**********************************************************************************************
	requestAnimationFrame(animate);
/*utilizando las teclas para moverme adntro del entorno 3d con la letra w*/
	if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * parque.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * parque.speed;
	}
	
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * parque.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * parque.speed;
	}
	if(keyboard[65]){ // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * parque.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * parque.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * parque.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * parque.speed;
	}
	
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= parque.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += parque.turnSpeed;
	}
	
	renderer.render(scene, camera);
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);//escucha los eventos, si se presiona una tecla se invoca a la funcion animate()
window.addEventListener('keyup', keyUp);

window.onload = init;

