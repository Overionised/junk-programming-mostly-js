import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { Animation } from "@babylonjs/core/Animations/animation";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";


import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Materials/PBR/pbrMaterial";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";


const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);


const createScene = () => {
    const scene = new Scene(engine);

    new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
    new DirectionalLight("DirectionalLight", new Vector3(-1, -1, 0), scene);

    //skybox from: "https://doc.babylonjs.com/features/introductionToFeatures/chap5/sky/"
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;


    const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png" /* url to height map */, { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 });
    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new Color3(0, 0.5, 0.5);
    largeGround.material = groundMat;

    const ball = MeshBuilder.CreateSphere("ball", {}, scene);
    ball.position.y = 0.5;

    const sun = new DirectionalLight("sun", new Vector3(-1, -2, -1), scene);
    sun.intensity = 0.8;
    sun.shadowFrustumSize = 30; // shadow area in world units, instead of the whole 100 km ground

    const shadowGenerator = new ShadowGenerator(2048, sun);
    shadowGenerator.addShadowCaster(ball);
    shadowGenerator.usePercentageCloserFiltering = true; // softer edges

    largeGround.receiveShadows = true;

    const camera = new ArcRotateCamera(
        "followCam",
        -Math.PI / 2,
        Math.PI / 3,
        8,
        ball.position,
        scene
    );
    camera.lockedTarget = ball;
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 20;
    camera.upperBetaLimit = Math.PI / 2 - 0.05; // don't go below the ground
    camera.attachControl(canvas, true);

    scene.createDefaultEnvironment({
        createGround: false,   // you already have a ground
        createSkybox: true,
    });

    // WASD movement so there's something to follow
    const keys = {};
    window.addEventListener("keydown", (e) => (keys[e.code] = true));
    window.addEventListener("keyup", (e) => (keys[e.code] = false));

    scene.onBeforeRenderObservable.add(() => {
        sun.position = ball.position.subtract(sun.direction.normalizeToNew().scale(20));
        const step = 10 * (engine.getDeltaTime() / 1000);
        if (keys["KeyW"]) ball.position.z += step;
        if (keys["KeyS"]) ball.position.z -= step;
        if (keys["KeyA"]) ball.position.x -= step;
        if (keys["KeyD"]) ball.position.x += step;
    });

    return scene;
};

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());