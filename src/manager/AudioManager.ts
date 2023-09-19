import {randomOneOf} from '../utils/utils';
import {Game} from '../game';
import {AudioLoader, AudioListener, Audio} from 'three';

export class AudioManager {
  buffers: {};
  loader: THREE.AudioLoader;
  listener: THREE.AudioListener;
  categories: {};

  constructor(private game: Game) {
    this.buffers = {};
    this.loader = new AudioLoader();
    this.listener = new AudioListener();
    this.categories = {};

    this.preloadAudio();
  }

  setCamera(camera) {
    camera.add(this.listener);
  }

  load(soundId, category, path) {
    const promise = new Promise<void>((resolve, reject) => {
      this.loader.load(
        path,
        audioBuffer => {
          this.buffers[soundId] = audioBuffer;
          if (category !== null) {
            if (!this.categories[category]) {
              this.categories[category] = [];
            }
            this.categories[category].push(soundId);
          }
          resolve();
        },
        () => {},
        reject,
      );
    });
    this.game.loadingProgressManager.add(promise);
  }

  play(soundIdOrCategory, options?) {
    options = options || {};

    let soundId = soundIdOrCategory;
    const category = this.categories[soundIdOrCategory];
    if (category) {
      soundId = randomOneOf(category);
    }

    const buffer = this.buffers[soundId];
    const sound = new Audio(this.listener);
    sound.setBuffer(buffer);
    if (options.loop) {
      sound.setLoop(true);
    }
    if (options.volume) {
      sound.setVolume(options.volume);
    }
    sound.play();
  }

  private preloadAudio() {
    // load audio
    this.load('ocean', null, require('/audio/ocean.mp3'));
    this.load('propeller', null, require('/audio/propeller.mp3'));

    this.load('coin-1', 'coin', require('/audio/coin-1.mp3'));
    this.load('coin-2', 'coin', require('/audio/coin-2.mp3'));
    this.load('coin-3', 'coin', require('/audio/coin-3.mp3'));
    this.load('jar-1', 'coin', require('/audio/jar-1.mp3'));
    this.load('jar-2', 'coin', require('/audio/jar-2.mp3'));
    this.load('jar-3', 'coin', require('/audio/jar-3.mp3'));
    this.load('jar-4', 'coin', require('/audio/jar-4.mp3'));
    this.load('jar-5', 'coin', require('/audio/jar-5.mp3'));
    this.load('jar-6', 'coin', require('/audio/jar-6.mp3'));
    this.load('jar-7', 'coin', require('/audio/jar-7.mp3'));
    //this.load('stardust','stardust', require('/audio/stardust.mp3'))

    this.load('airplane-crash-1', 'airplane-crash', require('/audio/airplane-crash-1.mp3'));
    this.load('airplane-crash-2', 'airplane-crash', require('/audio/airplane-crash-2.mp3'));
    this.load('airplane-crash-3', 'airplane-crash', require('/audio/airplane-crash-3.mp3'));

    this.load('bubble', 'bubble', require('/audio/bubble.mp3'));

    this.load('shot-soft', 'shot-soft', require('/audio/shot-soft.mp3'));

    this.load('shot-hard', 'shot-hard', require('/audio/shot-hard.mp3'));

    this.load('bullet-impact', 'bullet-impact', require('/audio/bullet-impact-rock.mp3'));

    this.load('water-splash', 'water-splash', require('/audio/water-splash.mp3'));
    this.load('rock-shatter-1', 'rock-shatter', require('/audio/rock-shatter-1.mp3'));
    this.load('rock-shatter-2', 'rock-shatter', require('/audio/rock-shatter-2.mp3'));
  }
}
