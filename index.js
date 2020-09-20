const EXPIRED = "EPOCH_EXPIRY";
const REQUEST_DELAY = 1000;
const TAG_THRESHOLD = 8;

let currentAddress = window.location.href;
let requestCount = 0;
let loadEpoch = 0;

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

async function fetchPage(epoch, link) {
	++requestCount;
	await delay((requestCount - 1) * REQUEST_DELAY);
	if (epoch !== loadEpoch) throw new Error(EXPIRED);
	let response = await fetch(link, {credentials: "omit"});
	let data = await response.text();
	--requestCount;
	return data;
}

async function pageContent(link, date) {
	let cache = await browser.storage.local.get(link);
	if (link in cache && date === cache[link].date)
		return cache[link].content;

	let data = await fetchPage(loadEpoch, link);
	let page = new DOMParser().parseFromString(data, "text/html");
	let posts = Array.from(page.querySelectorAll(".forum-post__body"))
		.filter((post) => post.querySelector(".forum-user-badge") != null);
	let nodes = posts.map((post) => post.querySelector(".forum-post-content"));
	let content = nodes.map((node) => node.innerText).join();

	let setCache = {[link]: {date: date, content: content}};
	await browser.storage.local.set(setCache)
		.catch(() => browser.storage.local.clear());
	return content;
}

async function load(entry) {
	let date = entry.querySelector("time").dateTime;
	let title = entry.querySelector(".forum-topic-entry__title");
	let link = title.getAttribute("href");

	let loader = document.createElement("span");
	loader.classList.add("agent-tag-loader");
	loader.textContent = "loading";
	title.after(loader);

	let content = await pageContent(link, date);
	let filter = (([_, matcher]) => matcher.test(content));
	let tags = TAGS.filter(filter).map(([tag, _]) => tag);
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

function loadAll() {
	document.querySelectorAll("[class^=agent-tag]")
		.forEach((node) => node.remove());

	let entries = document.querySelectorAll(".forum-topic-entry");
	Promise.all(Array.from(entries).map(load)).catch((error) => {
		if (error.message !== EXPIRED) console.error(error);
	});

	requestCount = 0;
	++loadEpoch;
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
