/**
 Data collection for Enemies
 Includes the base stats for enemies
 Includes the images for enemies
 */

var ENEMY_COUNT = 8;

var ENEMY_GPU_OVERHEAT = 0;
var ENEMY_BLACKHAT = 1;
var ENEMY_51_PERCENT = 2;
var ENEMY_MALWARE = 3;
var ENEMY_LOST_SEED = 4;
var ENEMY_SCAMCOIN = 5;
var ENEMY_SHILL = 6;
var ENEMY_STALE_BLOCK = 7;

var ENEMY_CATEGORY_SHADOW = 0;
var ENEMY_CATEGORY_DEMON = 1;
var ENEMY_CATEGORY_UNDEAD = 2;
var ENEMY_CATEGORY_BOT = 3;

var enemy = new Object();

enemy.load_counter = 0;
enemy.img = new Array();
enemy.img_loaded = false;
enemy.stats = new Array();
enemy.render_offset = {x:0, y:0};

function enemy_init() {
  for (i=0; i<ENEMY_COUNT; i++) {
    enemy.img[i] = new Image();
  }

  // load enemy images
  enemy.img[ENEMY_GPU_OVERHEAT].src = "images/enemies/gpu_overheat.png";
  enemy.img[ENEMY_GPU_OVERHEAT].onload = function() {enemy_onload();};

  enemy.img[ENEMY_BLACKHAT].src = "images/enemies/blackhat.png";
  enemy.img[ENEMY_BLACKHAT].onload = function() {enemy_onload();};

  enemy.img[ENEMY_51_PERCENT].src = "images/enemies/51_percent.png";
  enemy.img[ENEMY_51_PERCENT].onload = function() {enemy_onload();};

  enemy.img[ENEMY_MALWARE].src = "images/enemies/malware.png";
  enemy.img[ENEMY_MALWARE].onload = function() {enemy_onload();};

  enemy.img[ENEMY_LOST_SEED].src = "images/enemies/lost_seed.png";
  enemy.img[ENEMY_LOST_SEED].onload = function() {enemy_onload();};

  enemy.img[ENEMY_SCAMCOIN].src = "images/enemies/scamcoin.png";
  enemy.img[ENEMY_SCAMCOIN].onload = function() {enemy_onload();}

  enemy.img[ENEMY_SHILL].src = "images/enemies/shill.png";
  enemy.img[ENEMY_SHILL].onload = function() {enemy_onload();}

  enemy.img[ENEMY_STALE_BLOCK].src = "images/enemies/stale_block.png";
  enemy.img[ENEMY_STALE_BLOCK].onload = function() {enemy_onload();}

  // set enemy stats

  enemy.stats[ENEMY_GPU_OVERHEAT] = {name:"GPU Overheat", hp:6, atk_min:2, atk_max:5, crypto_min:1, crypto_max:2, category:ENEMY_CATEGORY_SHADOW};
  enemy.stats[ENEMY_GPU_OVERHEAT].powers = [ENEMY_POWER_ATTACK];

  enemy.stats[ENEMY_BLACKHAT] = {name:"Blackhat", hp:7, atk_min:2, atk_max:6, crypto_min:1, crypto_max:3, category:ENEMY_CATEGORY_DEMON};
  enemy.stats[ENEMY_BLACKHAT].powers = [ENEMY_POWER_ATTACK, ENEMY_POWER_ATTACK, ENEMY_POWER_SCORCH];

  enemy.stats[ENEMY_51_PERCENT] = {name:"51 Percent", hp:8, atk_min:3, atk_max:8, crypto_min:2, crypto_max:4, category:ENEMY_CATEGORY_SHADOW};
  enemy.stats[ENEMY_51_PERCENT].powers = [ENEMY_POWER_ATTACK, ENEMY_POWER_ATTACK, ENEMY_POWER_MPDRAIN];

  enemy.stats[ENEMY_MALWARE] = {name:"Malware", hp:12, atk_min:4, atk_max:10, crypto_min:3, crypto_max:6, category:ENEMY_CATEGORY_UNDEAD};
  enemy.stats[ENEMY_MALWARE].powers = [ENEMY_POWER_ATTACK, ENEMY_POWER_ATTACK, ENEMY_POWER_HPDRAIN];

  enemy.stats[ENEMY_LOST_SEED] = {name:"Lost Seed", hp:18, atk_min:6, atk_max:12, crypto_min:5, crypto_max:8, category:ENEMY_CATEGORY_UNDEAD};
  enemy.stats[ENEMY_LOST_SEED].powers = [ENEMY_POWER_ATTACK];

  enemy.stats[ENEMY_SCAMCOIN] = {name:"Scamcoin", hp:16, atk_min:7, atk_max:14, crypto_min:7, crypto_max:12, category:ENEMY_CATEGORY_DEMON};
  enemy.stats[ENEMY_SCAMCOIN].powers = [ENEMY_POWER_ATTACK, ENEMY_POWER_SCORCH, ENEMY_POWER_HPDRAIN, ENEMY_POWER_MPDRAIN];

  enemy.stats[ENEMY_SHILL] = {name:"Shill", hp:30, atk_min:10, atk_max:16, crypto_min:16, crypto_max:25, category:ENEMY_CATEGORY_BOT};
  enemy.stats[ENEMY_SHILL].powers = [ENEMY_POWER_ATTACK];

  enemy.stats[ENEMY_STALE_BLOCK] = {name:"Stale Block", hp:84, atk_min:8, atk_max:15, crypto_min:225, crypto_max:275, category:ENEMY_CATEGORY_DEMON};
  enemy.stats[ENEMY_STALE_BLOCK].powers = [ENEMY_POWER_ATTACK, ENEMY_POWER_SCORCH];
  
}

function enemy_onload() {
  enemy.load_counter++;
  if (enemy.load_counter == ENEMY_COUNT) enemy.img_loaded = true;
}

function enemy_render(enemy_id) {

  if (!enemy.img_loaded) return;

  ctx.drawImage(
    enemy.img[enemy_id],
    0,
    0,
    160 * PRESCALE,
    120 * PRESCALE,
    enemy.render_offset.x * SCALE,
    enemy.render_offset.y * SCALE,
    160 * SCALE,
    120 * SCALE
  );
  
  // optional enemy overlays
  boss_boneshield_render();
}

