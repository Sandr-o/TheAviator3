import * as THREE from 'three'; // Importing from 'three' instead of 'THREE'
import { COLOR_COLLECTIBLE_BUBBLE } from '../../settings';
import { rotateAroundSea, spawnParticles } from '../../utils/utils';
import { utils } from '../../utils/utils'; // Correcting the import path
import { SimpleGun, BetterGun, DoubleGun } from '../airplane/Guns';
import { Airplane } from '../airplane/Airplane';

//region Collectibles
class Collectible {
  constructor(mesh, onApply) {
    this.angle = 0;
    this.distance = 0;
    this.onApply = onApply;

    this.mesh = new THREE.Object3D();
    const bubble = new THREE.Mesh(
      new THREE.SphereGeometry(10, 100, 100),
      new THREE.MeshPhongMaterial({
        color: COLOR_COLLECTIBLE_BUBBLE,
        transparent: true,
        opacity: 0.4,
        flatShading: true,
      }),
    );
    this.mesh.add(bubble);
    this.mesh.add(mesh);
    this.mesh.castShadow = true;

    this.angle = Math.PI * 2 * 0.1;
    this.distance =
      world.seaRadius +
      world.planeDefaultHeight +
      (-1 + 2 * Math.random()) * (world.planeAmpHeight - 20);
    this.mesh.position.y = -world.seaRadius + Math.sin(this.angle) * this.distance;
    this.mesh.position.x = Math.cos(this.angle) * this.distance;

    sceneManager.add(this);
  }

  tick(deltaTime, world, airplane) {
    rotateAroundSea(this, deltaTime, world.collectiblesSpeed);

    this.mesh.rotation.y += deltaTime * 0.002 * Math.random();
    this.mesh.rotation.z += deltaTime * 0.002 * Math.random();

    if (utils.collide(airplane.mesh, this.mesh, world.collectibleDistanceTolerance)) {
      this.onApply();
      this.explode();
    } else if (this.angle > Math.PI) {
      sceneManager.remove(this);
    }
  }

  explode() {
    spawnParticles(this.mesh.position.clone(), 15, COLOR_COLLECTIBLE_BUBBLE, 3);
    sceneManager.remove(this);
    audioManager.play('bubble');

    const DURATION = 1;

    setTimeout(() => {
      const itemMesh = new THREE.Group();
      for (let i = 1; i < this.mesh.children.length; i += 1) {
        itemMesh.add(this.mesh.children[i]);
      }
      scene.add(itemMesh);
      itemMesh.position.y = 120;
      itemMesh.position.z = 50;

      const initialScale = itemMesh.scale.clone();
      TweenMax.to(itemMesh.scale, {
        duration: DURATION / 2,
        x: initialScale.x * 4,
        y: initialScale.y * 4,
        z: initialScale.z * 4,
        ease: 'Power2.easeInOut',
        onComplete: () => {
          TweenMax.to(itemMesh.scale, {
            duration: DURATION / 2,
            x: 0,
            y: 0,
            z: 0,
            ease: 'Power2.easeInOut',
            onComplete: () => {
              scene.remove(itemMesh);
            },
          });
        },
      });
    }, 200);
  }
}

function spawnCollectible(gunMesh, onApply) {
  const gun = gunMesh.clone();
  gun.scale.set(0.25, 0.25, 0.25);
  gun.position.x = -2;

  new Collectible(gun, onApply);
}

function spawnSimpleGunCollectible() {
  spawnCollectible(SimpleGun.createMesh(), () => {
    this.airplane.equipWeapon(new SimpleGun());
  });
}

function spawnBetterGunCollectible() {
  spawnCollectible(BetterGun.createMesh(), () => {
    this.airplane.equipWeapon(new BetterGun());
  });
}

function spawnDoubleGunCollectible() {
  const guns = new THREE.Group();

  const gun1 = SimpleGun.createMesh();
  gun1.scale.set(0.25, 0.25, 0.25);
  gun1.position.x = -2;
  gun1.position.y = -2;
  guns.add(gun1);

  const gun2 = SimpleGun.createMesh();
  gun2.scale.set(0.25, 0.25, 0.25);
  gun2.position.x = -2;
  gun2.position.y = 2;
  guns.add(gun2);

  spawnCollectible(guns, () => {
    this.airplane.equipWeapon(new DoubleGun());
  });
}

function spawnLifeCollectible() {
  const heart = modelManager.get('heart').clone();
  heart.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material.color.setHex(0xff0000);
    }
  });
  heart.position.set(0, -1, -3);
  heart.scale.set(5, 5, 5);

  spawnCollectible(heart, () => {
    addLife();
  });
}
