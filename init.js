"use strict";

// Disable some builtin packages
atom.packages.disablePackage("about");
atom.packages.disablePackage("archive-view");
atom.packages.disablePackage("autocomplete-atom-api");
atom.packages.disablePackage("autoflow");
atom.packages.disablePackage("autosave");
atom.packages.disablePackage("background-tips");
atom.packages.disablePackage("link");
atom.packages.disablePackage("metrics");
atom.packages.disablePackage("open-on-github");
atom.packages.disablePackage("spell-check");
atom.packages.disablePackage("update-package-dependencies");
atom.packages.disablePackage("welcome");

// Core configurations
atom.config.set("core.autoHideMenuBar", true);
atom.config.set("core.automaticallyUpdate", false);
atom.config.set("core.closeEmptyWindows", false);
atom.config.set("editor.invisibles.eol", " ");
atom.config.set("editor.scrollPastEnd", true);
atom.config.set("editor.showIndentGuide", true);
atom.config.set("editor.showInvisibles", true);
atom.config.set("editor.tabLength", 4);

require("./moderator");
require("./config");
