/*=========================================================
                    SELECT ELEMENTS
=========================================================*/

const canvas = document.getElementById("bgCanvas");

const blueFire = document.querySelector(".fire.blue");
const orangeFire = document.querySelector(".fire.orange");

const logoBox = document.querySelector(".logoBox");

const energyRing = document.querySelector(".energyRing");

/*=========================================================
                    THREE.JS SCENE
=========================================================*/

const scene = new THREE.Scene();

scene.background = null;

/*=========================================================
                    CAMERA
=========================================================*/

const camera = new THREE.PerspectiveCamera(

    45,

    window.innerWidth / window.innerHeight,

    0.1,

    1000

);

camera.position.set(0,0,8);

/*=========================================================
                    RENDERER
=========================================================*/

const renderer = new THREE.WebGLRenderer({

    canvas,

    alpha:true,

    antialias:true

});

renderer.setPixelRatio(

    Math.min(window.devicePixelRatio,2)

);

renderer.setSize(

    window.innerWidth,

    window.innerHeight

);

/*=========================================================
                    LIGHTS
=========================================================*/

const ambientLight = new THREE.AmbientLight(

    0xffffff,

    .8

);

scene.add(ambientLight);

const pointLight = new THREE.PointLight(

    0xffcc66,

    2,

    100

);

pointLight.position.set(

    0,

    0,

    6

);

scene.add(pointLight);

/*=========================================================
                    OPTIONAL HELPERS
=========================================================*/

// const controls = new THREE.OrbitControls(
//     camera,
//     renderer.domElement
// );

/*=========================================================
                    WINDOW RESIZE
=========================================================*/

window.addEventListener(

    "resize",

    ()=>{

        camera.aspect=

            window.innerWidth/

            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

        renderer.setPixelRatio(

            Math.min(window.devicePixelRatio,2)

        );

    }

);

/*=========================================================
                POSITION FLAMES
=========================================================*/

function positionFlames(container){

    const flames=

        container.querySelectorAll("span");

    const radius=205;

    const total=flames.length;

    flames.forEach(

        (flame,index)=>{

            const angle=

                (360/total)*index;

            flame.style.transform=

            `translate(-50%,-50%)
             rotate(${angle}deg)
             translateY(-${radius}px)`;

        }

    );

}

positionFlames(blueFire);

positionFlames(orangeFire);

/*=========================================================
                CAMERA BREATHING
=========================================================*/

let cameraTime=0;

/*=========================================================
                ENERGY RING FLOAT
=========================================================*/

let ringTime=0;

/*=========================================================
                ANIMATION LOOP
=========================================================*/

function animate(){

    requestAnimationFrame(animate);

    cameraTime+=0.01;

    ringTime+=0.015;

    camera.position.z=

        8+

        Math.sin(cameraTime)*0.15;

    camera.position.x=

        Math.sin(cameraTime*.4)*0.08;

    camera.position.y=

        Math.cos(cameraTime*.35)*0.05;

    camera.lookAt(

        scene.position

    );

    logoBox.style.transform=

    `translateY(${
        Math.sin(ringTime)*8
    }px)
     rotate(${
        Math.sin(ringTime*.5)*1.2
    }deg)`;

    energyRing.style.transform=

    `rotate(${
        ringTime*15
    }deg)`;

    pointLight.intensity=

        2+

        Math.sin(cameraTime*2)*0.4;

    renderer.render(

        scene,

        camera

    );

}

animate();