import React, { useEffect, useState } from 'react';
import { PokeAPI } from 'pokeapi-types';
import './PokemonStats.css';

export function PokemonStats() {
	const [pokemons, setPokemons] = useState<PokeAPI.Pokemon[]>([]);
	const [filteredPokemons, setFilteredPokemons] = useState<PokeAPI.Pokemon[]>([]);
	const [searchFilter, setSearchFilter] = useState("");
	const [selectedPokemon, setSelectedPokemon] = useState<PokeAPI.Pokemon | null>(null);

	useEffect(() => {
		async function getPokemonsFromCache() {
			const cache = await caches.open("cachedex-api-v1");
			const requests = await cache.keys();

			const pokemonResponses = await Promise.all(
				requests.map(req => cache.match(req).then(res => res?.json()))
			);

			const validPokemons = pokemonResponses.filter(p => p && p.stats && p.types);
			setPokemons(validPokemons);
			setFilteredPokemons(validPokemons);
		}

		getPokemonsFromCache();
	}, []);

	useEffect(() => {
		const filtered = pokemons.filter(p =>
			p.name.toLowerCase().includes(searchFilter.toLowerCase())
		);
		setFilteredPokemons(filtered);
	}, [searchFilter, pokemons]);

	function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchFilter(event.target.value);
	}

	return (
		<div className="container-fluid py-4">
			<h1 className="text-center mb-4">Estadísticas fuera de linea</h1>

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

			<div className="row justify-content-center">
				{filteredPokemons.map(pokemon => (
					<div
						key={pokemon.id}
						className="pokemon-card"
						onClick={() => setSelectedPokemon(pokemon)}
					>
						<img src={pokemon.sprites.front_default ?? ""} alt={pokemon.name} />
						<h5 className="text-center">{pokemon.name.toUpperCase()}</h5>
					</div>
				))}
			</div>

			{selectedPokemon && (
				<div className="pokemon-modal-overlay" onClick={() => setSelectedPokemon(null)}>
					<div className="pokemon-modal-content" onClick={e => e.stopPropagation()}>
						<button className="close-button" onClick={() => setSelectedPokemon(null)}>✖</button>
						<h2 className="text-center">{selectedPokemon.name.toUpperCase()}</h2>
						<img src={selectedPokemon.sprites.front_default ?? ""} alt={selectedPokemon.name} className="modal-pokemon-image" />
						<h4>Estadísticas:</h4>
						<ul className="stats-list">
							{selectedPokemon.stats.map(stat => (
								<li key={stat.stat.name}>
									<strong>{stat.stat.name.toUpperCase()}:</strong> {stat.base_stat}
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
