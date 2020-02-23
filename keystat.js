let keystat = new Map();
document.body.addEventListener("keydown", (e) => { keystat.set(e.code, true); });
document.body.addEventListener("keyup", (e) => { keystat.set(e.code, false); });

module.exports = { keystat };
