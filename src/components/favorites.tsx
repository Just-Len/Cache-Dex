import { useEffect, useRef, useState } from "react";
import { PokemonService } from "../services/pokemon-service";
import InfiniteScroll from "react-infinite-scroll-component";
import { Pokecard } from "./PokeCard/PokeCard";
import { Pokemon } from "../typedef";

export function Favorites()
{
	const service = new PokemonService();

    const [moar, setMoar] = useState(true);
    const [listOffset, setListOffset] = useState(0);
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const abortController = useRef<AbortController | null>(null);

	useEffect(() => {
		loadPokemons(listOffset);
	}, [listOffset]);

	async function loadPokemons(offset: number) {
		if (abortController.current != null) {
			abortController.current.abort();
		}
		abortController.current = new AbortController();

		const newPokemons = await service.favoritePokemons(offset, abortController.current.signal);
		abortController.current = null;

		setPokemons(current => [...current, ...newPokemons]);
		setMoar(newPokemons.length > 0);
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
			return (
				<Pokecard key={pokemon.id} pokemon={pokemon} favoriteAction={removeFavorite} />
			)
		});
	}

	function removeFavorite(pokemon: Pokemon) { 
		service.unsetFavorite(pokemon);
		setPokemons(pokemons.filter(p => p.id != pokemon.id));
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
