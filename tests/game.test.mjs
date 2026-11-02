import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../game.js', import.meta.url), 'utf8');

function createGame(randomValues = [0.5]) {
  const listeners = new Map();
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        style: {},
        textContent: '',
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
    window: { localStorage: { getItem: () => null, setItem() {} } },
    Math: math,
    requestAnimationFrame() {},
    setTimeout() {}
  };
  runInNewContext(source + '\nglobalThis.__game = { spawnObstacle, startGame, draw, rectsOverlap, getObstacles: () => obstacles, getLane: () => player.lane };', sandbox);
  return {
    game: sandbox.__game,
    click: id => listeners.get(id + ':click')()
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
