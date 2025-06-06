import { PokeAPI } from "pokeapi-types";

export interface PokemonType
{
	id: number;
	name: string;
	names: Map<number, string>;
}

export interface PokemonStat
{
	id: number;
	base_stat: number;
	name: string;
	names: Map<number, string>;
}

export interface PokemonSpecies
{
	id: number;
	name: string;
	names: Map<number, string>;
}

export interface Pokemon
{
	favorite: boolean;
	id: number;
	name: string;
	types: PokemonType[];
	species: PokemonSpecies;
	sprites: PokeAPI.PokemonSprites;
	stats: PokemonStat[];
}

export function languageIdFor(languageName: string): number
{
	if (languageName.startsWith("ja")) {
		return 1;
	}
	if (languageName.startsWith("es")) {
		return 7;
	}

	return 9;
}

