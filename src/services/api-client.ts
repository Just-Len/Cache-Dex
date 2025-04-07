import { PokeAPI } from "pokeapi-types";

const API_URL = "https://pokeapi.co/api/v2";

interface PaginatedResponse<T>
{
	count: number;
	next?: string;
	previous?: string;
	name: string;
	results: T[];
}

interface IndexItem
{
	name: string;
	url: string;
}

export class ApiClient
{
	private async fetchFromIndex<T>(endpoint: string, count: number, offset: number): Promise<T[]>
	{
		const indexResponse = await fetch(`${API_URL}/${endpoint}?limit=${count}&offset=${offset}`);
		if (!indexResponse.ok) {
			throw new Error("Couldn't fetch moves");
		}

		const index: PaginatedResponse<IndexItem> = await indexResponse.json();
		const itemPromises = index.results.map(item => fetch(item.url as any));
		const itemResponses = await Promise.all(itemPromises);
		const items: T[] = await Promise.all(
			itemResponses.filter(response => response.ok).map(response => response.json())
		);

		return items;
	}

	// Name: names[index].name
	async moves(count = 64, offset = 0): Promise<PokeAPI.Move[]>
	{
		return this.fetchFromIndex("move", count, offset);
	}

	// Localized name is in PokemonSpecies, not here
	// Image: sprites.other["official-artwork"].front_default
	async pokemon(count = 64, offset = 0): Promise<PokeAPI.Pokemon[]>
	{
		return this.fetchFromIndex("pokemon", count, offset);
	}

	// Name: names[index].name
	async pokemonSpecies(count = 64, offset = 0): Promise<PokeAPI.PokemonSpecies[]>
	{
		return this.fetchFromIndex("pokemon-species", count, offset);
	}

	// Name: names[index].name
	async pokemonTypes(count = 64, offset = 0): Promise<PokeAPI.PokemonType[]>
	{
		return this.fetchFromIndex("type", count, offset);
	}
}

