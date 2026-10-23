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
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { AdvancedDynamicTexture, Control, TextBlock } from "@babylonjs/gui";


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
let score = 99;
let time = 30;
const bonustime = 10;
const spawntime = 3000;


const createScene = () => {
    const scene = new Scene(engine);


    const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);


    const scoreText = new TextBlock();

    scoreText.text = "Score:" + score + "\nTime:" + time + "s";
    scoreText.color = "green";
    scoreText.fontSize = 32;
    scoreText.width = "300px";
    scoreText.height = "200px";
    scoreText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    scoreText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    scoreText.left = "20px";
    scoreText.top = "20px";
    ui.addControl(scoreText);


    //glow https://doc.babylonjs.com/features/featuresDeepDive/mesh/glowLayer/
    const gl = new GlowLayer("glow", scene);

    const glowMaterial = new StandardMaterial("glow", scene);
    glowMaterial.diffuseColor = new Color3(5, 5, 255);
    glowMaterial.emissiveColor = new Color3(0, 0, 255);

    let lightintensity = 100;


    //based on https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction/
    const hemilight = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
    hemilight.intensity = lightintensity/100;

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
    const groundTex = new Texture("https://assets.babylonjs.com/textures/amiga.jpg", scene);
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
    let gameOverActive = false;

    const collectibleMat = new StandardMaterial("collectibleMat", scene);
    collectibleMat.reflectionTexture = CubeTexture.CreateFromPrefilteredData(
        "textures/textures/Studio_Softbox_2Umbrellas_cube_specular.env",
        scene
    );


    const addCollectiblePhysics = (collectible) => {
        if (collectible.physicsBody) return;

        new PhysicsAggregate(collectible, PhysicsShapeType.BOX, {
            mass: 10,
            restitution: 0.2,
            friction: 10,
        }, scene);
        collectible.material = glowMaterial;

        collectible.physicsBody.disablePreStep = true;


    };

    // https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function gameover(){
        if (gameOverActive) return;

        gameOverActive = true;
        clearInterval(interval);
        clearInterval(timer);
        scoreText.text = "GAME OVER\nScore:" + score;

        if (ball.physicsBody) {
            ball.physicsBody.setLinearVelocity(Vector3.Zero());
        }
    }

    //spawning logic
    let i = 0;
    const interval = setInterval(() => {
        i++;
        const collectible = MeshBuilder.CreateBox(`collect-${i}`, {size: 1}, scene);
        collectible.position.set(getRandomInt(-70, 70), 30, getRandomInt(-70, 70));
        collectibles.push(collectible);
        if (physicsReady && groundReady) addCollectiblePhysics(collectible);

    }, spawntime)

    //spawning logic
    const timer = setInterval(() => {
        time--;
        scoreText.text = "Score:" + score + "\nTime:" + time + "s";

        if (time <= 0){
            gameover();
        }

    }, 1000)

    //jumpscare


        function playjumpscare(){
            if (gameOverActive) return;

            gameOverActive = true;
            clearInterval(interval);
            clearInterval(timer);
            scoreText.text = "";

            if (ball.physicsBody) {
                ball.physicsBody.setLinearVelocity(Vector3.Zero());
            }

            const animation = document.createElement("img");
            animation.src = "/animation.gif";
            animation.alt = "Game complete";
            animation.style.position = "fixed";
            animation.style.inset = "0";
            animation.style.width = "100vw";
            animation.style.height = "100vh";
            animation.style.objectFit = "cover";
            animation.style.zIndex = "9999";
            animation.style.pointerEvents = "none";

            document.body.appendChild(animation);
            const jumpscaresfx = new Audio("/animationsfx.gif");
            jumpscaresfx.play().catch((err) => {
                console.log(err);
            })
        }







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
        ball.physicsBody.setLinearDamping(0.35);






        new PhysicsAggregate(largeGround, PhysicsShapeType.MESH, {
            mass: 0,
            friction: 0.05,
        }, scene);

        collectibles.forEach(addCollectiblePhysics);

        //adding walls like the skybox pretty much

        const halfSkybox = 75;
        const wallThickness = 3;
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

        ball.physicsBody.setCollisionCallbackEnabled(true);
         ball.physicsBody.getCollisionObservable().add((event) => {
                const otherBody =
                     event.collider === ball.physicsBody
                             ? event.collidedAgainst
                                : event.collider;

              const otherMesh = otherBody.transformNode;

                 if (!otherMesh.name.startsWith("collect-")) {
                         return;
                     }

               // This was a collectible collision.
                const collectibleIndex = collectibles.indexOf(otherMesh);
                if (collectibleIndex === -1) {
                    return;
                }

                collectibles.splice(collectibleIndex, 1);
                otherMesh.dispose();
                //spoopy
                 lightintensity -= 1;
                 hemilight.intensity = lightintensity/100;
                 sun.intensity = lightintensity/100;

                 score++;
                 time += bonustime;
                 scoreText.text = "Score:" + score + "\nTime:" + time + "s";
                 console.log("intensity:", lightintensity);
                 console.log("Collected:", otherMesh.name);
                 console.log("score:", score);
                 console.log("time:", time);

                 //game clear
                 if (score > 99){

                     playjumpscare();
                 }


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
    sun.intensity = lightintensity/100;
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
    const driveForce = 80;
    const maxDriveSpeed = 35;
    window.addEventListener("keydown", (e) => (keys[e.code] = true));
    window.addEventListener("keyup", (e) => (keys[e.code] = false));

    scene.onBeforeRenderObservable.add(() => {
        sun.position = ball.position.subtract(sun.direction.normalizeToNew().scale(20));
        if (gameOverActive) return;

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
            body.applyForce(input.normalize().scale(driveForce), ball.position);
        }

        const velocity = body.getLinearVelocity();
        const horizontalVelocity = new Vector3(velocity.x, 0, velocity.z);
        if (horizontalVelocity.length() > maxDriveSpeed) {
            horizontalVelocity.normalize().scaleInPlace(maxDriveSpeed);
            body.setLinearVelocity(new Vector3(
                horizontalVelocity.x,
                velocity.y,
                horizontalVelocity.z
            ));
        }
    });

        return scene;
};

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());