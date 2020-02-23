"use strict";

const { keystat } = require("../keystat");

function initializeEditor(editor) {
	switch(document.documentElement.getAttribute("moderator")) {
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
	// Assign attribute
	document.documentElement.setAttribute("moderator", mode);

	// Initialize the editors
	atom.workspace.getTextEditors().forEach(initializeEditor);

	// Setup the new mode's setttings
	switch (mode) {
		case "navigate": {
			const editor = atom.workspace.getActiveTextEditor();
			if (editor != null) {
				atom.commands.dispatch(editor.element, "autocomplete-plus:cancel");
			}
			break;
		}
		case "edit": {
			break;
		}
	}
}

// Translate the modifiers of the key sequences
function translate(keys) {
	let result = keys;
	// Replace the modifiers with the placeholders
	result = result.replace("ctrl", "!CTRL!");
	result = result.replace("alt", "!ALT!");

	// Derive the modifier keys for this platform
	let ctrl, alt;
	switch (process.platform) {
		case "darwin": {
			ctrl = "cmd";
			alt = "ctrl";
			break;
		}
		default: {
			ctrl = "ctrl";
			alt = "alt";
			break;
		}
	}

	// Fill in the placeholders
	result = result.replace("!CTRL!", ctrl);
	result = result.replace("!ALT!", alt);

	return result;
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

// Create key bindings for all combinations with and without ctrl
// Key sequence without ctrl is excluded, so should be bound manually
function bindKey(source, keymap) {
	let combinatedMap = {};
	for (const [selector, submap] of Object.entries(keymap)) {
		combinatedMap[selector] = {};
		for (const [keys, command] of Object.entries(submap)) {
			let combinations = [""];
			for (const k of keys.split(" ")) {
				// Don't modify the key up events
				if (k.startsWith("^")) {
					continue;
				}
				combinations = combinations.flatMap((c) => [c + " " + k, c + " " + "ctrl-" + k]);
			}
			for (const c of combinations) {
				combinatedMap[selector][translate(c.trim())] = command;
			}
		}
	}
	bindNavigateKey(source, combinatedMap);
	for (const [selector, submap] of Object.entries(keymap)) {
		for (const keys of Object.keys(submap)) {
			delete combinatedMap[selector][translate(keys)];
		}
	}
	bindEditKey(source, combinatedMap);
}

// Create key bindings for special keys
// Key sequence without ctrl is not exlucded for special keys
function bindSpecialKey(source, keymap) {
	bindKey(source, keymap);
	bindEditKey(source, keymap);
}

// Helper function for creating commands with custom modifiers
function createCommand(keymap) {
	return (event) => {
		const { target, detail } = event;

		// Check the modifier keys
		const gh = keystat.get("KeyG") || keystat.get("KeyH");
		const vn = keystat.get("KeyV") || keystat.get("KeyN");

		// TODO: Sort the selectors by specificity
		for (const [selector, submap] of Object.entries(keymap)) {
			// Skip the submap if the selector doesn't match
			if (target.closest(selector) == null) {
				continue;
			}

			let command;
			if (gh) {
				command = submap["gh"];
			}
			else if (vn) {
				command = submap["vn"];
			}
			else {
				command = submap["this"];
			}
			if (command != null) {
				atom.commands.dispatch(target, command, detail);
				return;
			}
		}
	}
}

// Set the initial mode to navigate mode
setMode("navigate");
// Toggle input depending on the current mode
atom.workspace.observeTextEditors(initializeEditor);

module.exports = {
	bindKey,
	bindSpecialKey,
	bindEditKey,
	bindNavigateKey,
	createCommand,
	setMode,
	translate,
};
