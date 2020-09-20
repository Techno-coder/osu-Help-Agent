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
		"stuttering",
		"freeze",
		"freezing",
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
		"mapping",
	],
	"compatibility": ["compatibility"],
	"tablet": [
		"tablet",
		"hawku",
	],
	"taiko": ["taiko"],
	"mania": ["mania"],
	"supporter": ["supporter"],
	"crash": [
		"crash",
		"crashes",
		"exception",
		"closes",
		"BSOD",
	],
	"error": [
		"error",
		"glitch",
	],
	"discord": ["discord"],
	"linux": [
		"linux",
		"ubuntu",
		"arch",
		"mint",
	],
	"account": ["account"],
	"installation": [
		"install",
		"installing",
		"installation",
	]
});

function tags(object) {
	let entries = Object.entries(object);
	let expression = (([tag, keys]) =>
		[tag, new RegExp(`\\b(${keys.join("|")})\\b`, "i")])
	return entries.map(expression);
}
