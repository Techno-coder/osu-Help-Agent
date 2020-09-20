const REQUEST_DELAY = 1000;
const TAG_THRESHOLD = 8;

let currentAddress = window.location.href;
let requestCount = 0;

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

async function fetchPage(link, date) {
	let cache = await browser.storage.local.get(link);
	if (link in cache && date === cache[link].date)
		return cache[link].data;

	++requestCount;
	await delay((requestCount - 1) * REQUEST_DELAY);
	let response = await fetch(link, {credentials: "omit"});
	let data = await response.text();
	--requestCount;

	let setCache = {[link]: {date: date, data: data}};
	await browser.storage.local.set(setCache);
	return data;
}

async function load(entry) {
	let date = entry.querySelector("time").dateTime;
	let title = entry.querySelector(".forum-topic-entry__title");
	let link = title.getAttribute("href");

	let loader = document.createElement("span");
	loader.classList.add("agent-tag-loader");
	loader.textContent = "loading";
	title.after(loader);

	let data = await fetchPage(link, date);
	let page = new DOMParser().parseFromString(data, "text/html");
	let tags = collectTags(title, page);

	tags.length = Math.min(tags.length, TAG_THRESHOLD);
	if (tags.length === 0) {
		loader.textContent = "none";
		return;
	}

	loader.remove();
	tags.forEach((name) => {
		let tag = document.createElement("span");
		tag.style.backgroundColor = stringColor(name);
		tag.classList.add("agent-tag");
		tag.textContent = name;
		title.after(tag);
	});
}

function stringColor(string) {
	let hash = 0;
	for (let character of string)
		hash = character.charCodeAt(0) + ((hash << 5) - hash);
	return `hsl(${hash % 360}, 100%, 40%)`;
}

function collectTags(title, page) {
	let posts = Array.from(page.querySelectorAll(".forum-post__body"))
		.filter((post) => post.querySelector(".forum-user-badge") != null);
	let nodes = posts.map((post) => post.querySelector(".forum-post-content"));
	let content = title.innerText + nodes.map((node) => node.innerText).join();
	let filter = (([_, matcher]) => matcher.test(content));
	return TAGS.filter(filter).map(([tag, _]) => tag);
}

function loadAll() {
	let nodes = document.querySelectorAll("[class^=agent-tag]");
	nodes.forEach((node) => node.remove());

	// TODO: Remove old cache entries
	let entries = document.querySelectorAll(".forum-topic-entry");
	Promise.all(Array.from(entries).map(load)).done();
}

let observer = new MutationObserver((mutations) => {
	let after = (event) =>
		event.nextSibling?.outerHTML?.includes("favicon") ||
		event.previousSibling?.outerHTML?.includes("favicon");

	if (!mutations.some(after)) return;
	if (window.location.href === currentAddress) return;
	currentAddress = window.location.href;
	loadAll();
});

let selector = document.querySelector("head");
observer.observe(selector, {childList: true});
loadAll();
