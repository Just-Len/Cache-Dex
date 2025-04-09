import React, { useEffect, useState } from 'react';
import { Pokecard } from '../PokeCard/PokeCard';
import { PokeAPI } from 'pokeapi-types';
import './Pokedex.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import { PokemonService } from '../../services/pokemon-service';

export function Pokedex()
{
	const service = new PokemonService();

	const [hasMore, setHasMore] = useState(true);
	const [index, setIndex] = useState(0);
	const [searchFilter, setSearchFilter] = useState("");
	const [pokemons, setPokemons] = useState<PokeAPI.Pokemon[]>([]);
	const [pokemonSpecies, setPokemonSpecies] = useState<PokeAPI.PokemonSpecies[]>([]);
	const [pokemonTypes, setPokemonTypes] = useState<PokeAPI.Type[]>([]);

	const fetchPokemons = async (offset: number) => {
		const pokemonRequest = service.pokemons(offset);
		const pokemonSpeciesRequest = service.pokemonSpecies(offset);

		await Promise.all([pokemonRequest, pokemonSpeciesRequest]);
		const newPokemons = await pokemonRequest;
		setPokemonSpecies([...pokemonSpecies, ...(await pokemonSpeciesRequest)]);
		setPokemons([...pokemons, ...newPokemons]);
		setHasMore(newPokemons.length > 0);
	};

	useEffect(() => {
		service.types().then(types => setPokemonTypes(types));
	}, []);

	useEffect(() => {
		fetchPokemons(index);
	}, [index]);

	useEffect(() => {
		filterPokemons(searchFilter);
	}, [searchFilter, pokemons]);

	function nextPage() {
		const newIndex = index + 50;
		setIndex(newIndex);
	}

	function filterPokemons(filter: string) {
		if (filter === "") {
			return pokemons;
		} else {
			const searchValue = filter.toLowerCase();
			const filtered = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchValue));
			return filtered;
		}
	}

	function toggleFavorite(pokemon: PokeAPI.Pokemon) { 
		if ((pokemon as any).favorite) {
			service.unsetFavorite(pokemon);
		}
		else {
			service.setFavorite(pokemon);
		}
	}

	function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchFilter(event.target.value);
	}

	function pokemonList(pokemons: PokeAPI.Pokemon[]) {
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
							species={species} types={types} favoriteAction={toggleFavorite} />
			)
		});
	}

	const filteredPokemons = filterPokemons(searchFilter);

	return (
		<div className="container-fluid py-4">
			<h1 className="text-center mb-4">Pokédex</h1>

			<div className="d-flex justify-content-center mb-4">
				<div className="w-100" style={{ maxWidth: "400px" }}>
					<label htmlFor="search-input" className="form-label">Buscar Pokémon</label>
					<input
						id="search-input"
						type="text"
						onChange={handleSearch}
						className="form-control"
						placeholder="Ej. Pikachu"
					/>
				</div>
			</div>

			<InfiniteScroll
				dataLength={filteredPokemons.length}
				next={nextPage}
				hasMore={hasMore}
				loader={
					<div style={{ textAlign: "center" }}>
						<img style={{ height: "5em" }} src="image/pikachu-running.gif" />
						<h4 className='text-center'>Cargando...</h4>
					</div>
				}>
				<div className="row justify-content-center">
					{ pokemonList(filteredPokemons) }
				</div>
			</InfiniteScroll>
		</div>
	);
}
