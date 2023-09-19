import {Colors} from '../../settings';
import {utils} from '../../utils/utils.broken';
import {Game} from '../../game';
import {rotateAroundSea, spawnParticles} from '../../utils/utils';
import {GameStatus} from '../../types';
import THREE, {Mesh, TetrahedronGeometry, MeshPhongMaterial, Box3} from 'three';
import {removeLife} from '../../mechanic/Lives';
//region Enemies
class Enemy {
  mesh: Mesh;
  angle: number;
  distance: number;
  hitpoints: number;
  allProjectiles;

  constructor(private game: Game) {
    var geom = new TetrahedronGeometry(8, 2);
    var mat = new MeshPhongMaterial({
      color: Colors.brown,
      shininess: 0,
      specular: 0xffffff,
      flatShading: true,
    });
    this.mesh = new Mesh(geom, mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.distance = 0;
    this.hitpoints = 3;
    this.game.sceneManager.add(this);
  }

  tick(deltaTime) {
    rotateAroundSea(this, deltaTime, this.game.world.worldSettings.enemiesSpeed);
    this.mesh.rotation.y += Math.random() * 0.1;
    this.mesh.rotation.z += Math.random() * 0.1;
    // collision?
    if (
      utils.collide(
        this.game.world.airplane.mesh,
        this.mesh,
        this.game.world.worldSettings.enemyDistanceTolerance,
      ) &&
      this.game.state.status !== GameStatus.Finished
    ) {
      this.explode();
      this.game.world.airplane.gethit(this.mesh.position);
      this.game.gameManager.removeLife();
      this.game.gameManager.setInitSpeed();

    }
    // passed-by?
    else if (this.angle > Math.PI) {
      this.game.sceneManager.remove(this);
    }

    // const thisAabb = new Box3().setFromObject(this.mesh);
    // for (const projectile of this.allProjectiles) {
    //   const projectileAabb = new Box3().setFromObject(projectile.mesh);
    //   if (thisAabb.intersectsBox(projectileAabb)) {
    //     spawnParticles(projectile.mesh.position.clone(), 5, Colors.brownDark, 1);
    //     projectile.remove();
    //     this.hitpoints -= projectile.damage;
    //     this.game.audioManager.play('bullet-impact', {volume: 0.3});
    //   }
    // }
    if (this.hitpoints <= 0) {
      this.explode();
    }
  }

  explode() {
    this.game.audioManager.play('rock-shatter', {volume: 3});
    spawnParticles(this.mesh.position.clone(), 15, Colors.red, 3, this.game.world.scene);
    this.game.sceneManager.remove(this);
    this.game.state.statistics.enemiesKilled += 1;
  }
}

export function spawnEnemies(count: number, game: Game) {
  for (let i = 0; i < count; i++) {
    const enemy = new Enemy(game);
    enemy.angle = -(i * 0.1);
    enemy.distance =
      game.world.worldSettings.seaRadius +
      game.world.worldSettings.planeDefaultHeight +
      (-1 + Math.random() * 2) * (game.world.worldSettings.planeAmpHeight);
    enemy.mesh.position.x = Math.cos(enemy.angle) * enemy.distance;
    enemy.mesh.position.y =
      -game.world.worldSettings.seaRadius + Math.sin(enemy.angle) * enemy.distance;
  }
  game.state.statistics.enemiesSpawned += count;
}
