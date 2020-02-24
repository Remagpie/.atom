"use strict";

// Disable all keymaps
for (const p of atom.packages.getLoadedPackages()) {
	p.deactivateKeymaps();
}
const defaultBindings = atom.keymaps.keyBindings;
atom.keymaps.keyBindings = [];

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

require("./core");
require("./edit");
require("./move");

require("./misc");
