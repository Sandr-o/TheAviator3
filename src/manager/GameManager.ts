import {Game} from '../game';
import {DEFAULT_STATE, WORLD_DEFAULT_SETTINGS, canDie} from '../settings';
import {GameStatus} from '../types';
import {spawnEnemies} from '../world/enemy/Enemy';

export class GameManager {
  private soundPlaying = false;
  private oldTime: number;
  constructor(private game: Game) {}

  public startMap() {
    if (!this.soundPlaying) {
      //this.game.audioManager.play('propeller', {loop: true, volume: 1});
      this.game.audioManager.play('stardust');
      this.soundPlaying = true;
    }

    this.game.world.initializeWorldAssets();
    this.oldTime = new Date().getTime();

    this.loop();

    this.game.uiManager.informNextLevel(1);
    this.game.state.paused = false;
  }

  public loop() {
    const newTime = new Date().getTime();
    const deltaTime = newTime - this.oldTime;
    this.oldTime = newTime;

    if (this.game.state.status === GameStatus.Playing) {
      if (!this.game.state.paused) {
        // Add coins
        // if (
        //   Math.floor(this.game.state.distance) % this.game.world.worldSettings.distanceForCoinsSpawn === 0 &&
        //   Math.floor(this.game.state.distance) > this.game.state.coinLastSpawn
        // ) {
        //   this.game.state.coinLastSpawn = Math.floor(this.game.state.distance);
        //   spawnCoins();
        // }
        if (
          Math.floor(this.game.state.distance) %
            this.game.world.worldSettings.distanceForSpeedUpdate ===
            0 &&
          Math.floor(this.game.state.distance) > this.game.state.speedLastUpdate
        ) {
          this.game.state.speedLastUpdate = Math.floor(this.game.state.distance);
          this.game.state.targetSpeed +=
            this.game.world.worldSettings.incrementSpeedByTime * deltaTime;
        }
        if (
          Math.floor(this.game.state.distance) %
            this.game.world.worldSettings.distanceForEnemiesSpawn ===
            0 &&
          Math.floor(this.game.state.distance) > this.game.state.enemyLastSpawn
        ) {
          this.game.state.enemyLastSpawn = Math.floor(this.game.state.distance);
          spawnEnemies(this.game.state.level, this.game);
        }
        if (
          Math.floor(this.game.state.distance) %
            this.game.world.worldSettings.distanceForLevelUpdate ===
            0 &&
          Math.floor(this.game.state.distance) > this.game.state.levelLastUpdate
        ) {
          this.game.state.levelLastUpdate = Math.floor(this.game.state.distance);
          this.game.state.level += 1;
          if (this.game.state.level === this.game.world.worldSettings.levelCount) {
            this.game.state.status = GameStatus.Finished;
            this.game.world.setFollowView();
            this.game.uiManager.showScoreScreen();
          } else {
            this.game.uiManager.informNextLevel(this.game.state.level);
            this.game.world.sea.updateColor();
            this.game.world.sea2.updateColor();
            this.game.uiManager.updateLevelCount();
            this.game.state.targetSpeed =
              this.game.world.worldSettings.initSpeed +
              this.game.world.worldSettings.incrementSpeedByLevel * this.game.state.level;
          }
        }

        // span collectibles
        // if (
        //   this.game.state.lifes < world.maxLifes &&
        //   this.game.state.distance - this.game.state.lastLifeSpawn > world.pauseLifeSpawn &&
        //   Math.random() < 0.01
        // ) {
        //   this.game.state.lastLifeSpawn = this.game.state.distance;
        //   spawnLifeCollectible();
        // }
        // if (
        //   !this.game.state.spawnedSimpleGun &&
        //   this.game.state.distance > world.simpleGunLevelDrop * world.distanceForLevelUpdate
        // ) {
        //   spawnSimpleGunCollectible();
        //   this.game.state.spawnedSimpleGun = true;
        // }
        // if (
        //   !this.game.state.spawnedDoubleGun &&
        //   this.game.state.distance > world.doubleGunLevelDrop * world.distanceForLevelUpdate
        // ) {
        //   spawnDoubleGunCollectible();
        //   this.game.state.spawnedDoubleGun = true;
        // }
        // if (
        //   !this.game.spawnedBetterGun &&
        //   this.game.distance > world.betterGunLevelDrop * world.distanceForLevelUpdate
        // ) {
        //   spawnBetterGunCollectible();
        //   this.game.spawnedBetterGun = true;
        // }

        // if (ui.mouseButtons[0] || ui.keysDown['Space']) {
        //   airplane.shoot();
        // }

        const speedBoostIncrement = this.game.state.speedBoost ? this.game.world.worldSettings.speedBoostIncrement : 0;

        this.game.world.airplane.tick(deltaTime);
        this.game.state.distance += this.game.state.speed * deltaTime * this.game.world.worldSettings.ratioSpeedDistance;
        this.game.state.speed += (this.game.state.targetSpeed - this.game.state.speed + speedBoostIncrement) * deltaTime * 0.02;
        this.game.uiManager.updateDistanceDisplay();

        if (this.game.state.lifes <= 0 && canDie) {
          this.game.state.status = GameStatus.GameOver;
        }
      }
    } else if (this.game.state.status === GameStatus.GameOver) {
      this.game.state.speed *= 0.99;

      const {airplane} = this.game.world;
      airplane.mesh.rotation.z += (-Math.PI / 2 - airplane.mesh.rotation.z) * 0.0002 * deltaTime;
      airplane.mesh.rotation.x += 0.0003 * deltaTime;
      this.game.state.planeFallSpeed *= 1.05;
      airplane.mesh.position.y -= this.game.state.planeFallSpeed * deltaTime;
      if (airplane.mesh.position.y < -200) {
        this.game.uiManager.showReplay();
        this.game.uiManager.showScoreScreen();
        this.game.state.status = GameStatus.WaitingReplay;
        this.game.audioManager.play('water-splash');
      }
    } else if (this.game.state.status === GameStatus.WaitingReplay) {
      // nothing to do
    }

    if (!this.game.state.paused) {
      this.game.world.airplane.tick(deltaTime);

      this.game.world.sea.mesh.rotation.z += this.game.state.speed * deltaTime;
      if (this.game.world.sea.mesh.rotation.z > 2 * Math.PI) {
        this.game.world.sea.mesh.rotation.z -= 2 * Math.PI;
      }
      const {ambientLight} = this.game.world.light;
      ambientLight.intensity += (0.5 - ambientLight.intensity) * deltaTime * 0.005;

      this.game.sceneManager.tick(deltaTime);
      this.game.world.sky.tick(deltaTime);
      this.game.world.sea.tick(deltaTime);
    }

    this.game.world.renderer.render(this.game.world.scene, this.game.world.camera);
    requestAnimationFrame(() => this.loop());
  }

  public resetMap() {
    this.game.state = {...DEFAULT_STATE};

    // update ui
    this.game.uiManager.updateDistanceDisplay();
    this.game.uiManager.updateLevelCount();
    this.game.uiManager.updateLifesDisplay();
    this.game.uiManager.updateCoinsCount();

    this.game.sceneManager.clear();

    this.game.world.sea.updateColor();
    this.game.world.sea2.updateColor();

    this.game.world.setSideView();

    this.game.world.airplane.equipWeapon(null);

    // airplane.equipWeapon(new SimpleGun())
    // airplane.equipWeapon(new DoubleGun())
    // airplane.equipWeapon(new BetterGun())
  }

  public addCoin() {
    this.game.state.coins += 1;
    this.game.uiManager.updateCoinsCount();
    this.game.state.statistics.coinsCollected += 1;
  }

  public addLife() {
    this.game.state.lifes = Math.min(
      this.game.world.worldSettings.maxLifes,
      this.game.state.lifes + 1,
    );
    this.game.uiManager.updateLifesDisplay();
  }

  public removeLife() {
    const newTime = new Date().getTime();
    const deltaTime = newTime - this.oldTime;
    this.oldTime = newTime;
    this.game.state.lifes = Math.max(0, this.game.state.lifes - 1);
    this.game.uiManager.updateLifesDisplay();
    this.game.state.statistics.lifesLost += 1;
    this.game.state.speed = (this.game.state.targetSpeed - this.game.state.speed) * deltaTime * 0.02
  }
  public setInitSpeed() {
    this.game.state.targetSpeed = this.game.world.worldSettings.initSpeed;

  }
}
