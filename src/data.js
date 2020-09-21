const PATHS = {
	"Help": "/community/forums/5",
	"Resolved": "/community/forums/29",
	"Confirmed": "/community/forums/101",
	"Development": "/community/forums/2",
};

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
		"spike",
		"spiking",
		"stutter",
		"stutters",
		"stuttering",
		"freeze",
		"freezes",
		"freezing",
		"fps",
		"frame",
		"frames",
		"framerate",
	],
	"skins": [
		"skin",
		"skins",
		"skinning",
		"UI",
		"interface",
		"Interface",
	],
	"score": [
		"score",
		"scores",
		"ranking",
		"rankings",
	],
	"McOsu": ["McOsu"],
	"OBS": ["OBS"],
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
		"crashed",
		"crashes",
		"exception",
		"closed",
		"closes",
		"bluescreen",
		"blue screen",
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
	],
	"audio": [
		"audio",
		"sound",
	],
	"igpu": [
		"icd",
		"intel",
	],
	"Bancho": [
		"Bancho",
		"server",
	]
});

function tags(object) {
	let entries = Object.entries(object);
	let expression = (([tag, keys]) =>
		[tag, new RegExp(`\\b(${keys.join("|")})\\b`, "i")])
	return entries.map(expression);
}

function setEnabled(key, enabled) {
	let result = enabled ?
		browser.storage.sync.set({[key]: true}) :
		browser.storage.sync.remove(key);
	result.catch(console.error);
}

async function isEnabled(key) {
	let enabled = browser.storage.sync.get({[key]: false});
	return (await enabled)[key];
}
