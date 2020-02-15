const apm = require("../apm");

atom.config.set("core.themes", ["seti-ui", "monokai-remagpie"]);

apm.activate("seti-ui", {
	compactView: true,
	fileIcons: false,
	hideProjectTab: true,
});
apm.activate("monokai-remagpie");
apm.activate("file-icons");
