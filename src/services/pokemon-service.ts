import { PokeAPI } from "pokeapi-types";
import { ApiClient } from "./api-client";

const LOCAL_STORAGE_FAVORITES_KEY = "favoritePokemons";
const CHUNK_SIZE = 50;

export class PokemonService
{
	private _apiClient: ApiClient;
	private _favoriteIds: number[];
	private _favoritePokemons: PokeAPI.Pokemon[];
	private _pokemons: PokeAPI.Pokemon[];
	private _pokemonSpecies: PokeAPI.PokemonSpecies[];
	private _pokemonTypes: PokeAPI.Type[];

	constructor()
	{
		let favoritesString = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
		if (!favoritesString) {
			favoritesString = "[]";
		}

		this._apiClient = new ApiClient();
		this._favoriteIds = JSON.parse(favoritesString);
		this._favoritePokemons = [];
		this._pokemons = [];
		this._pokemonSpecies = [];
		this._pokemonTypes = [];
	}

	async favoritePokemons(offset: number)
	{
		let pokemons: PokeAPI.Pokemon[] = [];

		if (offset <= this._favoriteIds.length && this._favoritePokemons.length <= offset) {
			pokemons = await this.pokemons(offset);
			pokemons = pokemons.filter(pokemon => this._favoriteIds.includes(pokemon.id));
			this._favoritePokemons.push(...pokemons);
		}
		else {
			pokemons = this._favoritePokemons.slice(offset, CHUNK_SIZE);
		}

		return pokemons;
	}

    async pokemons(offset: number)
	{
		const pokemonCount = await this._apiClient.pokemonCount();
		let pokemons: PokeAPI.Pokemon[];

		if (offset <= pokemonCount && this._pokemons.length <= offset) {
			pokemons = await this._apiClient.pokemon(CHUNK_SIZE, offset);
			this._pokemons.push(...pokemons);
		}
		else {
			pokemons = this._pokemons.slice(offset, CHUNK_SIZE);
		}

		return pokemons;
    };

    async pokemonSpecies(offset: number)
	{
		const pokemonCount = await this._apiClient.pokemonCount();
		let pokemonSpecies: PokeAPI.PokemonSpecies[];

		if (offset <= pokemonCount && this._pokemonSpecies.length <= offset) {
			pokemonSpecies = await this._apiClient.pokemonSpecies(CHUNK_SIZE, offset);
			this._pokemonSpecies.push(pokemonSpecies as any);
		}
		else {
			pokemonSpecies = this._pokemonSpecies.slice(offset, CHUNK_SIZE);
		}

		return pokemonSpecies;
    };

	async types(): Promise<PokeAPI.Type[]>
	{
		if (this._pokemonTypes.length == 0) {
			this._pokemonTypes = await this._apiClient.pokemonTypes(100);
		}

		return this._pokemonTypes;
	}

	async getPokemons() {
		const pokemons = await JSON.parse(localStorage.getItem('pokemons') || '[]');
        return pokemons;
    }

    async setPokemon(id: number){
        try{
            const pokemons: number[] = await this.getPokemons();
			if(!pokemons.includes(id)){
				pokemons.push(id);
				localStorage.setItem('pokemons', JSON.stringify(pokemons));
				console.log("Pokemon guardado en local storage", pokemons);
				return 0;
			}else{
				console.warn("Pokemon ya guardado en local storage", pokemons);
				return 1;
			}
        }catch (error) {
            console.error("Error saving pokemon to local storage", error);
            return -1;
        }
    }
}
