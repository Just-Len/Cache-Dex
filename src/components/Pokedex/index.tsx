import React, {useEffect, useState} from 'react';
import { Pokecard } from '../PokeCard/PokeCard';
import { PokeAPI } from 'pokeapi-types';
import './index.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import { PokemonService } from '../../services/pokemon-service';

const service = new PokemonService();

export const Pokedex: React.FC = () => {
    const [hasMore, setHasMore] = useState(true);
    const [index, setIndex] = useState(0);
    const [searchFilter, setSearchFilter] = useState("");
    const [pokemons, setPokemons] = useState<PokeAPI.Pokemon[]>([]);
    const [pokemonSpecies, setPokemonSpecies] = useState<PokeAPI.PokemonSpecies[]>([]);
    const [pokemonTypes, setPokemonTypes] = useState<PokeAPI.Type[]>([]);
    const [filteredPokemons, setFilteredPokemons] = useState<PokeAPI.Pokemon[]>([]);

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

    const fetchMoreData = async () => {
        const newIndex = index + 50;
        setIndex(newIndex);
    }

	function filterPokemons(filter: string) {
        if (filter === "") {
            setFilteredPokemons(pokemons);
        } else {
            const searchValue = filter.toLowerCase();
            const filtered = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchValue));
            setFilteredPokemons(filtered);
        }
	}

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchFilter(event.target.value);
	}

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
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4 className="text-center">Cargando...</h4>}
          >
            <div className="container">
              <div className="row justify-content-center">
                {filteredPokemons &&
                  filteredPokemons.map((pokemon) => (
                    <Pokecard key={pokemon.id} pokemon={pokemon} types={[]} />
                  ))}
              </div>
            </div>
          </InfiniteScroll>
        </div>
      );
      
}
