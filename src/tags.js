const TAGS = tags({
	"macOS": [
		"OSX",
		"mac",
		"macOS",
		"Catalina",
		"Wineskin",
	],
	"windows": ["Windows"],
	"lazer": [
		"laser",
		"lazer",
	],
	"pp": ["pp"],
	"performance": [
		"lag",
		"lags",
		"fps",
		"stutter",
		"stutters",
		"frame",
		"frames",
		"framerate",
	],
	"skins": ["skin"],
	"score": [
		"score",
		"scores",
		"ranking",
		"rankings",
	],
	"McOsu": ["McOsu"],
	"editor": [
		"editor",
		"editing",
	],
	"compatibility": ["compatibility"],
	"tablet": [
		"tablet",
		"hawku",
	],
	"taiko": ["taiko"],
	"supporter": ["supporter"],
	"crash": [
		"crash",
		"crashes",
		"exception",
		"BSOD",
	],
	"error": [
		"error",
		"glitch",
	]
});

function tags(object) {
	let entries = Object.entries(object);
	let expression = (([tag, keys]) =>
		[tag, new RegExp(`\\b(${keys.join("|")})\\b`, "i")])
	return entries.map(expression);
}
