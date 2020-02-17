"use strict";

// Disable all keymaps
// for (const p of atom.packages.getLoadedPackages()) {
// 	p.deactivateKeymaps();
// }
// const defaultBindings = atom.keymaps.keyBindings;
// atom.keymaps.keyBindings = [];

// Restore default key bindings not related to this setting
atom.keymaps.add("core:base.cson", {
	".tool-panel.panel-left, .tool-panel.panel-right": {
		"escape": "tool-panel:unfocus",
	},
	"body": {
		"enter": "core:confirm",
		"escape": "core:cancel",
	},
});

function getMode() {
	return document.documentElement.getAttribute("moderator");
}

function applyInputEnabled(editor) {
	switch(getMode()) {
		case "navigate": {
			editor.enableKeyboardInput(false);
			break;
		}
		case "edit": {
			editor.enableKeyboardInput(true);
			break;
		}
	}
}

function setMode(mode) {
	// Cleanup the previous mode's settings
	switch (getMode()) {
		case "navigate": {
			break;
		}
		case "edit": {
			break;
		}
	}

	// Assign attribute
	document.documentElement.setAttribute("moderator", mode);

	// Apply inputEnabled
	for (const editor of atom.workspace.getTextEditors()) {
		applyInputEnabled(editor);
	}

	// Setup the new mode's setttings
	switch (getMode()) {
		case "navigate": {
			break;
		}
		case "edit": {
			break;
		}
	}
}
// Set the initial mode to navigate mode
setMode("navigate");
// Toggle input depending on the current mode
atom.workspace.observeTextEditors((editor) => applyInputEnabled(editor));

const modifiers = {
	ctrl: process.platform !== "darwin" ? "ctrl" : "cmd",
	alt: process.platform !== "darwin" ? "alt" : "ctrl",
}

function bindNavigateKey(source, keymap) {
	for (const [selector, submap] of Object.entries(keymap)) {
		atom.keymaps.add(source, {
			[`[moderator=navigate] ${selector}`]: submap,
		});
	}
}

function bindEditKey(source, keymap) {
	for (const [selector, submap] of Object.entries(keymap)) {
		atom.keymaps.add(source, {
			[`[moderator=edit] ${selector}`]: submap,
		});
	}
}

// List all combinations of key sequences with and without ctrl
function combinate(keymap) {
	const result = {};
	for (const [keys, command] of Object.entries(keymap)) {
		// Ctrl should not be specified as a modifier
		if (keys.includes(modifiers.ctrl)) {
			atom.notifications.addError(`Failed to bind key "${keys}"`, {
				detail: `${modifiers.ctrl} key is not allowed for key binding! : ${keys}, ${command}`,
			});
			continue;
		}

		let combinations = [""];
		for (const k of keys.split(" ")) {
			// Don't modify the key up events
			if (!k.startsWith("^")) {
				combinations = combinations.flatMap((c) => [c + " " + k, c + " " + modifiers.ctrl + "-" + k]);
			}
		}
		for (const c of combinations) {
			result[c.trim()] = command;
		}
	}
	return result;
}

// Create key bindings for all combinations with and without ctrl
// Key sequence without ctrl is excluded, so should be bound manually
function bindKey(source, keymap) {
	for (const [selector, submap] of Object.entries(keymap)) {
		const combinatedMap = combinate(submap);
		bindNavigateKey(source, { [selector]: combinatedMap });
		for (const keys of Object.keys(submap)) {
			delete combinatedMap[keys];
		}
		bindEditKey(source, { [selector]: combinatedMap });
	}
}

// Create key bindings for special keys
// Key sequence without ctrl is not exlucded for special keys
function bindSpecialKey(source, keymap) {
	bindKey(source, keymap);
	bindEditKey(source, keymap);
}

// Register commands
const commands = {
	"moderator:switch-to-navigate-mode": () => setMode("navigate"),
	"moderator:switch-to-edit-mode": () => setMode("edit"),
};
for (const [name, callback] of Object.entries(commands)) {
	atom.commands.add("atom-text-editor", name, callback);
}

// Key bindings for switching modes
atom.keymaps.add("moderator:core", {
	"[moderator=navigate] atom-text-editor": {
		"space": "moderator:switch-to-edit-mode"
	},
	"[moderator=edit] atom-text-editor": {
		[`${modifiers.ctrl}-space`]: "moderator:switch-to-navigate-mode",
	},
});

// Define core key bindings
bindSpecialKey("moderator:core", {
	"body": {
		"up": "core:move-up",
		"down": "core:move-down",
		"left": "core:move-left",
		"right": "core:move-right",
		"shift-up": "core:select-up",
		"shift-down": "core:select-down",
		"shift-left": "core:select-left",
		"shift-right": "core:select-right",
		"pageup": "core:page-up",
		"pagedown": "core:page-down",
		"shift-pageup": "core:select-page-up",
		"shift-pagedown": "core:select-page-down",
		"backspace": "core:backspace",
		"delete": "core:delete",
		"shift-backspace": "core:backspace",
		"shift-delete": "core:delete",
	},
	"atom-text-editor": {
		"home": "editor:move-to-first-character-of-line",
		"end": "editor:move-to-end-of-screen-line",
		"shift-home": "editor:select-to-first-character-of-line",
		"shift-end": "editor:select-to-end-of-line",
	},
});

// Define edit mode only key bindings
bindEditKey("moderator:edit", {
	"atom-text-editor:not([mini])": {
		"enter": "editor:newline",
		"tab": "editor:indent",
		"shift-tab": "editor:outdent-selected-rows",
	},
});

// Define basic key bindings
bindKey("moderator:core", {
	"body": {
		"c": "pane:show-previous-item",
		"m": "pane:show-next-item",
		"shift-C": "pane:move-item-left",
		"shift-M": "pane:move-item-right",
	}
});
bindKey("moderator:navigate", {
	"body": {
		"e": "core:move-up",
		"d": "core:move-down",
		"s": "core:move-left",
		"f": "core:move-right",
		"i": "core:move-up",
		"k": "core:move-down",
		"j": "core:move-left",
		"l": "core:move-right",
		"shift-E": "core:select-up",
		"shift-D": "core:select-down",
		"shift-S": "core:select-left",
		"shift-F": "core:select-right",
		"shift-I": "core:select-up",
		"shift-K": "core:select-down",
		"shift-J": "core:select-left",
		"shift-L": "core:select-right",
		"q": "core:save",
		"p": "core:save",
		"-": "core:close",
		"_": "pane:reopen-closed-item",
		"=": "application:new-file",
		"+": "application:new-window",
		// [`${modifiers.alt}-e`]: "core:page-up",
		// [`${modifiers.alt}-s`]: "core:page-down",
		// [`${modifiers.alt}-i`]: "core:page-up",
		// [`${modifiers.alt}-k`]: "core:page-down",
		// [`${modifiers.alt}-shift-E`]: "core:select-page-up",
		// [`${modifiers.alt}-shift-S`]: "core:select-page-down",
		// [`${modifiers.alt}-shift-I`]: "core:select-page-up",
		// [`${modifiers.alt}-shift-K`]: "core:select-page-down",
	},
});
bindKey("moderator:edit", {
	"body": {
		"w": "core:backspace",
		"o": "core:delete",
		"u": "core:undo",
		"r": "core:redo",
		"t": "core:copy",
		"shift-T": "core:cut",
		"y": "core:paste",
	},
	"atom-workspace atom-workspace:not([mini])": {
		"/": "editor:toggle-line-comments",
	}
});

// TODO: editor:select-larger-syntax-node
// TODO: editor:select-smaller-syntax-node
// TODO: editor:delete-line
// TODO: tool-panel:unfocus - escape
// TODO: editor:consolidate-selections - escape

module.exports = { bindKey };
