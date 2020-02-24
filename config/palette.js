"use strict";

const apm = require("../apm");
const { bindKey, bindSpecialKey, createCommand } = require("../moderator/core");

apm.activate("command-palette");
apm.activate("fuzzy-finder", {
	scoringSystem: "alternate",
});
atom.commands.add("body", "custom:toggle-palette", createCommand({
	"body": {
		"this": "command-palette:toggle",
		"gh": "fuzzy-finder:toggle-buffer-finder",
		"vn": "fuzzy-finder:toggle-file-finder",
	},
}));

bindKey("custom", {
	"body": {
		"b": "custom:toggle-palette",
	},
});
