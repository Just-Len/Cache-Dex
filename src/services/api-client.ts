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
	// Name: names[index].name
	async moves(count = 64, offset = 0): Promise<PokeAPI.Move[]>
	{
		const indexResponse = await fetch(`${API_URL}/move?limit=${count}&offset=${offset}`);
		if (!indexResponse.ok) {
			throw new Error("Couldn't fetch moves");
		}

		const index: PaginatedResponse<IndexItem> = await indexResponse.json();
		const movePromises = index.results.map(item => fetch(item.url as any));
		const moveResponses = await Promise.all(movePromises);
		const moves: PokeAPI.Move[] = await Promise.all(
			moveResponses.filter(response => response.ok).map(response => response.json())
		);

		return moves;
	}

	// Localized name is in PokemonSpecies, not here
	// Image: sprites.other["official-artwork"].front_default
	async pokemon(count = 64, offset = 0): Promise<PokeAPI.Pokemon[]>
	{
		const indexResponse = await fetch(`${API_URL}/pokemon?limit=${count}&offset=${offset}`);
		if (!indexResponse.ok) {
			throw new Error("Couldn't fetch pokémon");
		}

		const index: PaginatedResponse<IndexItem> = await indexResponse.json();
		const pokemonPromises = index.results.map(item => fetch(item.url as any));
		const pokemonResponses = await Promise.all(pokemonPromises);
		const pokemons: PokeAPI.Pokemon[] = await Promise.all(
			pokemonResponses.filter(response => response.ok).map(response => response.json())
		);

		return pokemons;
	}

	// Name: names[index].name
	async pokemonSpecies(count = 64, offset = 0): Promise<PokeAPI.PokemonSpecies[]>
	{
		const indexResponse = await fetch(`${API_URL}/pokemon-species?limit=${count}&offset=${offset}`);
		if (!indexResponse.ok) {
			throw new Error("Couldn't fetch pokémon species");
		}

		const index: PaginatedResponse<IndexItem> = await indexResponse.json();
		const speciesPromises = index.results.map(item => fetch(item.url as any));
		const speciesResponses = await Promise.all(speciesPromises);
		const species: PokeAPI.PokemonSpecies[] = await Promise.all(
			speciesResponses.filter(response => response.ok).map(response => response.json())
		);
		return species;
	}

	// Name: names[index].name
	async pokemonTypes(count = 64, offset = 0): Promise<PokeAPI.PokemonType[]>
	{
		const indexResponse = await fetch(`${API_URL}/type?limit=${count}&offset=${offset}`);
		if (!indexResponse.ok) {
			throw new Error("Couldn't fetch pokémon types");
		}

		const index: PaginatedResponse<IndexItem> = await indexResponse.json();
		const typePromises = index.results.map(item => fetch(item.url as any));
		const typeResponses = await Promise.all(typePromises);
		const types: PokeAPI.PokemonType[] = await Promise.all(
			typeResponses.filter(response => response.ok).map(response => response.json())
		);
		return types;
	}
}

