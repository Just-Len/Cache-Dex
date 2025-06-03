import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PokemonService } from '../../services/pokemon-service';
import { languageIdFor, Pokemon } from '../../typedef';

import './PokemonStats.css';

export function PokemonStats()
{
	const pokemonService = new PokemonService();
	const languageId = languageIdFor(navigator.languages[0]);

	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [searchFilter, setSearchFilter] = useState("");
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const abortControllerRef = useRef<AbortController | null>(null);
	const offsetRef = useRef<number>(0);

	async function getPokemonsFromCache() {
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
	}

	useEffect(() => {
		setPokemons([]);
		offsetRef.current = 0;
		
		getPokemonsFromCache();
	}, [searchFilter]);

	function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchFilter(event.target.value);
	}

	async function nextPage() {
        offsetRef.current += 50;
        getPokemonsFromCache();
	}

	return (
		<div className="container-fluid py-4">
			<h1 className="text-center mb-4">Estadísticas</h1>

			<div className="d-flex justify-content-center mb-4">
				<div className="w-100" style={{ maxWidth: "400px" }}>
					<label htmlFor="search-input" className="form-label">Buscar Pokémon</label>
					<input
						id="search-input"
						type="text"
						onChange={handleSearch}
						className="form-control"
						placeholder="Ej. Bulbasaur"
					/>
				</div>
			</div>
			<InfiniteScroll
				dataLength={pokemons.length}
				next={nextPage}
				hasMore={hasMore}
				loader={
					<div style={{ textAlign: "center" }}>
						<img style={{ height: "5em" }} src="image/pikachu-running.gif" alt="Cargando" />
						<h4 className="text-center">Cargando...</h4>
					</div>
				}>
					<div className="row justify-content-center">
						{pokemons.map(pokemon => (
							<div
								key={pokemon.id}
								className="pokemon-card"
								onClick={() => setSelectedPokemon(pokemon)}>
								<img src={pokemon.sprites.front_default ?? ""} alt={pokemon.name} />
								<h5 className="text-center">{ pokemon.species.names.get(languageId) }</h5>
							</div>
						))}
					</div>
				</InfiniteScroll>


			{
				selectedPokemon && (
					<div className="pokemon-modal-overlay" onClick={() => setSelectedPokemon(null)}>
						<div className="pokemon-modal-content" onClick={e => e.stopPropagation()}>
							<button className="close-button" onClick={() => setSelectedPokemon(null)}>✖</button>
							<h2 className="text-center">{selectedPokemon.species.names.get(languageId)}</h2>
							<img src={selectedPokemon.sprites.front_default ?? ""} alt={selectedPokemon.species.names.get(languageId)} className="modal-pokemon-image" />
							<h4>Estadísticas:</h4>
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
