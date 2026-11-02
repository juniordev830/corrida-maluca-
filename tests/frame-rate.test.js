const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function simulate(hz) {
  const elements = {};
  const context = new Proxy({}, {get: (_, key) => key === 'createLinearGradient' ? () => ({addColorStop(){}}) : () => {}});
  const element = id => elements[id] ||= {textContent: '', style: {}, addEventListener(){}, getContext: () => context, parentElement: {getBoundingClientRect: () => ({})}};
  const sandbox = {document: {getElementById: element, addEventListener(){}}, window: {localStorage: {getItem: () => null}}, requestAnimationFrame(){}, setTimeout(){}};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync('game.js', 'utf8'), sandbox);
  vm.runInContext('startGame()', sandbox);
  for (let i=0; i<=hz; i++) vm.runInContext('loop(' + (i*1000/hz) + ')', sandbox);
  return vm.runInContext('frame', sandbox);
}
test('same simulation steps at 60 and 144 Hz', () => {
  assert.equal(simulate(60), 60);
  assert.equal(simulate(144), 60);
});
