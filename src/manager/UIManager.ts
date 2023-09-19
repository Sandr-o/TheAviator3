import {Game} from '../game';
import {GameStatus} from '../types';

export class UIManager {
  _elemDistanceCounter: HTMLElement;
  _elemReplayMessage: HTMLElement;
  _elemLevelCounter: HTMLElement;
  _elemLevelCircle: HTMLElement;
  _elemStartButton: HTMLElement;
  _elemsLifes: NodeListOf<Element>;
  _elemCoinsCount: HTMLElement;

  canvas: HTMLElement;
  width: number;
  height: number;
  _resizeListeners: any[];

  mousePos: {x: number; y: number};
  mouseButtons: boolean[];
  keysDown: {};

  constructor(private game: Game) {
    this._elemDistanceCounter = document.getElementById('distValue');
    this._elemReplayMessage = document.getElementById('replayMessage');
    this._elemLevelCounter = document.getElementById('levelValue');
    this._elemLevelCircle = document.getElementById('levelCircleStroke');
    this._elemsLifes = document.querySelectorAll('#lifes img');
    this._elemCoinsCount = document.getElementById('coinsValue');
    this._elemStartButton = document.getElementById('buttonStart');

    this._elemStartButton.onclick = () => {
      document.getElementById('intro-screen').classList.remove('visible');
      game.gameManager.startMap();
    };

    document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
    document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
    document.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
    document.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
    document.addEventListener('blur', this.handleBlur.bind(this), false);

    document.oncontextmenu = document.body.oncontextmenu = function () {
      return false;
    };

    window.addEventListener('resize', this.handleWindowResize.bind(this), false);

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mousePos = {x: 0, y: 0};
    this.canvas = document.getElementById('threejs-canvas');

    this.mouseButtons = [false, false, false];
    this.keysDown = {};

    this._resizeListeners = [];
  }

  onResize(callback) {
    this._resizeListeners.push(callback);
  }

  handleWindowResize(_event) {
    console.log('handleWindowResize');

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    for (const listener of this._resizeListeners) {
      listener();
    }
  }

  handleMouseMove(event) {
    var tx = -1 + (event.clientX / this.width) * 2;
    var ty = 1 - (event.clientY / this.height) * 2;
    this.mousePos = {x: tx, y: ty};
  }

  handleTouchMove(event) {
    event.preventDefault();
    var tx = -1 + (event.touches[0].pageX / this.width) * 2;
    var ty = 1 - (event.touches[0].pageY / this.height) * 2;
    this.mousePos = {x: tx, y: ty};
  }

  handleMouseDown(event) {
    this.mouseButtons[event.button] = true;

    if (event.button === 1 && this.game.state.status === GameStatus.Playing) {
      // airplane.shoot();
    }
  }

  handleKeyDown(event) {
    this.keysDown[event.code] = true;
    if (event.code === 'KeyP') {
      this.game.state.paused = !this.game.state.paused;
    }
    if (event.code === 'Space') {
      // increase speed
      this.game.state.speedBoost = !this.game.state.speedBoost;
    }
    if (event.code === 'Enter') {
      if (this.game.state.fpv) {
        this.game.world.setSideView();
      } else {
        this.game.world.setFollowView();
      }
    }
  }

  handleKeyUp(event) {
    this.keysDown[event.code] = false;
  }

  handleMouseUp(event) {
    this.mouseButtons[event.button] = false;
    event.preventDefault();

    if (this.game.state.status === GameStatus.WaitingReplay) {
      this.game.gameManager.resetMap();
      this.informNextLevel(1);
      this.game.state.paused = false;
      this.game.world.sea.updateColor();
      this.game.world.sea2.updateColor();

      this.updateDistanceDisplay();
      this.updateLevelCount();
      this.updateLifesDisplay();
      this.updateCoinsCount();

      this.hideReplay();
      this.disableScoreScreen();
    }
  }

  handleBlur(_event) {
    this.mouseButtons = [false, false, false];
  }

  showReplay() {
    this._elemReplayMessage.style.display = 'block';
  }

  hideReplay() {
    this._elemReplayMessage.style.display = 'none';
  }

  updateLevelCount() {
    this._elemLevelCounter.innerText = `${this.game.state.level}`;
  }

  updateCoinsCount() {
    this._elemCoinsCount.innerText = `${this.game.state.coins}`;
  }

  updateDistanceDisplay() {
    this._elemDistanceCounter.innerText = `${Math.floor(this.game.state.distance)}m`;
    const d =
      502 *
      (1 -
        (this.game.state.distance % this.game.world.worldSettings.distanceForLevelUpdate) /
          this.game.world.worldSettings.distanceForLevelUpdate);
    this._elemLevelCircle.setAttribute('stroke-dashoffset', d.toString());
  }

  updateLifesDisplay() {
    for (let i = 0, len = this._elemsLifes.length; i < len; i += 1) {
      const hasThisLife = i < this.game.state.lifes;
      const elem = this._elemsLifes[i];
      if (hasThisLife && !elem.classList.contains('visible')) {
        elem.classList.remove('invisible');
        elem.classList.add('visible');
      } else if (!hasThisLife && !elem.classList.contains('invisible')) {
        elem.classList.remove('visible');
        elem.classList.add('invisible');
      }
    }
  }

  informNextLevel(level) {
    const ANIMATION_DURATION = 1.0;

    const elem = document.getElementById('new-level');
    elem.style.visibility = 'visible';
    elem.style.animationDuration = Math.round(ANIMATION_DURATION * 1000) + 'ms';
    elem.children[1].innerText = level;
    elem.classList.add('animating');
    setTimeout(() => {
      document.getElementById('new-level').style.visibility = 'hidden';
      elem.classList.remove('animating');
    }, 1000);
  }

  showScoreScreen() {
    const elemScreen = document.getElementById('score-screen');

    // make visible
    elemScreen.classList.add('visible');

    // fill in statistics
    document.getElementById('score-coins-collected').innerText =
      this.game.state.statistics.coinsCollected;
    document.getElementById('score-coins-total').innerText =
      this.game.state.statistics.coinsSpawned;
    document.getElementById('score-enemies-killed').innerText =
      this.game.state.statistics.enemiesKilled;
    document.getElementById('score-enemies-total').innerText =
      this.game.state.statistics.enemiesSpawned;
    document.getElementById('score-shots-fired').innerText = this.game.state.statistics.shotsFired;
    document.getElementById('score-lifes-lost').innerText = this.game.state.statistics.lifesLost;
  }
  disableScoreScreen() {
    document.getElementById('score-screen').classList.remove('visible');
  }

  showError(message) {
    document.getElementById('error').style.visibility = 'visible';
    document.getElementById('error-message').innerText = message;
  }
}
