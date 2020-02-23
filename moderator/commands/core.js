"use strict";

const { setMode, translate } = require("../core");

// Register commands
atom.commands.add("atom-text-editor", "moderator:switch-to-navigate-mode", () => {
	setMode("navigate");
});
atom.commands.add("atom-text-editor", "moderator:switch-to-edit-mode", () => {
	setMode("edit");
});

// Key bindings for switching modes
atom.keymaps.add("moderator:core", {
	"[moderator=navigate]": {
		[translate("space")]: "moderator:switch-to-edit-mode",
	},
	// TODO: remove atom-text-editor
	"[moderator=edit] atom-text-editor": {
		[translate("ctrl-space")]: "moderator:switch-to-navigate-mode",
	},
});
