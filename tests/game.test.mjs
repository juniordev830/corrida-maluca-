import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../game.js', import.meta.url), 'utf8');

function createGame(randomValues = [0.5], storage = new Map(), failWrites = false) {
  const listeners = new Map();
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        style: {},
        textContent: '',
        value: id === 'difficulty' ? 'normal' : '',
        addEventListener(type, callback) {
          listeners.set(id + ':' + type, callback);
        }
      });
    }
    return elements.get(id);
  }
  const ctx = new Proxy({}, {
    get: (_, name) => name === 'createLinearGradient'
      ? () => ({ addColorStop() {} })
      : () => {}
  });
  const canvas = Object.assign(element('canvas'), {
    parentElement: { getBoundingClientRect: () => ({ width: 480, height: 640 }) },
    getContext: () => ctx
  });
  const doc = {
    hidden: false,
    getElementById: id => id === 'canvas' ? canvas : element(id),
    addEventListener(type, callback) {
      listeners.set('document:' + type, callback);
    }
  };
  const math = Object.create(Math);
  let index = 0;
  math.random = () => randomValues[index++ % randomValues.length];
  const sandbox = {
    document: doc,
    window: { localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => {
        if (failWrites) throw new Error('storage unavailable');
        storage.set(key, value);
      }
    } },
    Math: math,
    requestAnimationFrame() {},
    setTimeout() {}
  };
  runInNewContext(source + '\nglobalThis.__game = { spawnObstacle, startGame, endGame, update, draw, loop, rectsOverlap, getObstacles: () => obstacles, getLane: () => player.lane, getFrame: () => frame, isPaused: () => paused, getSpeed: () => baseSpeed, setScore: value => { score = value; } };', sandbox);
  return {
    game: sandbox.__game,
    click: id => listeners.get(id + ':click')(),
    change: id => listeners.get(id + ':change')(),
    keydown: event => listeners.get('document:keydown')(event),
    setHidden(hidden) {
      doc.hidden = hidden;
      listeners.get('document:visibilitychange')();
    },
    element
  };
}

test('gera carros, cones, barreiras e buracos dentro das faixas', () => {
  const { game } = createGame([
    0.5, 0.1, 0.5,
    0.5, 0.6, 0.5,
    0.5, 0.8, 0.5,
    0.5, 0.99, 0.5
  ]);
  for (let i = 0; i < 4; i++) game.spawnObstacle();
  const obstacles = game.getObstacles();
  assert.deepEqual(Array.from(obstacles, o => o.kind), ['car', 'cone', 'barrier', 'pothole']);
  for (const o of obstacles) {
    assert.equal(o.lane, 1);
    assert.ok(o.x >= 160 && o.x + o.w <= 320);
    assert.ok(o.w > 0 && o.h > 0);
  }
  assert.doesNotThrow(() => game.draw());
});

test('controles de toque respeitam limites das três faixas', () => {
  const { game, click } = createGame();
  game.startGame();
  click('btnRight');
  click('btnRight');
  assert.equal(game.getLane(), 2);
  click('btnLeft');
  click('btnLeft');
  click('btnLeft');
  assert.equal(game.getLane(), 0);
});

test('colisão considera tamanho real do obstáculo', () => {
  const { game } = createGame();
  assert.equal(game.rectsOverlap({ x: 10, y: 10, w: 20, h: 20 }, { x: 25, y: 25, w: 20, h: 20 }), true);
  assert.equal(game.rectsOverlap({ x: 10, y: 10, w: 20, h: 20 }, { x: 30, y: 10, w: 20, h: 20 }), false);
});

test('pausa ao ocultar e aguarda o jogador continuar sem avançar o tempo em segundo plano', () => {
  const { game, click, setHidden, element } = createGame();
  game.startGame();
  game.loop(0);
  game.loop(50);
  const beforePause = game.getFrame();
  assert.ok(beforePause > 0);

  setHidden(true);
  assert.equal(game.isPaused(), true);
  assert.equal(element('overlayTitle').textContent, 'Pausado');
  game.loop(10000);
  assert.equal(game.getFrame(), beforePause);

  setHidden(false);
  assert.equal(game.isPaused(), true);
  click('startBtn');
  assert.equal(game.isPaused(), false);
  game.loop(20000);
  assert.equal(game.getFrame(), beforePause);
  game.loop(20017);
  assert.equal(game.getFrame(), beforePause + 1);
});

test('ocultar a página antes de iniciar não pausa ou inicia uma partida', () => {
  const { game, setHidden } = createGame();
  setHidden(true);
  assert.equal(game.isPaused(), false);
  assert.equal(game.getFrame(), 0);
});

test('níveis alteram a velocidade e a frequência de obstáculos', () => {
  const easy = createGame();
  easy.element('difficulty').value = 'tranquilo';
  easy.game.startGame();
  const hard = createGame();
  hard.element('difficulty').value = 'desafio';
  hard.game.startGame();
  assert.equal(easy.game.getSpeed(), 3);
  assert.equal(hard.game.getSpeed(), 5);
  for (let i = 0; i < 50; i++) {
    easy.game.update();
    hard.game.update();
  }
  assert.equal(easy.game.getObstacles().length, 0);
  assert.equal(hard.game.getObstacles().length, 1);
});

test('recordes são separados por nível e preservam o recorde antigo do normal', () => {
  const storage = new Map([['corridaMalucaHighScore', '40']]);
  const { game, element, change } = createGame([0.5], storage);
  assert.equal(element('highScore').textContent, 40);
  element('difficulty').value = 'tranquilo';
  change('difficulty');
  assert.equal(element('highScore').textContent, 0);
  game.startGame();
  game.setScore(30);
  game.endGame();
  assert.equal(storage.get('corridaMalucaHighScore:tranquilo'), '30');
  assert.equal(storage.get('corridaMalucaHighScore'), '40');
  element('difficulty').value = 'normal';
  change('difficulty');
  assert.equal(element('highScore').textContent, 40);
});

test('mantém o recorde da sessão se a gravação local falhar', () => {
  const storage = new Map([['corridaMalucaHighScore', '40']]);
  const { game, element } = createGame([0.5], storage, true);
  game.startGame();
  game.setScore(70);
  game.endGame();
  game.startGame();
  assert.equal(element('highScore').textContent, 70);
  assert.equal(storage.get('corridaMalucaHighScore'), '40');
});

test('seletor fica oculto durante a pausa e espaço preserva controles focados', () => {
  const { game, click, element, keydown } = createGame();
  game.startGame();
  let prevented = false;
  keydown({ code: 'Space', target: { tagName: 'BUTTON' }, preventDefault() { prevented = true; } });
  assert.equal(prevented, false);
  assert.equal(game.isPaused(), false);
  click('btnPause');
  assert.equal(game.isPaused(), true);
  assert.equal(element('difficultyPicker').hidden, true);
});
