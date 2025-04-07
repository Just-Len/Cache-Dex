const API_URL = "https://pokeapi.co";
const CACHE_NAME = "cachedex-v1";
const API_CACHE_NAME = "cachedex-api-v1";
const CACHE_PATHS = [
    "/",
    "index.html",
    "main.js",
	"image/floppy-disk.png",
	"image/pokedex.png",
	"image/pokemon-shiny.png",
];

self.addEventListener("install", event => {
	self.skipWaiting();

    const promise = caches
        .open(CACHE_NAME)
        .then(cache => {
            console.log("Service worker activated")
            return cache.addAll(CACHE_PATHS)
        })

    event.waitUntil(promise)
})

self.addEventListener("fetch", event => {
    const promise = caches
        .match(event.request)
        .then(async response => {
            const url = event.request.url
            console.log(`Resource at ${url} requested`)
            if (response) {
                console.log("Cache hit!")
                return response
            }

			console.log("Cache miss :(")
			const externalResponse = await fetch(event.request)
			if (url.startsWith(API_URL) && externalResponse.ok) {
				const cache = await caches.open(API_CACHE_NAME)
				await cache.put(event.request, externalResponse.clone())
			}

            return externalResponse;
		})

    event.respondWith(promise)
})

self.addEventListener("activate", (event) => {
    const promise = caches
        .keys()
        .then(cacheNames => {
            const promises = cacheNames.map(name => {
                if (name !== CACHE_NAME && name != API_CACHE_NAME) {
                    console.log("Deleting old cache: ", name)
                    return caches.delete(name);
                }

                return Promise.resolve(false)
            })

            return Promise.all(promises);
        })

    event.waitUntil(promise)
})

//Se guardan solo las url? o todo el pokemon con detalles? usando localstorage?

//function to get pokemons in cache
async function getPokemonsInCache() {
    
	const cache = await caches.open(API_CACHE_NAME);
	const requests = await cache.keys();

	return Promise.all(
		requests.map(req => cache.match(req).then(res => res.json()))
	);
}
//Function to delete pokemons in cache
async function deleteCache() {

	try {
		const cache = await caches.open(API_CACHE_NAME);
		const keys = await cache.keys();

		await Promise.all(keys.map(request => cache.delete(request)));

		console.log("Pokemons in cache removed");
	} catch (error) {
		console.error("Error: ", error);
	}
}
//function to delete an especific pokemon from cache
async function deletePokemon(pokemonUrl) {

	try {
		const cache = await caches.open(API_CACHE_NAME);
		const eliminado = await cache.delete(pokemonUrl);

		if (eliminado) {
			console.log(`Pokemon removed: ${pokemonUrl}`);
		} else {
			console.warn(`Pokemon not found: ${pokemonUrl}`);
		}
	} catch (error) {
		console.error("Error while trying to remove the pokemon:", error);
	}
}