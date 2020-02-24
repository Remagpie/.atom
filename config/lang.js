"use strict";

const apm = require("../apm");

apm.activate("language-javascript");
apm.configure("editor", ".js.source", {
	tabLength: 2,
});
