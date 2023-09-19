import * as THREE from 'three';
import TweenMax from 'gsap';
import {SimpleGun, DoubleGun, BetterGun} from './Guns';
import {Colors} from '../../settings';
import {makeTetrahedron} from '../../utils/utils';
import {Game} from '../../game';
import {GameStatus} from '../../types';
import {utils} from '../../utils/utils.broken';
import { spawnParticles } from '../../utils/utils';

//region Airplane
export class Cabin {
  mesh: THREE.Object3D;

  constructor() {
    var matCabin = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    const frontUR = [40, 25, -25];
    const frontUL = [40, 25, 25];
    const frontLR = [40, -25, -25];
    const frontLL = [40, -25, 25];
    const backUR = [-40, 15, -5];
    const backUL = [-40, 15, 5];
    const backLR = [-40, 5, -5];
    const backLL = [-40, 5, 5];

    const vertices = new Float32Array(
      makeTetrahedron(frontUL, frontUR, frontLL, frontLR)
        .concat(
          // front
          makeTetrahedron(backUL, backUR, backLL, backLR),
        )
        .concat(
          // back
          makeTetrahedron(backUR, backLR, frontUR, frontLR),
        )
        .concat(
          // side
          makeTetrahedron(backUL, backLL, frontUL, frontLL),
        )
        .concat(
          // side
          makeTetrahedron(frontUL, backUL, frontUR, backUR),
        )
        .concat(
          // top
          makeTetrahedron(frontLL, backLL, frontLR, backLR),
        ), // bottom
    );
    const geomCabin = new THREE.BufferGeometry();
    geomCabin.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    var cabin = new THREE.Mesh(geomCabin, matCabin);
    cabin.castShadow = true;
    cabin.receiveShadow = true;

    this.mesh = cabin;
  }
}

class Engine {
  mesh: THREE.Object3D;

  constructor() {
    var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    var matEngine = new THREE.MeshPhongMaterial({color: Colors.white, flatShading: true});
    var engine = new THREE.Mesh(geomEngine, matEngine);

    engine.position.x = 50;
    engine.castShadow = true;
    engine.receiveShadow = true;

    this.mesh = engine;
  }
}

class Tail {
  mesh: THREE.Object3D;

  constructor() {
    var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    var matTailPlane = new THREE.MeshPhongMaterial({color: Colors.red, flatShading: true});
    var tail = new THREE.Mesh(geomTailPlane, matTailPlane);
    var pos = tail.position

    tail.position.set(-40, 20, 0);
    tail.castShadow = true;
    tail.receiveShadow = true;
    this.mesh = tail;
  }
}

class Wings {
  mesh: THREE.Object3D;

  constructor() {
    var geomSideWing = new THREE.BoxGeometry(30, 5, 120, 1, 1, 1);
    var matSideWing = new THREE.MeshPhongMaterial({color: Colors.red, flatShading: true});
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);

    sideWing.position.set(0, 15, 0);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh = sideWing;
  }
}

class Windshield {
  mesh: THREE.Object3D;

  constructor() {
    var geomWindshield = new THREE.BoxGeometry(3, 15, 20, 1, 1, 1);
    var matWindshield = new THREE.MeshPhongMaterial({
      color: Colors.white,
      transparent: true,
      opacity: 0.3,
      flatShading: true,
    });

    var windshield = new THREE.Mesh(geomWindshield, matWindshield);
    windshield.position.set(20, 27, 0);

    windshield.castShadow = true;
    windshield.receiveShadow = true;
    this.mesh = windshield;
  }
}

class Propeller {
  mesh: THREE.Object3D;

  constructor() {
    var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    geomPropeller.attributes.position.array[4 * 3 + 1] -= 5;
    geomPropeller.attributes.position.array[4 * 3 + 2] += 5;
    geomPropeller.attributes.position.array[5 * 3 + 1] -= 5;
    geomPropeller.attributes.position.array[5 * 3 + 2] -= 5;
    geomPropeller.attributes.position.array[6 * 3 + 1] += 5;
    geomPropeller.attributes.position.array[6 * 3 + 2] += 5;
    geomPropeller.attributes.position.array[7 * 3 + 1] += 5;
    geomPropeller.attributes.position.array[7 * 3 + 2] -= 5;
    var matPropeller = new THREE.MeshPhongMaterial({color: Colors.brown, flatShading: true});
    const propeller = new THREE.Mesh(geomPropeller, matPropeller);

    propeller.castShadow = true;
    propeller.receiveShadow = true;

    var geomBlade = new THREE.BoxGeometry(1, 80, 10, 1, 1, 1);
    var matBlade = new THREE.MeshPhongMaterial({color: Colors.brownDark, flatShading: true});
    var blade1 = new THREE.Mesh(geomBlade, matBlade);

    blade1.position.set(8, 0, 0);

    blade1.castShadow = true;
    blade1.receiveShadow = true;

    var blade2 = blade1.clone();
    blade2.rotation.x = Math.PI / 2;

    blade2.castShadow = true;
    blade2.receiveShadow = true;

    propeller.add(blade1);
    propeller.add(blade2);
    propeller.position.set(60, 0, 0);

    this.mesh = propeller;
  }
}

class WheelProtection {
  mesh: THREE.Object3D;

  constructor() {
    var wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
    var wheelProtecMat = new THREE.MeshPhongMaterial({color: Colors.red, flatShading: true});
    this.mesh = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
  }
}

class Wheel {
  mesh: THREE.Object3D;

  constructor() {
    var wheelTireGeom = new THREE.BoxGeometry(24, 24, 4);
    var wheelTireMat = new THREE.MeshPhongMaterial({color: Colors.brownDark, flatShading: true});
    this.mesh = new THREE.Mesh(wheelTireGeom, wheelTireMat);

    var wheelAxisGeom = new THREE.BoxGeometry(10, 10, 6);
    var wheelAxisMat = new THREE.MeshPhongMaterial({color: Colors.brown, flatShading: true});
    var wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat);
    this.mesh.add(wheelAxis);
  }
}

class Suspension {
  mesh: THREE.Object3D;

  constructor() {
    var suspensionGeom = new THREE.BoxGeometry(4, 20, 4);
    suspensionGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 10, 0));
    var suspensionMat = new THREE.MeshPhongMaterial({color: Colors.red, flatShading: true});
    var suspension = new THREE.Mesh(suspensionGeom, suspensionMat);
    suspension.position.set(-35, -5, 0);
    suspension.rotation.z = -0.3;
    this.mesh = suspension;
  }
}

class Pilot {
  mesh: THREE.Object3D;
  angleHairs: number;
  hairsTop: THREE.Object3D;

  constructor(private game: Game) {
    this.mesh = new THREE.Object3D();
    this.angleHairs = 0;

    var bodyGeom = new THREE.BoxGeometry(15, 15, 15);
    var bodyMat = new THREE.MeshPhongMaterial({
      color: Colors.brown,
      flatShading: true,
    });
    var body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(2, -12, 0);
    this.mesh.add(body);

    var faceGeom = new THREE.BoxGeometry(10, 10, 10);
    var faceMat = new THREE.MeshLambertMaterial({color: Colors.pink});
    var face = new THREE.Mesh(faceGeom, faceMat);
    this.mesh.add(face);

    var hairGeom = new THREE.BoxGeometry(4, 4, 4);
    var hairMat = new THREE.MeshLambertMaterial({color: Colors.brown});
    var hair = new THREE.Mesh(hairGeom, hairMat);
    hair.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 2, 0));
    var hairs = new THREE.Object3D();

    this.hairsTop = new THREE.Object3D();

    for (var i = 0; i < 12; i++) {
      var h = hair.clone();
      var col = i % 3;
      var row = Math.floor(i / 3);
      var startPosZ = -4;
      var startPosX = -4;
      h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
      h.geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, 1));
      this.hairsTop.add(h);
    }
    hairs.add(this.hairsTop);

    var hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
    hairSideGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(-6, 0, 0));
    var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
    var hairSideL = hairSideR.clone();
    hairSideR.position.set(8, -2, 6);
    hairSideL.position.set(8, -2, -6);
    hairs.add(hairSideR);
    hairs.add(hairSideL);

    var hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
    var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
    hairBack.position.set(-1, -4, 0);
    hairs.add(hairBack);
    hairs.position.set(-5, 5, 0);

    this.mesh.add(hairs);

    var glassGeom = new THREE.BoxGeometry(5, 5, 5);
    var glassMat = new THREE.MeshLambertMaterial({color: Colors.brown});
    var glassR = new THREE.Mesh(glassGeom, glassMat);
    glassR.position.set(6, 0, 3);
    var glassL = glassR.clone();
    glassL.position.z = -glassR.position.z;

    var glassAGeom = new THREE.BoxGeometry(11, 1, 11);
    var glassA = new THREE.Mesh(glassAGeom, glassMat);
    this.mesh.add(glassR);
    this.mesh.add(glassL);
    this.mesh.add(glassA);

    var earGeom = new THREE.BoxGeometry(2, 3, 2);
    var earL = new THREE.Mesh(earGeom, faceMat);
    earL.position.set(0, 0, -6);
    var earR = earL.clone();
    earR.position.set(0, 0, 6);
    this.mesh.add(earL);
    this.mesh.add(earR);
  }

  updateHairs(deltaTime: number) {
    var hairs = this.hairsTop.children;
    var l = hairs.length;
    for (var i = 0; i < l; i++) {
      var h = hairs[i];
      h.scale.y = 0.75 + Math.cos(this.angleHairs + i / 3) * 0.25;
    }
    this.angleHairs += this.game.state.speed * deltaTime * 40;
  }
}

type Weapon = SimpleGun | DoubleGun | BetterGun;

export class Airplane {
  mesh: THREE.Object3D;
  propeller: THREE.Object3D;
  pilot: Pilot;
  weapon: Weapon;
  lastShot: number;

  constructor(private game: Game) {
    const mesh = new THREE.Object3D();

    // Cabin
    const cabin = new Cabin();
    mesh.add(cabin.mesh);

    // Engine
    const engine = new Engine();
    mesh.add(engine.mesh);

    // Plane Tail
    const tail = new Tail();
    mesh.add(tail.mesh);

    // Wings
    const wings = new Wings();
    mesh.add(wings.mesh);

    // Windshield
    const windshield = new Windshield();
    mesh.add(windshield.mesh);

    // Propeller
    const propeller = new Propeller();
    mesh.add(propeller.mesh);

    // Wheel protection
    const wheelProtecR = new WheelProtection();
    wheelProtecR.mesh.position.set(25, -20, 25);
    mesh.add(wheelProtecR.mesh);

    var wheelProtecL = new WheelProtection();
    wheelProtecL.mesh.position.set(25, -20, -25);
    mesh.add(wheelProtecL.mesh);

    // Wheels
    const wheelR = new Wheel();
    wheelR.mesh.position.set(25, -28, 25);
    mesh.add(wheelR.mesh);

    const wheelL = new Wheel();
    wheelR.mesh.position.set(25, -28, -25);
    mesh.add(wheelL.mesh);

    const wheelBack = new Wheel();
    wheelBack.mesh.scale.set(0.5, 0.5, 0.5);
    wheelBack.mesh.position.set(-35, -5, 0);
    mesh.add(wheelBack.mesh);

    // Suspension
    const suspension = new Suspension();
    mesh.add(suspension.mesh);

    const pilot = new Pilot(game);
    pilot.mesh.position.set(5, 27, 0);
    mesh.add(pilot.mesh);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.mesh = mesh;
    this.propeller = propeller.mesh;
    this.pilot = pilot;
    this.weapon = null;
    this.lastShot = 0;

    mesh.scale.set(0.25, 0.25, 0.25);
    mesh.position.y = this.game.world.worldSettings.planeDefaultHeight;
    this.game.world.scene.add(mesh);
  }

  equipWeapon(weapon: Weapon) {
    if (this.weapon) {
      this.mesh.remove(this.weapon.mesh);
    }
    this.weapon = weapon;
    if (this.weapon) {
      this.mesh.add(this.weapon.mesh);
    }
  }

  shoot() {
    if (!this.weapon) {
      return;
    }

    // rate-limit the shooting
    const nowTime = new Date().getTime() / 1000;
    const ready = nowTime - this.lastShot > this.weapon.downtime();
    if (!ready) {
      return;
    }
    this.lastShot = nowTime;

    // fire the shot
    let direction = new THREE.Vector3(10, 0, 0);
    direction.applyEuler(this.mesh.rotation);
    this.weapon.shoot(direction);

    // recoil airplane
    const recoilForce = this.weapon.damage();
    TweenMax.to(this.mesh.position, {
      duration: 0.05,
      x: this.mesh.position.x - recoilForce,
    });
  }

  tick(deltaTime: number) {
    const worldSettings = this.game.world.worldSettings;

    this.propeller.rotation.x += 0.2 + deltaTime * 0.005;

    if (this.game.state.status === GameStatus.Playing) {
      let targetX = utils.normalize(
        this.game.uiManager.mousePos.x,
        -1,
        1,
        -worldSettings.planeAmpWidth * 0.7,
        -worldSettings.planeAmpWidth,
      );
      let targetY = utils.normalize(
        this.game.uiManager.mousePos.y,
        -0.75,
        0.75,
        worldSettings.planeDefaultHeight - worldSettings.planeAmpHeight,
        worldSettings.planeDefaultHeight + worldSettings.planeAmpHeight,
      );

      this.game.state.planeCollisionDisplacementX += this.game.state.planeCollisionSpeedX;
      targetX += this.game.state.planeCollisionDisplacementX;

      this.game.state.planeCollisionDisplacementY += this.game.state.planeCollisionSpeedY;
      targetY += this.game.state.planeCollisionDisplacementY;

      this.mesh.position.x +=
        (targetX - this.mesh.position.x) * deltaTime * worldSettings.planeMoveSensivity;
      this.mesh.position.y +=
        (targetY - this.mesh.position.y) * deltaTime * worldSettings.planeMoveSensivity;

      this.mesh.rotation.x =
        (this.mesh.position.y - targetY) * deltaTime * worldSettings.planeRotZSensivity;
      this.mesh.rotation.z =
        (targetY - this.mesh.position.y) * deltaTime * worldSettings.planeRotXSensivity;

      const camera = this.game.world.camera;
      if (this.game.state.fpv) {
        camera.position.y = this.mesh.position.y + 20;
        // camera.setRotationFromEuler(new THREE.Euler(-1.490248, -1.4124514, -1.48923231))
        // camera.updateProjectionMatrix ()
      } else {
        camera.fov = utils.normalize(this.game.uiManager.mousePos.x, -30, 1, 40, 80);
        camera.updateProjectionMatrix();
        camera.position.y +=
          (this.mesh.position.y - camera.position.y) * deltaTime * worldSettings.cameraSensivity;
      }
    }

    this.game.state.planeCollisionSpeedX +=
      (0 - this.game.state.planeCollisionSpeedX) * deltaTime * 0.03;
    this.game.state.planeCollisionDisplacementX +=
      (0 - this.game.state.planeCollisionDisplacementX) * deltaTime * 0.01;
    this.game.state.planeCollisionSpeedY +=
      (0 - this.game.state.planeCollisionSpeedY) * deltaTime * 0.03;
    this.game.state.planeCollisionDisplacementY +=
      (0 - this.game.state.planeCollisionDisplacementY) * deltaTime * 0.01;

    this.pilot.updateHairs(deltaTime);
  }

  gethit(position: THREE.Vector3) {
    const diffPos = this.mesh.position.clone().sub(position);
    const d = diffPos.length();
    this.game.state.planeCollisionSpeedX = (100 * diffPos.x) / d;
    this.game.state.planeCollisionSpeedY = (100 * diffPos.y) / d;

    const {ambientLight} = this.game.world.light;
    ambientLight.intensity = 2;
    this.game.audioManager.play('airplane-crash');
  }
}
