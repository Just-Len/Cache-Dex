import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PokemonService } from '../../services/pokemon-service';
import { languageIdFor, Pokemon } from '../../typedef';
import useScrollable from '../../useScrollable';
import { STRINGS } from '../../strings';

import './PokemonStats.css';

export function PokemonStats()
{
	const pokemonService = new PokemonService();
	const languageId = languageIdFor(navigator.languages[0]);

	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [searchFilter, setSearchFilter] = useState("");
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [scrollable, scrollableRef, node] = useScrollable([pokemons]);

	const abortControllerRef = useRef<AbortController | null>(null);
	const offsetRef = useRef<number>(0);

	async function getPokemonsFromCache() {
		setLoading(true);

		const currAbortController = abortControllerRef.current;
		if (currAbortController != null) {
			currAbortController.abort();
		}
		abortControllerRef.current = new AbortController();

		const abortSignal = abortControllerRef.current.signal;

		const newPokemons = await pokemonService.pokemons(offsetRef.current, searchFilter, abortSignal);
		if (abortSignal.aborted) {
			return;
		}
		abortControllerRef.current = null;

		setPokemons(current => [...current, ...newPokemons]);
		setHasMore(newPokemons.length > 0);
		setLoading(false);
	}

	useEffect(() => {
		setPokemons([]);
		offsetRef.current = 0;
		
		getPokemonsFromCache();
	}, [searchFilter]);

	useEffect(() => {
		if (!node || loading) {
			return;
		}

		if (!scrollable && hasMore) {
		  nextPage();
		}
	}, [hasMore, loading, node, scrollable]);


	function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchFilter(event.target.value);
	}

	async function nextPage() {
        offsetRef.current += 50;
        getPokemonsFromCache();
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
					next={nextPage}
					hasMore={hasMore}
					loader={
						<div style={{ textAlign: "center" }}>
							<img aria-label="Pikachu running GIF" style={{ height: "5em" }} src="image/pikachu-running.gif" alt="Cargando" />
							<h4 className="text-center">{STRINGS.loading}</h4>
						</div>
					}
					scrollableTarget="scrollable">
						<div className="row justify-content-center">
							{pokemons.map(pokemon => (
								<div
									key={pokemon.id}
									className="pokemon-card"
									onClick={() => setSelectedPokemon(pokemon)}
									tabIndex={0}>
									<img src={pokemon.sprites.front_default ?? ""} alt={pokemon.name} />
									<h5 className="text-center">{ pokemon.species.names.get(languageId) }</h5>
								</div>
							))}
						</div>
					</InfiniteScroll>
				</div>
		);
	}

	return (
		<div className="container-fluid d-flex flex-column h-100 py-4">
			<h1 className="text-center mb-4">{STRINGS.cachedex}</h1>

			<div className="d-flex justify-content-center mb-4">
				<div className="w-100" style={{ maxWidth: "400px" }}>
					<input
						id="search-input"
						type="text"
						onChange={handleSearch}
						className="form-control"
						placeholder={STRINGS.search}
					/>
				</div>
			</div>
			{ pokemonList() }

			{
				selectedPokemon && (
					<div className="pokemon-modal-overlay" onClick={() => setSelectedPokemon(null)}>
						<div className="pokemon-modal-content" onClick={e => e.stopPropagation()}>
							<button className="close-button" onClick={() => setSelectedPokemon(null)}>✖</button>
							<h2 className="text-center">{selectedPokemon.species.names.get(languageId)}</h2>
							<img src={selectedPokemon.sprites.front_default ?? ""} alt={selectedPokemon.species.names.get(languageId)} className="modal-pokemon-image" />
							<h4>{STRINGS.stats}</h4>
							<ul className="stats-list">
								{
									selectedPokemon.stats.map(stat => (

										<li key={stat.name}>
											<strong>{stat.names.get(languageId)}:</strong> {stat.base_stat}
										</li>
									))
								}
							</ul>
						</div>
					</div>
				)
			}
		</div>
	);
}
