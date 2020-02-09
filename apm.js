"use strict";

const { BufferedProcess } = require("atom");
const fs = require("fs").promises;
const path = require("path");

function isObject(val) {
	return (typeof val === "object") && val !== null;
}

// Execute apm command. Turns off the color by default.
async function apm(...args) {
	let output = "";
	let error = "";
	let resolve, reject;
	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});
	new BufferedProcess({
		command: atom.packages.getApmPath(),
		args: ["--no-color", ...args],
		stdout: (o) => { output += o; },
		stderr: (e) => { error += e; },
		exit: (code) => {
			if (code === 0) {
				resolve(output);
			}
			else {
				reject(error);
			}
		},
	});
	return promise;
}

const installing = new Map();
async function install(name, parents = []) {
	// Just enable the package if it's already installed
	if (atom.packages.getAvailablePackageNames().includes(name)) {
		atom.packages.enablePackage(name);
	}
	else {
		// Wait for the completion if it's already installing
		if (installing.has(name)) {
			await installing.get(name);
		}
		// Install the package
		else {
			let resolve, reject;
			installing.set(name, new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			}));
			try {
				// Show notification
				const message = `Installing "${name}"`;
				const detail = `Required by ${parents.join(" > ")}`;
				const notification = atom.notifications.addInfo(message, {
					detail,
					dismissable: true,
				});
				// Execute apm
				await apm("install", name, "--color");

				// Cleanup the environment
				notification.dismiss();
				resolve();
				installing.delete(name);

				// Find the package path and load package.json
				let metadata;
				for (const dir of atom.packages.getPackageDirPaths()) {
					const packages = await fs.readdir(dir);
					if (packages.includes(name)) {
						metadata = require(path.join(dir, name));
						break;
					}
				}

				// Refresh theme list if the package is theme package
				if (Object.keys(metadata).includes("theme")) {
					atom.themes.activateThemes();
				}

				// Install the dependencies
				metadata["package-deps"].forEach((p) => install(p, [...parents, name]));
			}
			catch (e) {
				apm.notifications.addError(`Failed to install "${name}"`, {
					detail: e,
				});
				reject();
				installing.delete(name);
			}
		}
	}
}

function configure(key, scope, config) {
	if (isObject(config)) {
		for (const [k, v] of Object.entries(config)) {
			configure(key + "." + k, scope, v);
		}
	}
	else {
		atom.config.set(key, config, {
			scopeSelector: scope !== "*" ? scope : undefined,
		});
	}
}

async function activate(name, config) {
	await install(name);
	configure(name, "*", config);
}

module.exports = {
	activate,
	configure,
	install,
};
