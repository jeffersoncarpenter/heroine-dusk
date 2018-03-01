/**
 * Resolve power use
 */

var ENEMY_POWER_ATTACK = 0;
var ENEMY_POWER_SCORCH = 1;
var ENEMY_POWER_HPDRAIN = 2;
var ENEMY_POWER_MPDRAIN = 3;

function power_hero_attack() {

  combat.offense_action = "Attack!";
  
  // special: override hero action if the boss has bone shield up
  if (boss.boneshield_active) {
    boss_boneshield_heroattack();
    return;
  }
  
  // check miss
  var hit_chance = Math.random();
  if (hit_chance < 0.20) {
    combat.offense_result = "Miss!";
    sounds_play(SFX_MISS);
    return;
  }
  
  // Hit: calculate damage
  var atk_min = info.weapons[avatar.weapon].atk_min + avatar.bonus_atk;
  var atk_max = info.weapons[avatar.weapon].atk_max + avatar.bonus_atk;
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;
  
  // check crit
  // hero crits add max damage
  var crit_chance = Math.random();
  if (crit_chance < 0.10) {
    attack_damage += atk_max;
    combat.offense_action = "Critical!";
    sounds_play(SFX_CRITICAL);
  }
  else {
    sounds_play(SFX_ATTACK);
  }
  
  combat.enemy.hp -= attack_damage;
  combat.offense_result = attack_damage + " damage";
  
  combat.enemy_hurt = true;
  
}


/**
 * Choose a random power from the enemy's available powers
 */
function power_enemy(enemy_id) {

  // override for boss action
  if (enemy_id == ENEMY_STALE_BLOCK) {
    boss_power();
    return;
  }

  var power_options = enemy.stats[enemy_id].powers.length;
  var power_roll = Math.floor(Math.random() * power_options);
  var power_choice = enemy.stats[enemy_id].powers[power_roll];

  switch (power_choice) {
    case ENEMY_POWER_ATTACK:
      power_enemy_attack();
      return;
    case ENEMY_POWER_SCORCH:
      power_scorch();
      return;
    case ENEMY_POWER_HPDRAIN:
      power_hpdrain();
      return;
    case ENEMY_POWER_MPDRAIN:
      power_mpdrain();
      return;
  }
}

function power_enemy_attack() {
  combat.defense_action = "Attack!";
  
  // check miss
  var hit_chance = Math.random();
  if (hit_chance < 0.30) {
    combat.defense_result = "Miss!";
    sounds_play(SFX_MISS);
    return;
  }
  
  var atk_min = enemy.stats[combat.enemy.type].atk_min;
  var atk_max = enemy.stats[combat.enemy.type].atk_max;
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;
  
  // check crit
  // enemy crits add min damage
  var crit_chance = Math.random();
  if (crit_chance < 0.05) {
    attack_damage += atk_min;
    combat.defense_action = "Critical!";
    sounds_play(SFX_CRITICAL);
  }
  else {
    sounds_play(SFX_ATTACK);
  }
  
  // armor absorb
  attack_damage -= info.armors[avatar.armor].def;
  if (attack_damage <= 0) attack_damage = 1;
  
  avatar.hp -= attack_damage;
  combat.defense_result = attack_damage + " damage";
  
  combat.hero_hurt = true;
}
 
function power_heal() {

  if (avatar.mp == 0) return;
  if (avatar.hp == avatar.max_hp) return;

  var heal_amount = Math.floor(avatar.max_hp/2) + Math.floor(Math.random() * avatar.max_hp/2);
  avatar.hp = avatar.hp + heal_amount;
  if (avatar.hp > avatar.max_hp) avatar.hp = avatar.max_hp;

  sounds_play(SFX_HEAL);
  avatar.mp--;
  
  if (gamestate == STATE_COMBAT) {
    combat.offense_action = "Heal!";
    combat.offense_result = "+" + heal_amount + " HP";  
  }
  else if (gamestate == STATE_INFO) {
    info.power_action = "Heal!";
    info.power_result = "+" + heal_amount + " HP";
	avatar_save();
  }
}

function power_fry() {
  if (avatar.mp == 0) return;
  
  combat.offense_action = "Fry!";
  
  var atk_min = (info.weapons[avatar.weapon].atk_min + avatar.bonus_atk);
  var atk_max = (info.weapons[avatar.weapon].atk_max + avatar.bonus_atk);
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;
  
  // against undead, fry does 2x crit
  if (combat.enemy.category == ENEMY_CATEGORY_UNDEAD) {
    attack_damage += atk_max + atk_max;
  }
  // against most creatures fry does 1x crit
  else if (combat.enemy.category != ENEMY_CATEGORY_DEMON) {
    attack_damage += atk_max;
  }
  // against demons, fry does regular weapon damage.

  avatar.mp--;  
  sounds_play(SFX_FIRE);
  
  combat.enemy.hp -= attack_damage;
  combat.offense_result = attack_damage + " damage";
  
  combat.enemy_hurt = true;
  
  if (boss.boneshield_active) {
    boss.boneshield_active = false;  
  }
}

function power_run() {

  combat.offense_action = "Run!";
  sounds_play(SFX_RUN);
  
  var chance_run = Math.random();
  if (chance_run < 0.66) {
    combat.run_success = true;
    combat.offense_result = "";
    return;
  }
  else {
    combat.offense_result = "Blocked!";
    return;  
  }  
}

function power_map_fry() {
  if (avatar.mp == 0) return;
  var fry_target = false;

  // tile 16 (skull pile) fries into tile 5 (dungeon interior)
  
  // don't let the player waste mana if there is no nearby tile to fry
  fry_target = fry_target || power_map_frytile(avatar.x+1, avatar.y);
  fry_target = fry_target || power_map_frytile(avatar.x, avatar.y+1);
  fry_target = fry_target || power_map_frytile(avatar.x-1, avatar.y);
  fry_target = fry_target || power_map_frytile(avatar.x, avatar.y-1);

  if (fry_target) {
    info.power_action = "Fry!";
    info.power_result = "Cleared Path!";
    avatar.mp--;
	sounds_play(SFX_FIRE);
    avatar_save();
  }
  else {
    info.power_action = "(No Target)";
  }
}

function power_map_frytile(x, y) {
  if (mazemap_get_tile(x,y) == 16) {
    fry_target = true;
    mazemap_set_tile(x,y,5);
    mapscript_bone_pile_save(x,y);
    return true;
  }
  return false;
}

function power_hack() {
  if (avatar.mp == 0) return;
  combat.offense_action = "Hack!";
  
  var atk_min = (info.weapons[avatar.weapon].atk_min + avatar.bonus_atk);
  var atk_max = (info.weapons[avatar.weapon].atk_max + avatar.bonus_atk);
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;
  
  // hack can only be cast against Bots so apply the full damage
  attack_damage += atk_max + atk_max;

  avatar.mp--;  
  combat.enemy.hp -= attack_damage;
  combat.offense_result = attack_damage + " damage";
  
  combat.enemy_hurt = true;
  sounds_play(SFX_HACK);

}

function power_map_hack() {
  if (avatar.mp == 0) return;
  var hack_target = false;

  // tile 16 (skull pile) fries into tile 5 (dungeon interior)
  
  // don't let the player waste mana if there is no nearby tile to fry
  hack_target = hack_target || power_map_hacktile(avatar.x+1, avatar.y);
  hack_target = hack_target || power_map_hacktile(avatar.x, avatar.y+1);
  hack_target = hack_target || power_map_hacktile(avatar.x-1, avatar.y);
  hack_target = hack_target || power_map_hacktile(avatar.x, avatar.y-1);

  if (hack_target) {
    info.power_action = "Hack!";
    info.power_result = "Door Opened!";
    avatar.mp--;
    avatar_save();
	sounds_play(SFX_HACK);
  }
  else {
    info.power_action = "(No Target)";
	sounds_play(SFX_BLOCK);
  }
}

function power_map_hacktile(x, y) {
  if (mazemap_get_tile(x,y) == 18) {
    hack_target = true;
    mazemap_set_tile(x,y,3);
    mapscript_locked_door_save(x,y);
    return true;
  }
  return false;
}


// Enemy special powers

// evil enemy version of fry
function power_scorch() {

  combat.defense_action = "Scorch!";
 
  // check miss
  var hit_chance = Math.random();
  if (hit_chance < 0.30) {
    combat.defense_result = "Miss!";
    sounds_play(SFX_MISS);
    return;
  }
  
  sounds_play(SFX_FIRE);

  var atk_min = enemy.stats[combat.enemy.type].atk_min;
  var atk_max = enemy.stats[combat.enemy.type].atk_max;
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;

  // scorch works like an enemy crit
  attack_damage += atk_min;

  // armor absorb
  attack_damage -= info.armors[avatar.armor].def;
  if (attack_damage <= 0) attack_damage = 1;
  
  avatar.hp -= attack_damage;
  combat.defense_result = attack_damage + " damage";
  
  combat.hero_hurt = true;
  
}

function power_hpdrain() {

  combat.defense_action = "HP Drain!";
  
  // check miss
  var hit_chance = Math.random();
  if (hit_chance < 0.30) {
    combat.defense_result = "Miss!";
    sounds_play(SFX_MISS);
    return;
  }
  
  sounds_play(SFX_HPDRAIN);
  
  var atk_min = enemy.stats[combat.enemy.type].atk_min;
  var atk_max = enemy.stats[combat.enemy.type].atk_max;
  var attack_damage = Math.round(Math.random() * (atk_max - atk_min)) + atk_min;
  
  // armor absorb
  attack_damage -= info.armors[avatar.armor].def;
  if (attack_damage <= 0) attack_damage = 1;
  
  avatar.hp -= attack_damage;
  combat.enemy.hp += attack_damage;

  combat.defense_result = attack_damage + " damage";  
  combat.hero_hurt = true;
}

function power_mpdrain() {
  combat.defense_action = "MP Drain!";
  
  // check miss
  var hit_chance = Math.random();
  if (hit_chance < 0.30) {
    combat.defense_result = "Miss!";
    sounds_play(SFX_MISS);
    return;
  }
  
  sounds_play(SFX_MPDRAIN);
  
  if (avatar.mp > 0) {
    avatar.mp--;
    combat.defense_result = "-1 MP";	
  }
  else {
    combat.defense_result = "No effect";	
  }

  combat.hero_hurt = true;
}

