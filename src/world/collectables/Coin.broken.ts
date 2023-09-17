import THREE, { Mesh } from 'three';
import {COLOR_COINS} from '../../settings';
import {utils} from '../../utils/utils.broken';
import {Game} from '../../game'
//region Coins
class Coin {
  mesh: Mesh;
  angle: number;
  dist: number;

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
  }

  tick(deltaTime) {
    rotateAroundSea(this, deltaTime, world.coinsSpeed);

    this.mesh.rotation.z += Math.random() * 0.1;
    this.mesh.rotation.y += Math.random() * 0.1;

    // collision?
    if (utils.collide(airplane.mesh, this.mesh, world.coinDistanceTolerance)) {
      spawnParticles(this.mesh.position.clone(), 5, COLOR_COINS, 0.8);
      addCoin();
      audioManager.play('coin', {volume: 0.5});
      sceneManager.remove(this);
    }
    // passed-by?
    else if (this.angle > Math.PI) {
      sceneManager.remove(this);
    }
  }
}

function spawnCoins() {
  const nCoins = 1 + Math.floor(Math.random() * 10);
  const d =
    world.seaRadius +
    world.planeDefaultHeight +
    utils.randomFromRange(-1, 1) * (world.planeAmpHeight - 20);
  const amplitude = 10 + Math.round(Math.random() * 10);
  for (let i = 0; i < nCoins; i++) {
    const coin = new Coin();
    coin.angle = -(i * 0.02);
    coin.distance = d + Math.cos(i * 0.5) * amplitude;
    coin.mesh.position.y = -world.seaRadius + Math.sin(coin.angle) * coin.distance;
    coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
  }
  game.statistics.coinsSpawned += nCoins;
}
