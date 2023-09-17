import {GameStatus} from './types';

// Settings
export const Colors = {
  red: 0xf25346,
  orange: 0xffa500,
  white: 0xd8d0d1,
  brown: 0x59332e,
  brownDark: 0x23190f,
  pink: 0xf5986e,
  yellow: 0xf4ce93,
  blue: 0x68c3c0,
};

export const COLOR_COINS = 0xffd700; // 0x009999
export const COLOR_COLLECTIBLE_BUBBLE = COLOR_COINS;
export const COLOR_SEA_LEVEL = [
  0x68c3c0, // hsl(178deg 43% 59%)
  0x47b3af, // hsl(178deg 43% 49%)
  0x398e8b, // hsl(178deg 43% 39%)
  0x2a6a68, // hsl(178deg 43% 29%)
  0x1c4544, // hsl(178deg 43% 19%)
  0x0d2120, // hsl(178deg 43% 09%)
];

export const canDie = true;

export const WORLD_DEFAULT_SETTINGS = {
  initSpeed: 0.00035,
  incrementSpeedByTime: 0.0000025,
  incrementSpeedByLevel: 0.000005,
  distanceForSpeedUpdate: 100,
  ratioSpeedDistance: 50,

  simpleGunLevelDrop: 1.1,
  doubleGunLevelDrop: 2.3,
  betterGunLevelDrop: 3.5,

  maxLifes: 3,
  pauseLifeSpawn: 400,

  levelCount: 9999,
  distanceForLevelUpdate: 500,

  planeDefaultHeight: 100,
  planeAmpHeight: 80,
  planeAmpWidth: 75,
  planeMoveSensivity: 0.005,
  planeRotXSensivity: 0.0008,
  planeRotZSensivity: 0.0004,
  planeMinSpeed: 1.2,
  planeMaxSpeed: 1.6,

  seaRadius: 600,
  seaLength: 800,
  wavesMinAmp: 5,
  wavesMaxAmp: 20,
  wavesMinSpeed: 0.001,
  wavesMaxSpeed: 0.003,

  cameraSensivity: 0.002,

  coinDistanceTolerance: 15,
  coinsSpeed: 0.5,
  distanceForCoinsSpawn: 50,

  collectibleDistanceTolerance: 15,
  collectiblesSpeed: 0.6,

  enemyDistanceTolerance: 10,
  enemiesSpeed: 0.6,
  distanceForEnemiesSpawn: 50,
};

export const DEFAULT_STATE = {
  status: GameStatus.Playing,

  paused: false,
  speed: 0,
  targetSpeed: 0.00035,
  speedLastUpdate: 0,

  distance: 0,

  coins: 0,
  fpv: false,

  // gun spawning
  spawnedSimpleGun: false,
  spawnedDoubleGun: false,
  spawnedBetterGun: false,

  lastLifeSpawn: 0,
  lifes: WORLD_DEFAULT_SETTINGS.maxLifes,

  level: 1,
  levelLastUpdate: 0,

  planeFallSpeed: 0.001,
  planeCollisionDisplacementX: 0,
  planeCollisionSpeedX: 0,
  planeCollisionDisplacementY: 0,
  planeCollisionSpeedY: 0,

  coinLastSpawn: 0,
  enemyLastSpawn: 0,

  statistics: {
    coinsCollected: 0,
    coinsSpawned: 0,
    enemiesKilled: 0,
    enemiesSpawned: 0,
    shotsFired: 0,
    lifesLost: 0,
  },
};
