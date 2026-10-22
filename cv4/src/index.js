import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import HavokPhysics from "@babylonjs/havok";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";

import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Culling/ray";
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent";
import "@babylonjs/core/Physics/v2/physicsEngineComponent";

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Materials/PBR/pbrMaterial";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";


const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);


const createScene = () => {
    const scene = new Scene(engine);

    //based on https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction/
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


    //based on https://doc.babylonjs.com/features/introductionToFeatures/chap2/material/
    const groundTex = new Texture("https://assets.babylonjs.com/textures/albedo.png", scene);
    //added texture scaling
    groundTex.uScale = 20;
    groundTex.vScale = 20;

    const groundMat = new StandardMaterial("groundMat", scene);
    //ground mat is the material of the ground, scaled texture is applied
    groundMat.diffuseTexture = groundTex;


    const ballMat = new StandardMaterial("ballMat", scene);
    ballMat.reflectionTexture = CubeTexture.CreateFromPrefilteredData(
        "textures/Studio_Softbox_2Umbrellas_cube_specular.env",
        scene
    );

    const ball = MeshBuilder.CreateSphere("ball", {}, scene);
    ball.position.set(0, 15, 0);
    ball.material = ballMat;


    const collectibles = [];

    const addCollectiblePhysics = (collectible) => {
        if (collectible.physicsBody) return;

        new PhysicsAggregate(collectible, PhysicsShapeType.BOX, {
            mass: 10,
            restitution: 0.2,
            friction: 10,
        }, scene);
        collectible.physicsBody.disablePreStep = true;


    };

    // https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    //spawning logic
    let i = 0;
    const interval = setInterval(() => {
        i++;
        const collectible = MeshBuilder.CreateBox(`collect-${i}`, {size: 5}, scene);
        collectible.position.set(getRandomInt(0, 150), 30, getRandomInt(0, 150));
        collectibles.push(collectible);
        if (physicsReady && groundReady) addCollectiblePhysics(collectible);

    }, 1000)



    let physicsReady = false;
    let groundReady = false;
    let physicsBodiesCreated = false;


    const createPhysicsBodies = () => {
        if (!physicsReady || !groundReady || physicsBodiesCreated) return;
        physicsBodiesCreated = true;
        new PhysicsAggregate(ball, PhysicsShapeType.SPHERE, {
            mass: 5,
            restitution: 0.2,
            friction: 0.05,
        }, scene);
        ball.physicsBody.disablePreStep = true;




        new PhysicsAggregate(largeGround, PhysicsShapeType.MESH, {
            mass: 0,
            friction: 0.05,
        }, scene);

        collectibles.forEach(addCollectiblePhysics);

        //adding walls like the skybox pretty much

        const halfSkybox = 75;
        const wallThickness = 2;
        const walls = [
            { width: wallThickness, height: 150, depth: 150, x: halfSkybox, y: 0, z: 0 },
            { width: wallThickness, height: 150, depth: 150, x: -halfSkybox, y: 0, z: 0 },
            { width: 150, height: 150, depth: wallThickness, x: 0, y: 0, z: halfSkybox },
            { width: 150, height: 150, depth: wallThickness, x: 0, y: 0, z: -halfSkybox },
            { width: 150, height: wallThickness, depth: 150, x: 0, y: halfSkybox, z: 0 },
        ];

        walls.forEach((dimensions, index) => {
            const wall = MeshBuilder.CreateBox(`skyboxCollider${index}`, dimensions, scene);
            wall.position.set(dimensions.x, dimensions.y, dimensions.z);
            wall.isVisible = false;
            new PhysicsAggregate(wall, PhysicsShapeType.BOX, { mass: 0 }, scene);
        });
    };
    //changed from https://doc.babylonjs.com/features/introductionToFeatures/chap2/material/ because I needed to use Havoc, which is the physics thing
    const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", {
        width: 150,
        height: 150,
        subdivisions: 20,
        minHeight: 0,
        maxHeight: 10,
        onReady: () => {
            groundReady = true;
            createPhysicsBodies();
        },
    }, scene);
    largeGround.material = groundMat;


    //one to one coppied from https://doc.babylonjs.com/features/featuresDeepDive/physics/usingPhysicsEngine/ with changed names I don't get it I just changed the numbers
    //this should just initialise physics though
    HavokPhysics().then((havok) => {
        scene.enablePhysics(new Vector3(0, -40, 0), new HavokPlugin(true, havok));
        physicsReady = true;
        createPhysicsBodies();
    }).catch((error) => {
        console.error("Failed to initialize Havok physics:", error);
    });

    //stolen from https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction/ also 1:1 very simple
    const sun = new DirectionalLight("sun", new Vector3(-1, -2, -1), scene);
    sun.intensity = 0.5;
    sun.shadowFrustumSize = 30;

    const shadowGenerator = new ShadowGenerator(2048, sun);
    shadowGenerator.addShadowCaster(ball);
    shadowGenerator.usePercentageCloserFiltering = true;

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
    camera.upperBetaLimit = Math.PI / 2 - 0.05;
    camera.attachControl(canvas, true);

    scene.createDefaultEnvironment({
        createGround: false,
        createSkybox: true,
    });

    //wasd movement generated by claude sonet 5.5, I did not find documentation :(
    const keys = {};
    window.addEventListener("keydown", (e) => (keys[e.code] = true));
    window.addEventListener("keyup", (e) => (keys[e.code] = false));

    scene.onBeforeRenderObservable.add(() => {
        sun.position = ball.position.subtract(sun.direction.normalizeToNew().scale(20));
        const body = ball.physicsBody;
        if (!body) return;

        const forward = camera.getForwardRay().direction.clone();
        forward.y = 0;
        if (forward.lengthSquared() === 0) return;
        forward.normalize();

        const right = Vector3.Cross(forward, Vector3.Up()).normalize();
        const input = forward.scale(
            (keys["KeyW"] ? 1 : 0) - (keys["KeyS"] ? 1 : 0)
        ).addInPlace(right.scale(
            (keys["KeyA"] ? 1 : 0) - (keys["KeyD"] ? 1 : 0)
        ));
        if (input.lengthSquared() > 0) {
            input.normalize().scaleInPlace(10);
            const velocity = body.getLinearVelocity();
            body.setLinearVelocity(new Vector3(input.x, velocity.y, input.z));
        }
    });

        return scene;
};

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());