import { useEffect, useRef, useState } from "react";
import { PokemonService } from "../services/pokemon-service";
import InfiniteScroll from "react-infinite-scroll-component";
import { Pokecard } from "./PokeCard/PokeCard";
import { Pokemon } from "../typedef";
import { STRINGS } from "../strings";
import useScrollable from "../useScrollable";

export function Favorites()
{
	const service = new PokemonService();

    const [moar, setMoar] = useState(true);
    const [listOffset, setListOffset] = useState(0);
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [scrollable, scrollableRef, node] = useScrollable([pokemons]);

	const abortController = useRef<AbortController | null>(null);

	useEffect(() => {
		loadPokemons(listOffset);
	}, [listOffset]);

	useEffect(() => {
		if (!node || loading) {
			return;
		}

		if (!scrollable && moar) {
		  moarPokemons();
		}
	}, [moar, loading, node, scrollable]);

	async function loadPokemons(offset: number) {
		setLoading(true);

		if (abortController.current != null) {
			abortController.current.abort();
		}
		abortController.current = new AbortController();

		const abortSignal = abortController.current.signal;
		const newPokemons = await service.favoritePokemons(offset, abortSignal);
		if (abortSignal.aborted) {
			return;
		}
		abortController.current = null;

		setPokemons(current => [...current, ...newPokemons]);
		setMoar(newPokemons.length > 0);
		setLoading(false);
	}

	async function moarPokemons() {
        const newOffset = listOffset + 50;
        setListOffset(newOffset);
	}

	function pokemonList() {
		if (!loading && pokemons.length == 0) {
			return (
				<div className="align-items-center d-flex flex-column h-100 justify-content-center w-100">
					<img aria-label="Pikachu winking GIF" style={{ height: "7em" }} src="image/pikachu-winking.gif" />
					<p className="text-center">{ STRINGS.noPokemons }</p>
				</div>
			);
		}

		return (
			<div id="scrollable" ref={ scrollableRef } style={{ flex: 1, overflowY: "auto" }} tabIndex={-1}>
				<InfiniteScroll
				  dataLength={pokemons.length}
				  next={moarPokemons}
				  hasMore={moar}
				  loader={
					  <div style={{ textAlign: "center" }}>
						  <img aria-label="Pikachu running GIF" style={{ height: "5em" }} src="image/pikachu-running.gif"/>
						  <h4 className="text-center">{ STRINGS.loading }</h4>
					  </div>
				  }
				  scrollableTarget="scrollable">
					<div className="px-3 row justify-content-center">
						{
							pokemons.map(pokemon =>
									<Pokecard key={pokemon.id} pokemon={pokemon} favoriteAction={removeFavorite} />
							)
						}
					</div>
				</InfiniteScroll>
			</div>
		);
	}

	function removeFavorite(pokemon: Pokemon) { 
		service.unsetFavorite(pokemon);
		setPokemons(pokemons.filter(p => p.id != pokemon.id));
	}

    return (
        <div className="container-fluid d-flex flex-column h-100 py-4">
            <h1 className="text-center">{ STRINGS.favorites }</h1>
				{
					pokemonList()
				}
        </div>
    );
}
