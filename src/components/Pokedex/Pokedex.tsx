import React, { useEffect, useRef, useState } from "react";
import { Pokecard } from "../PokeCard/PokeCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { PokemonService } from "../../services/pokemon-service";
import { Pokemon } from "../../typedef";
import { STRINGS } from "../../strings";
import useScrollable from "../../useScrollable";

export function Pokedex()
{
	const service = new PokemonService();

	const [hasMore, setHasMore] = useState(true);
	const [searchFilter, setSearchFilter] = useState("");
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [scrollable, scrollableRef, node] = useScrollable([pokemons]);

	const abortController = useRef<AbortController | null>(null);
	const indexRef = useRef<number>(0);

	async function fetchPokemons(offset: number) {
		setLoading(true);

		const currAbortController = abortController.current;
		if (currAbortController != null) {
			currAbortController.abort();
		}
		abortController.current = new AbortController();
		const abortSignal = abortController.current.signal;

		const newPokemons = await service.pokemons(offset, searchFilter, abortSignal);
		if (abortSignal.aborted) {
			return;
		}
		abortController.current = null;

		setPokemons(current => [...current, ...newPokemons]);
		setHasMore(newPokemons.length > 0);
		setLoading(false);
	};

	useEffect(() => {
		filterPokemons();
	}, [searchFilter]);

	useEffect(() => {
		if (!node || loading) {
			return;
		}

		if (!scrollable && hasMore) {
		  nextPage();
		}
	}, [hasMore, loading, node, scrollable]);

	function nextPage() {
		indexRef.current += 50;
		fetchPokemons(indexRef.current);
	}

	function filterPokemons(): void {
		setPokemons([]);
		indexRef.current = 0;

		fetchPokemons(0);
	}

	function toggleFavorite(pokemon: Pokemon) {
		if (pokemon.favorite) {
			service.unsetFavorite(pokemon);
		}
		else {
			service.setFavorite(pokemon);
		}
	}

	function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchFilter(event.target.value);
	}

	function pokemonList(pokemons: Pokemon[]) {
		if (!loading && pokemons.length == 0) {
			return (
				<div className="align-items-center d-flex flex-column h-100 justify-content-center w-100">
					<img aria-label="Pikachu winking GIF" style={{ height: "7em" }} src="image/pikachu-winking.gif" />
					<p className="text-center">{ STRINGS.noPokemons }</p>
				</div>
			);
		}

		return (
			<div id="scrollable" ref={ scrollableRef } style={{ flex: 1, overflowY: "auto" }}>
				<InfiniteScroll
					className="justify-self-center"
					dataLength={pokemons.length}
					next={nextPage}
					hasMore={hasMore}
					loader={
						<div style={{ textAlign: "center" }}>
							<img aria-label="Pikachu running GIF" style={{ height: "5em" }} src="image/pikachu-running.gif" />
							<p className="text-center">{STRINGS.loading}</p>
						</div>
					}
					scrollableTarget="scrollable">
					<div id="main-content" className="px-3 row justify-content-center">
						{
							pokemons.map(pokemon =>
								<Pokecard key={pokemon.id} pokemon={pokemon} favoriteAction={toggleFavorite} />
							)
						}
					</div>
				</InfiniteScroll>
			</div>
		);
	}

	return (
		<div className="pokedex container-fluid d-flex flex-column h-100 py-4">

			<div className="align-items-center d-flex flex-column justify-content-center mb-4">
				<h1 className="text-center mb-4">{STRINGS.pokedex}</h1>
				<div className="w-100" style={{ maxWidth: "400px" }}>
					<input
						aria-label="Search"
						id="search-input"
						type="text"
						onChange={handleSearch}
						className="form-control"
						placeholder={STRINGS.search}
					/>
				</div>
			</div>
			{pokemonList(pokemons)}
		</div>
	);
}
