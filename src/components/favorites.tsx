import { PokeAPI } from "pokeapi-types";
import { useEffect, useState } from "react";
import { PokemonService } from "../services/pokemon-service";
import InfiniteScroll from "react-infinite-scroll-component";
import { Pokecard } from "./PokeCard/PokeCard";

const service = new PokemonService();

export function Favorites()
{
    const [moar, setMoar] = useState(true);
    const [listOffset, setListOffset] = useState(0);
    const [pokemons, setPokemons] = useState<PokeAPI.Pokemon[]>([]);
    const [pokemonSpecies, setPokemonSpecies] = useState<PokeAPI.PokemonSpecies[]>([]);
    const [pokemonTypes, setPokemonTypes] = useState<PokeAPI.Type[]>([]);

	async function loadPokemons(offset: number) {
		const pokemonRequest = service.favoritePokemons(offset);
		const pokemonSpeciesRequest = service.pokemonSpecies(offset);

		await Promise.all([pokemonRequest, pokemonSpeciesRequest]);
		const newPokemons = await pokemonRequest;
		setPokemons([...pokemons, ...newPokemons]);
		setPokemonSpecies([...pokemonSpecies, ...(await pokemonSpeciesRequest)]);
		setMoar(newPokemons.length > 0);
	}

	async function moarPokemons() {
        const newOffset = listOffset + 50;
        //await loadPokemons(newOffset);
        setListOffset(newOffset);
	}

	function pokemonList() {
		if (!pokemons) {
			return undefined;
		}

		return pokemons.map(pokemon => {
			const species = pokemonSpecies.find(species => species.name == pokemon.species.name);

			const types = pokemonTypes.filter(
				type => pokemon.types.find(pokemonType => pokemonType.type.name == type.name)
			);
			return (
				<Pokecard key={pokemon.id} pokemon={pokemon} species={species} types={types} />
			)
		});
	}

	useEffect(() => {
		service.types().then(types => setPokemonTypes(types));
	});
	useEffect(() => {
		loadPokemons(listOffset);
	}, [listOffset]);

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
					  <h4 className='text-center'>Cargando...</h4>
				  </div>
			  }>
                <div className='container-fluid'>
                    <div className='row'>
                        { pokemonList() }
                    </div>
                    
                </div>
            </InfiniteScroll>
        </div>
    );
}
