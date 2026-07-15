const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

test("loads Tamaro core without legacy widget bootstrap", () => {
  const source = readFileSync(__dirname + "/widget_core.js", "utf8");
  const config = readFileSync(__dirname + "/widget_config.js", "utf8");
  const style = readFileSync(__dirname + "/widget_style.js", "utf8");

  assert.match(source, /@raisenow\/tamaro-core@2\/dist\/index\.js/);
  assert.doesNotMatch(source, /tamaro\.raisenow\.com\/projuventute\/latest\/widget\.js/);
  assert.match(source, /raisenow-core-ready/);
  assert.match(source, /querySelector\('script\[data-widget="rnw-tamaro-core"\]'\)/);
  assert.doesNotMatch(style, /document\.head\.innerHTML/);
  assert.match(style, /document\.head\.append\(widgetStyle\)/);
  assert.match(config, /tamaroCore\.createWidget/);
  assert.match(config, /tamaroCore\.renderWidget/);
  assert.doesNotMatch(config, /window\.rnw\.tamaro\./);
  assert.doesNotMatch(config, /setInterval/);
  assert.match(config, /raisenow-core-ready/);
  assert.match(config, /\.catch\(/);
  assert.match(config, /raisenow_parameters \|\|= \{\}/);
});
