import { ApiClient } from "./api-client";
import { Pokemon } from "../typedef";

const LOCAL_STORAGE_FAVORITES_KEY = "favoritePokemons";
const CHUNK_SIZE = 50;

export class PokemonService
{
	private _apiClient: ApiClient;
	private _favoriteIds: number[];
	private _favoritePokemons: Pokemon[];
	private _pokemons: Pokemon[];
	private _currentSearchFilter: string;

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
		this._currentSearchFilter = "";
	}

	get favoriteCount()
	{
		return this._favoriteIds.length;
	}

	async favoritePokemons(offset: number, abortSignal: AbortSignal)
	{
		let pokemons: Pokemon[] = [];

		if (offset <= this._favoriteIds.length && this._favoritePokemons.length <= offset) {
			pokemons = await this.pokemons(offset, this._currentSearchFilter, abortSignal);
			pokemons = pokemons.filter(pokemon => this._favoriteIds.includes(pokemon.id));
			this._favoritePokemons.push(...pokemons);
		}
		else {
			pokemons = this._favoritePokemons.slice(offset, CHUNK_SIZE);
		}

		return pokemons;
	}

    async pokemons(offset: number, searchFilter: string, abortSignal: AbortSignal)
	{
		const pokemonCount  = await this._apiClient.pokemonCount(searchFilter);
		let pokemons: Pokemon[];

		if (this._currentSearchFilter != searchFilter) {
			this._pokemons = [];
		}
		this._currentSearchFilter = searchFilter;

		if (offset <= pokemonCount && this._pokemons.length <= offset) {
			pokemons = await this._apiClient.pokemon(abortSignal, CHUNK_SIZE, offset, searchFilter);
			pokemons.forEach((pokemon: Pokemon) => pokemon.favorite = this._favoriteIds.includes(pokemon.id));

			this._pokemons.push(...pokemons);
		}
		else {
			pokemons = this._pokemons.slice(offset, CHUNK_SIZE);
		}

		return pokemons;
    };

    unsetFavorite(pokemon: Pokemon): boolean
	{
        try {
			(pokemon as any).favorite = false;
			const newFavorites = this._favoriteIds.filter(favoriteId => favoriteId != pokemon.id);
			if(newFavorites.length != this._favoriteIds.length){
				this._favoriteIds = newFavorites;
				localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(this._favoriteIds));
			}

			return true;
        } catch (error) {
            console.error("Error saving pokemon to local storage", error);
            return false;
        }
    }

    setFavorite(pokemon: Pokemon): boolean
	{
        try {
			(pokemon as any).favorite = true;
			if(!this._favoriteIds.includes(pokemon.id)){
				this._favoriteIds.push(pokemon.id);
				localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(this._favoriteIds));
			}

			return true;
        } catch (error) {
            console.error("Error saving pokemon to local storage", error);
            return false;
        }
    }
}
