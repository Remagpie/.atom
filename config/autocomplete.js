"use strict";

const apm = require("../apm");

apm.activate("autocomplete-plus");
atom.keymaps.add("autocomplete-plus", {
	"[moderator=edit] atom-text-editor.autocomplete-active": {
		"escape": "autocomplete-plus:cancel",
		"tab": "autocomplete-plus:confirm",
		"enter": "autocomplete-plus:confirm",
	},
});
