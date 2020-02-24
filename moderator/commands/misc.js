const { bindKey } = require("../core");

// Define basic key bindings
bindKey("moderator:edit", {
	"body": {
		"u": "core:undo",
		"r": "core:redo",
		"t": "core:copy",
		"shift-T": "core:cut",
		"y": "core:paste",
	},
	"atom-text-editor:not([mini])": {
		"/": "editor:toggle-line-comments",
	}
});
bindKey("moderator:pane", {
	"body": {
		"c": "pane:show-previous-item",
		"m": "pane:show-next-item",
		"shift-C": "pane:move-item-left",
		"shift-M": "pane:move-item-right",
	}
});
bindKey("moderator:misc", {
	"body": {
		"p": "core:save",
		"-": "core:close",
		"_": "pane:reopen-closed-item",
		"=": "application:new-file",
		"+": "application:new-window",
	},
});
