import {type} from 'os';

export enum GameStatus {
  Playing,
  Finished,
  GameOver,
  WaitingReplay,
}

export type WorldSettings = {
  initSpeed: number;
  incrementSpeedByTime: number;
  incrementSpeedByLevel: number;
  distanceForSpeedUpdate: number;
  ratioSpeedDistance: number;
  speedBoostIncrement: number,
  simpleGunLevelDrop: number;
  doubleGunLevelDrop: number;
  betterGunLevelDrop: number;

  maxLifes: number;
  pauseLifeSpawn: number;

  levelCount: number;
  distanceForLevelUpdate: number;

  planeDefaultHeight: number;
  planeAmpHeight: number;
  planeAmpWidth: number;
  planeMoveSensivity: number;
  planeRotXSensivity: number;
  planeRotZSensivity: number;
  planeMinSpeed: number;
  planeMaxSpeed: number;

  seaRadius: number;
  seaLength: number;
  wavesMinAmp: number;
  wavesMaxAmp: number;
  wavesMinSpeed: number;
  wavesMaxSpeed: number;

  cameraSensivity: number;

  coinDistanceTolerance: number;
  coinsSpeed: number;
  distanceForCoinsSpawn: number;

  collectibleDistanceTolerance: number;
  collectiblesSpeed: number;

  enemyDistanceTolerance: number;
  enemiesSpeed: number;
  distanceForEnemiesSpawn: number;
};

export type State = {
  status: GameStatus;
  paused: boolean;
  speed: number;
  targetSpeed: number;
  speedLastUpdate: number;

  distance: number;
  speedBoost: boolean;
  coins: number;
  fpv: boolean;

  spawnedSimpleGun: boolean;
  spawnedDoubleGun: boolean;
  spawnedBetterGun: boolean;

  lastLifeSpawn: number;
  lifes: number;

  level: number;
  levelLastUpdate: number;
  planeFallSpeed: number;
  planeCollisionDisplacementX: number;
  planeCollisionSpeedX: number;
  planeCollisionDisplacementY: number;
  planeCollisionSpeedY: number;
  coinLastSpawn: number;
  enemyLastSpawn: number;
  statistics: {
    coinsCollected: number;
    coinsSpawned: number;
    enemiesKilled: number;
    enemiesSpawned: number;
    shotsFired: number;
    lifesLost: number;
  };
};
