const { bindKey, bindSpecialKey, createCommand } = require("../core");

function moveHalfPageUp() {
	const editor = atom.workspace.getActiveTextEditor();
	const rows = Math.ceil(editor.getRowsPerPage() / 2);
	editor.moveUp(rows);
}

function moveHalfPageDown() {
	const editor = atom.workspace.getActiveTextEditor();
	const rows = Math.ceil(editor.getRowsPerPage() / 2);
	editor.moveDown(rows);
}

function selectHalfPageUp() {
	const editor = atom.workspace.getActiveTextEditor();
	const rows = Math.ceil(editor.getRowsPerPage() / 2);
	editor.selectUp(rows);
}

function selectHalfPageDown() {
	const editor = atom.workspace.getActiveTextEditor();
	const rows = Math.ceil(editor.getRowsPerPage() / 2);
	editor.selectDown(rows);
}

atom.commands.add("atom-text-editor", "moderator:half-page-up", moveHalfPageUp);
atom.commands.add("atom-text-editor", "moderator:select-half-page-up", selectHalfPageUp);
atom.commands.add("atom-text-editor", "moderator:half-page-down", moveHalfPageDown);
atom.commands.add("atom-text-editor", "moderator:select-half-page-down", selectHalfPageDown);

atom.commands.add("body", "moderator:move-up", createCommand({
	"body": {
		"this": "core:move-up",
		"gh": "core:page-up",
		"vn": "moderator:half-page-up",
	},
}));

atom.commands.add("body", "moderator:move-down", createCommand({
	"body": {
		"this": "core:move-down",
		"gh": "core:page-down",
		"vn": "moderator:half-page-down",
	},
}));

atom.commands.add("body", "moderator:move-left", createCommand({
	"body": {
		"this": "core:move-left",
	},
	"atom-text-editor": {
		"gh": "editor:move-to-first-character-of-line",
		"vn": "editor:move-to-beginning-of-word",
	}
}));

atom.commands.add("body", "moderator:move-right", createCommand({
	"body": {
		"this": "core:move-right",
	},
	"atom-text-editor": {
		"gh": "editor:move-to-end-of-screen-line",
		"vn": "editor:move-to-end-of-word",
	},
}));

atom.commands.add("body", "moderator:select-up", createCommand({
	"body": {
		"this": "core:select-up",
		"gh": "core:select-page-up",
		"vn": "moderator:select-half-page-up",
	},
}));

atom.commands.add("body", "moderator:select-down", createCommand({
	"body": {
		"this": "core:select-down",
		"gh": "core:select-page-down",
		"vn": "moderator:select-half-page-down",
	},
}));

atom.commands.add("body", "moderator:select-left", createCommand({
	"body": {
		"this": "core:select-left",
	},
	"atom-text-editor": {
		"gh": "editor:select-to-first-character-of-line",
		"vn": "editor:select-to-beginning-of-word",
	}
}));

atom.commands.add("body", "moderator:select-right", createCommand({
	"body": {
		"this": "core:select-right",
	},
	"atom-text-editor": {
		"gh": "editor:select-to-end-of-line",
		"vn": "editor:select-to-end-of-word",
	},
}));

bindSpecialKey("moderator:move", {
	"body": {
		"up": "moderator:move-up",
		"down": "moderator:move-down",
		"left": "moderator:move-left",
		"right": "moderator:move-right",
		"shift-up": "moderator:select-up",
		"shift-down": "moderator:select-down",
		"shift-left": "moderator:select-left",
		"shift-right": "moderator:select-right",
		"pageup": "core:page-up",
		"pagedown": "core:page-down",
		"shift-pageup": "core:select-page-up",
		"shift-pagedown": "core:select-page-down",
	},
	"atom-text-editor": {
		"home": "editor:move-to-first-character-of-line",
		"end": "editor:move-to-end-of-screen-line",
		"shift-home": "editor:select-to-first-character-of-line",
		"shift-end": "editor:select-to-end-of-line",
	},
});

bindKey("moderator:move", {
	"body": {
		"e": "moderator:move-up",
		"d": "moderator:move-down",
		"s": "moderator:move-left",
		"f": "moderator:move-right",
		"i": "moderator:move-up",
		"k": "moderator:move-down",
		"j": "moderator:move-left",
		"l": "moderator:move-right",
		"shift-E": "moderator:select-up",
		"shift-D": "moderator:select-down",
		"shift-S": "moderator:select-left",
		"shift-F": "moderator:select-right",
		"shift-I": "moderator:select-up",
		"shift-K": "moderator:select-down",
		"shift-J": "moderator:select-left",
		"shift-L": "moderator:select-right",
	},
});
