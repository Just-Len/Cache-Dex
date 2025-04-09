import { PokeAPI } from "pokeapi-types";

const API_URL = "https://pokeapi.co/api/v2";

interface PaginatedResponse<T>
{
	count: number;
	next?: String;
	previous?: String;
	name: String;
	results: T[];
}

interface IndexItem
{
	name: String;
	url: String;
}

export class ApiClient
{
	private async fetchItems<T>(endpoint: String, count: number, offset: number): Promise<T[]>
	{
		const itemPromises: Promise<Response>[] = [];
		let i = 0;
		while (i < count) {
			itemPromises.push(fetch(`${API_URL}/${endpoint}/${offset + i}`));
			++i;
		}
		const itemResponses = await Promise.all(itemPromises);
		const items: T[] = await Promise.all(
			itemResponses.filter(response => response.ok).map(response => response.json())
		);

		return items;
	}

	private async fetchFromIndex<T>(endpoint: String, count: number, offset: number): Promise<T[]>
	{
		const indexResponse = await fetch(`${API_URL}/${endpoint}?limit=${count}&offset=${offset}`);
		if (!indexResponse.ok) {
			throw new Error("Couldn't fetch index");
		}

		const index: PaginatedResponse<IndexItem> = await indexResponse.json();
		const itemPromises = index.results.map(item => fetch(item.url as any));
		const itemResponses = await Promise.all(itemPromises);
		const items: T[] = await Promise.all(
			itemResponses.filter(response => response.ok).map(response => response.json())
		);

		return items;
	}

	async pokemonCount(): Promise<number>
	{
		const indexResponse = await fetch(`${API_URL}/pokemon?limit=1`);
		if (!indexResponse.ok) {
			throw new Error("Couldn't fetch index");
		}

		const index: PaginatedResponse<IndexItem> = await indexResponse.json();
		return index.count;
	}

	async allPokemon()
	{
		
	}

	// Name: names[index].name
	async moves(count = 64, offset = 0): Promise<PokeAPI.Move[]>
	{
		return this.fetchItems("move", count, offset);
	}

	// Localized name is in PokemonSpecies, not here
	// Image: sprites.other["official-artwork"].front_default
	async pokemon(count = 64, offset = 0): Promise<PokeAPI.Pokemon[]>
	{
		return this.fetchItems("pokemon", count, offset);
	}

	// Name: names[index].name
	async pokemonSpecies(count = 64, offset = 0): Promise<PokeAPI.PokemonSpecies[]>
	{
		return this.fetchItems("pokemon-species", count, offset);
	}

	async pokemonStats(count = 64, offset = 0): Promise<PokeAPI.Stat[]>
	{
		return this.fetchFromIndex("stat", count, offset);
	}

	// Name: names[index].name
	async pokemonTypes(count = 64, offset = 0): Promise<PokeAPI.Type[]>
	{
		return this.fetchFromIndex("type", count, offset);
	}


}
