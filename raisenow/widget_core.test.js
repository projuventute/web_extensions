const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

test("keeps legacy Tamaro startup while safely injecting style and tracking data", () => {
  const source = readFileSync(__dirname + "/widget_core.js", "utf8");
  const config = readFileSync(__dirname + "/widget_config.js", "utf8");
  const style = readFileSync(__dirname + "/widget_style.js", "utf8");

  assert.match(source, /tamaro\.raisenow\.com\/projuventute\/latest\/widget\.js/);
  assert.doesNotMatch(source, /@raisenow\/tamaro-core@2/);
  assert.match(config, /setInterval/);
  assert.match(config, /window\.rnw\.tamaro\.runWidget/);
  assert.doesNotMatch(config, /tamaroCore/);
  assert.doesNotMatch(config, /raisenow-core-ready/);
  assert.doesNotMatch(style, /document\.head\.innerHTML/);
  assert.match(style, /document\.head\.append\(widgetStyle\)/);
  assert.match(config, /raisenow_parameters \|\|= \{\}/);
  assert.match(config, /window\.rnw\.tamaro\.events\.paymentMethodChanged/);
});
