const { bindKey, bindEditKey, bindSpecialKey, createCommand } = require("../core");

atom.commands.add("body", "moderator:backspace", createCommand({
	"body": {
		"this": "core:backspace",
	},
	"atom-text-editor": {
		"gh": "editor:delete-line",
		"vn": "editor:delete-to-beginning-of-word",
	},
}));

atom.commands.add("body", "moderator:delete", createCommand({
	"body": {
		"this": "core:delete",
	},
	"atom-text-editor": {
		"gh": "editor:delete-line",
		"vn": "editor:delete-to-end-of-word",
	},
}));

bindSpecialKey("moderator:edit", {
	"body": {
		"backspace": "moderator:backspace",
		"delete": "moderator:delete",
		"shift-backspace": "moderator:backspace",
		"shift-delete": "moderator:delete",
	},
});
bindKey("moderator:edit", {
	"body": {
		"w": "moderator:backspace",
		"o": "moderator:delete",
	},
});
bindEditKey("moderator:edit", {
	"atom-text-editor:not([mini])": {
		"enter": "editor:newline",
		"tab": "editor:indent",
		"shift-tab": "editor:outdent-selected-rows",
	},
});
