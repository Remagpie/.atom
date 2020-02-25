"use strict";

const apm = require("../apm");
const { bindKey, bindSpecialKey } = require("../moderator/core");

apm.activate("minimap", {
	displayPluginsControls: false,
});
apm.activate("minimap-selection", {
	highlightCursorsLines: true,
	outlineSelection: true,
});
apm.activate("minimap-find-and-replace");
apm.activate("minimap-git-diff");
apm.activate("minimap-highlight-selected");
