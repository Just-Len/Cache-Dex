import React, { useEffect, useRef, useState } from 'react';
import { Pokecard } from '../PokeCard/PokeCard';
import './Pokedex.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import { PokemonService } from '../../services/pokemon-service';
import { Pokemon } from '../../typedef';

export function Pokedex()
{
	const service = new PokemonService();

	const [hasMore, setHasMore] = useState(true);
	const [searchFilter, setSearchFilter] = useState("");
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const abortController = useRef<AbortController | null>(null);
	const indexRef = useRef<number>(0);

	const fetchPokemons = async (offset: number) => {
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
	};

	useEffect(() => {
		filterPokemons();
	}, [searchFilter]);

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
		if (pokemons.length == 0) {
			return undefined;
		}

		return pokemons.map(pokemon => {
			return (
				<Pokecard key={pokemon.id} pokemon={pokemon} favoriteAction={toggleFavorite} />
			)
		});
	}

	return (
		<div className="container-fluid py-4 bg-dark">
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
				dataLength={pokemons.length}
				next={nextPage}
				hasMore={hasMore}
				loader={
					<div style={{ textAlign: "center" }}>
						<img style={{ height: "5em" }} src="image/pikachu-running.gif" />
						<h4 className='text-center'>Cargando...</h4>
					</div>
				}>
				<div className="row justify-content-center">
					{ pokemonList(pokemons) }
				</div>
			</InfiniteScroll>
		</div>
	);
}
