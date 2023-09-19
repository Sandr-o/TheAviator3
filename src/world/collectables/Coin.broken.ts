import * as THREE from 'three'; // Importing from 'three' instead of 'THREE'
import { COLOR_COINS } from '../../settings';
import { Game } from '../../game';
import { Airplane } from '../airplane/Airplane';
import { World } from '../World'; // Correcting the import path
import { rotateAroundSea, spawnParticles, addCoin } from '../../utils/utils'; // Importing missing functions
import { AudioManager } from '../../manager/AudioManager';
import { SceneManager } from '../../manager/SceneManager';

//region Coins
class Coin {
  mesh: THREE.Mesh;
  angle: number;
  dist: number;
  world: World;
  audioManager: AudioManager;
  sceneManager: SceneManager;

  constructor(private game: Game) {
    var geom = new THREE.CylinderGeometry(4, 4, 1, 10);
    var mat = new THREE.MeshPhongMaterial({
      color: COLOR_COINS,
      shininess: 1,
      specular: 0xffffff,
      flatShading: true,
    });
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;
    this.game.sceneManager.add(this);
    this.world = game.world;
    this.audioManager = game.audioManager;
    this.sceneManager = game.sceneManager;
  }

  tick(deltaTime: number, airplane: Airplane, world: World) {
    rotateAroundSea(this, deltaTime, world.coinsSpeed);

    this.mesh.rotation.z += Math.random() * 0.1;
    this.mesh.rotation.y += Math.random() * 0.1;

    // collision?
    if (utils.collide(airplane.mesh, this.mesh, world.coinDistanceTolerance)) {
      spawnParticles(this.mesh.position.clone(), 5, COLOR_COINS, 0.8);
      addCoin(); // Assuming addCoin is a valid function in your code
      this.audioManager.play('coin', { volume: 0.5 });
      this.sceneManager.remove(this);
    }
    // passed-by?
    else if (this.angle > Math.PI) {
      this.sceneManager.remove(this);
    }
  }
}

function spawnCoins() {
  const nCoins = 1 + Math.floor(Math.random() * 10);
  const d =
    this.world.seaRadius +
    this.world.planeDefaultHeight +
    utils.randomFromRange(-1, 1) * (this.world.planeAmpHeight - 20);
  const amplitude = 10 + Math.round(Math.random() * 10);
  for (let i = 0; i < nCoins; i++) {
    const coin = new Coin(this.game); // Passing 'game' to the Coin constructor
    coin.angle = -(i * 0.02);
    coin.dist = d + Math.cos(i * 0.5) * amplitude; // Correcting 'this.coin.distance' to 'coin.dist'
    coin.mesh.position.y = -this.world.seaRadius + Math.sin(coin.angle) * coin.dist;
    coin.mesh.position.x = Math.cos(coin.angle) * coin.dist;
  }
  this.game.statistics.coinsSpawned += nCoins;
}
