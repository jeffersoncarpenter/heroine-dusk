/*
 Action menu for combat or casting spells out of combat
 */

var BUTTON_SIZE = 16;
var SELECT_SIZE = 20;
var BUTTON_OFFSET = 2;

var BUTTON_POS_INFO = {x:140, y:0, w:20, h:20};
var BUTTON_POS_ATTACK = {x:120, y:20, w:20, h:20};
var BUTTON_POS_RUN = {x:140, y:20, w:20, h:20};
var BUTTON_POS_HEAL = {x:120, y:40, w:20, h:20};
var BUTTON_POS_FRY = {x:140, y:40, w:20, h:20};
var BUTTON_POS_HACK = {x:120, y:60, w:20, h:20};
var BUTTON_POS_LED = {x:140, y:60, w:20, h:20};
var BUTTON_POS_FREEZE = {x:120, y:80, w:20, h:20};
var BUTTON_POS_FORK_COIN = {x:140, y:80, w:20, h:20};


var action = new Object();

action.button_img = new Image();
action.button_img_loaded = false;
action.select_img = new Image();
action.select_img_loaded = false;

action.select_pos = BUTTON_POS_INFO;



/**** Initialize ***************/
function action_init() {

  action.button_img.src = "images/interface/action_buttons.png";
  action.button_img.onload = function() {action_button_onload();};
  action.select_img.src = "images/interface/select.png";
  action.select_img.onload = function() {action_select_onload();};
}

function action_button_onload() {action.button_img_loaded = true;}
function action_select_onload() {action.select_img_loaded = true;}

/**** Logic functions ***************/

function action_logic() {
  action_logic_moveselect();
}

// check an action by the button location
function action_checkuse(check_pos) {

  // option 1: mouse click
  if (pressing.mouse && !input_lock.mouse && isWithin(mouse_pos, check_pos)) {
	input_lock.mouse = true;
    return true;
  }

  // option 2: action button
  if (pressing.action && !input_lock.action && action.select_pos == check_pos) {
    input_lock.action = true;
    return true;
  }

  return false;
}

/**
 * Use the arrowkeys to move the selection cursor
 * The complexity here comes from two factors: 
 * 1. This menu is used in COMBAT and INFO context, with Fight/Run only being combat buttons
 * 2. Spells are unlockable (in order) so we have to skip unknown spells
 */
function action_logic_moveselect() {

  // skip if no directions are being pressed
  if (!pressing.up && !pressing.left && !pressing.right && !pressing.down) return;

  // currently on the info button
  if (action.select_pos == BUTTON_POS_INFO) {
    if (pressing.down && !input_lock.down) {
      if (avatar.spellbook >= 1) {
        action.select_pos = BUTTON_POS_HEAL;
        input_lock.down = true;
        redraw = true;
        return;
      }
    }
  }

  // currently on the attack button
  else if (action.select_pos == BUTTON_POS_ATTACK) {
    if (pressing.right && !input_lock.right) {
      action.select_pos = BUTTON_POS_RUN;
      input_lock.right = true;
      redraw = true;
      return;
    }
    else if (pressing.down && !input_lock.down) {
      if (avatar.spellbook >= 1) {
        action.select_pos = BUTTON_POS_HEAL;
        input_lock.down = true;
        redraw = true;
        return;
      }
    }
  }

  // currently on the run button
  else if (action.select_pos == BUTTON_POS_RUN) {
    if (pressing.left && !input_lock.left) {
      action.select_pos = BUTTON_POS_ATTACK;
      input_lock.left = true;
      redraw = true;
      return;
    }
    else if (pressing.down && !input_lock.down) {
      if (avatar.spellbook >= 2) {
        action.select_pos = BUTTON_POS_FRY;
        input_lock.down = true;
        redraw = true;
        return;
      }
    }

  }

  // currently on the heal button
  else if (action.select_pos == BUTTON_POS_HEAL) {
    if (pressing.up && !input_lock.up) {
      if (gamestate == STATE_COMBAT) {
        action.select_pos = BUTTON_POS_ATTACK;
        input_lock.up = true;
        redraw = true;
        return;
      }
      else if (gamestate == STATE_INFO) {
        action.select_pos = BUTTON_POS_INFO;
        input_lock.up = true;
        redraw = true;
        return;
      }
    }
    else if (pressing.right && !input_lock.right) {
      if (avatar.spellbook >= 2) {
        action.select_pos = BUTTON_POS_FRY;
        input_lock.right = true;
        redraw = true;
        return;
      }
    }
    else if (pressing.down && !input_lock.down) {
      if (avatar.spellbook >= 3) {
        action.select_pos = BUTTON_POS_HACK;
        input_lock.down = true;
        redraw = true;
        return;
      }
    }
  }

  // currently on the fry button
  else if (action.select_pos == BUTTON_POS_FRY) {
    if (pressing.up && !input_lock.up) {
      if (gamestate == STATE_COMBAT) {
        action.select_pos = BUTTON_POS_RUN;
        input_lock.up = true;
        redraw = true;
        return;
      }
      else if (gamestate == STATE_INFO) {
        action.select_pos = BUTTON_POS_INFO;
        input_lock.up = true;
        redraw = true;
        return;
      }
    }
    else if (pressing.left && !input_lock.left) {
      action.select_pos = BUTTON_POS_HEAL;
      input_lock.left = true;
      redraw = true;
      return;
    }
    else if (pressing.down && !input_lock.down) {
      if (avatar.spellbook >= 4) {
        action.select_pos = BUTTON_POS_LED;
        input_lock.down = true;
        redraw = true;
        return;
      }
    }
  }

  // currently on the hack button
  else if (action.select_pos == BUTTON_POS_HACK) {
    if (pressing.up && !input_lock.up) {
      action.select_pos = BUTTON_POS_HEAL;
      input_lock.up = true;
      redraw = true;
      return;
    }
    else if (pressing.right && !input_lock.right) {
      if (avatar.spellbook >= 4) {
        action.select_pos = BUTTON_POS_LED;
        input_lock.right = true;
        redraw = true;
        return;
      }
    }
    else if (pressing.down && !input_lock.down) {
      if (avatar.spellbook >= 5) {
        action.select_pos = BUTTON_POS_FREEZE;
        input_lock.down = true;
        redraw = true;
        return;
      }
    }
  }

  // currently on the led button
  else if (action.select_pos == BUTTON_POS_LED) {
    if (pressing.up && !input_lock.up) {
      action.select_pos = BUTTON_POS_FRY;
      input_lock.up = true;
      redraw = true;
      return;
    }
    else if (pressing.left && !input_lock.left) {
      action.select_pos = BUTTON_POS_HACK;
      input_lock.left = true
      redraw = true;
      return;
    }
    else if (pressing.down && !input_lock.down) {
      if (avatar.spellbook >= 6) {
        action.select_pos = BUTTON_POS_FORK_COIN;
        input_lock.down = true;
        redraw = true;
        return;
      }
    }
  }

  // currently on the freeze button
  else if (action.select_pos == BUTTON_POS_FREEZE) {
    if (pressing.up && !input_lock.up) {
      action.select_pos = BUTTON_POS_HACK;
      input_lock.up = true;
      redraw = true;
      return;
    }
    else if (pressing.right && !input_lock.right) {
      if (avatar.spellbook >= 6) {
        action.select_pos = BUTTON_POS_FORK_COIN;
        input_lock.right = true;
        redraw = true;
        return;
      }
    }
  }

  // currently on the fork coin button
  else if (action.select_pos == BUTTON_POS_FORK_COIN) {
    if (pressing.up && !input_lock.up) {
      action.select_pos = BUTTON_POS_LED;
      input_lock.up = true;
      redraw = true;
      return;
    }
    else if (pressing.left && !input_lock.left) {
      action.select_pos = BUTTON_POS_FREEZE;
      input_lock.left = true
      redraw = true;
      return;
    }
  }

}


/**** Render functions ***************/
function action_render() {

  if (!action.button_img_loaded) return;

  // if in combat, show fight and run
  if (gamestate == STATE_COMBAT) {
    action_render_button(0, BUTTON_POS_ATTACK);
    action_render_button(1, BUTTON_POS_RUN);
  }


  // show spells
  if (avatar.spellbook >= 1) action_render_button(2, BUTTON_POS_HEAL);
  if (avatar.spellbook >= 2) action_render_button(3, BUTTON_POS_FRY);
  if (avatar.spellbook >= 3) action_render_button(4, BUTTON_POS_HACK);
  if (avatar.spellbook >= 4) action_render_button(5, BUTTON_POS_LED);
  if (avatar.spellbook >= 5) action_render_button(6, BUTTON_POS_FREEZE);
  if (avatar.spellbook >= 6) action_render_button(7, BUTTON_POS_FORK_COIN);

  action_render_select(action.select_pos);
  
}

function action_render_button(id, pos) {
  ctx.drawImage(
    action.button_img,
    id * BUTTON_SIZE * PRESCALE,
    0,
    BUTTON_SIZE * PRESCALE,
    BUTTON_SIZE * PRESCALE,	
    (pos.x + BUTTON_OFFSET) * SCALE,
    (pos.y + BUTTON_OFFSET) * SCALE,
    BUTTON_SIZE * SCALE,
    BUTTON_SIZE * SCALE
  );
}

function action_render_select(pos) {
  if (!action.select_img_loaded) return;
  ctx.drawImage(
    action.select_img,
    0,
    0,
    SELECT_SIZE * PRESCALE,
    SELECT_SIZE * PRESCALE,	
    pos.x * SCALE,
    pos.y * SCALE,
    SELECT_SIZE * SCALE,
    SELECT_SIZE * SCALE
  );
}

