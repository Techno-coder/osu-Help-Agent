function select(identifier, all) {
	let container = document.getElementById(identifier);
	container.querySelectorAll("input")
		.forEach((node) => {
			node.checked = all;
			node.dispatchEvent(new Event("change"));
		});
}

document.getElementById("enable-all").onclick = () => select("enable", true);
document.getElementById("enable-none").onclick = () => select("enable", false);
document.getElementById("color-all").onclick = () => select("color", true);
document.getElementById("color-none").onclick = () => select("color", false);

function populate(identifier, items) {
	let element = document.getElementById(identifier);
	items.forEach(([name, key]) => {
		let node = document.createElement("label");
		let box = document.createElement("input");

		isEnabled(key).then((enabled) => box.checked = enabled);
		box.onchange = (event) => setEnabled(key, event.target.checked);
		box.type = "checkbox";

		node.append(box);
		node.append(name);
		element.append(node);
	})
}

populate("enable", Object.entries(PATHS));
populate("color", TAGS.map(([key, _]) => key)
	.sort().map((key) => [key, key]));
