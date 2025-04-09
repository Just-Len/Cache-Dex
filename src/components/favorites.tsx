import { PokeAPI } from "pokeapi-types";
import { useEffect, useState } from "react";
import { PokemonService } from "../services/pokemon-service";
import InfiniteScroll from "react-infinite-scroll-component";
import { Pokecard } from "./PokeCard/PokeCard";

interface PokemonListData
{
	pokemons: PokeAPI.Pokemon[];
	pokemonSpecies: PokeAPI.PokemonSpecies[];
	pokemonTypes: PokeAPI.Type[];
}

export function Favorites()
{
	const service = new PokemonService();

    const [moar, setMoar] = useState(true);
    const [listOffset, setListOffset] = useState(0);
	const [pokemonData, setPokemonData] = useState<PokemonListData>({
		pokemons: [], pokemonSpecies: [], pokemonTypes: []
	});

	const pokemons = pokemonData.pokemons;
	const pokemonSpecies = pokemonData.pokemonSpecies;
	const pokemonTypes = pokemonData.pokemonTypes;

	useEffect(() => {
		loadPokemons(listOffset);
	}, [listOffset]);

	async function loadPokemons(offset: number) {
		let newPokemonTypes = pokemonTypes;
		if (pokemonTypes.length == 0) {
			newPokemonTypes = await service.types();
		}
		const pokemonRequest = service.favoritePokemons(offset);
		const pokemonSpeciesRequest = service.pokemonSpecies(offset);

		let [newPokemons, newPokemonSpecies] = await Promise.all([pokemonRequest, pokemonSpeciesRequest]);
		const allPokemons = [...pokemons, ...newPokemons];
		setPokemonData({
			pokemons: allPokemons,
			pokemonSpecies: [...pokemonSpecies, ...newPokemonSpecies],
			pokemonTypes: newPokemonTypes
		});
		setMoar(allPokemons.length != service.favoriteCount);
	}

	async function moarPokemons() {
        const newOffset = listOffset + 50;
        setListOffset(newOffset);
	}

	function pokemonList() {
		if (pokemons.length == 0) {
			return undefined;
		}

		return pokemons.map(pokemon => {
			const species = pokemonSpecies.find(species => species.name == pokemon.species.name);

			const types = pokemonTypes.filter(
				type => pokemon.types.find(pokemonType => pokemonType.type.name == type.name)
			);
			return (
				<Pokecard	key={pokemon.id} pokemon={pokemon}
							species={species} types={types} favoriteAction={removeFavorite} />
			)
		});
	}

	function removeFavorite(pokemon: PokeAPI.Pokemon) { 
		service.unsetFavorite(pokemon);
		setPokemonData({
			pokemons: pokemons.filter(p => p.id != pokemon.id),
			pokemonSpecies: pokemonSpecies,
			pokemonTypes: pokemonTypes
		});
	}

    return (
        <div className='container-fluid'>
            <h1 className='text-center'>Pokémon favoritos</h1>
			<InfiniteScroll
			  dataLength={pokemons.length}
			  next={moarPokemons}
			  hasMore={moar}
			  loader={
				  <div style={{ textAlign: "center" }}>
					  <img style={{ height: "5em" }} src="image/pikachu-running.gif"/>
					  <h4 className='text-center'>Cargando</h4>
				  </div>
			  }>
				<div className="row justify-content-center">
					{ pokemonList() }
				</div>
			</InfiniteScroll>
        </div>
    );
}
