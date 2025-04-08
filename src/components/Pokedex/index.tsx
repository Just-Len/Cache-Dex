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
        <div className='container-fluid'>
            <h1 className='text-center'>Pokédex</h1>
            <label>Buscar:</label>
            <input id='search-input' onChange={handleSearch} type="text" />
            <InfiniteScroll
              dataLength={filteredPokemons.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4 className='text-center'>Cargando...</h4>}>
                <div className='container-fluid'>
                    <div className='row'>
                        {filteredPokemons && filteredPokemons.map((pokemon) =><Pokecard key={pokemon.id} pokemon={pokemon} types={[]} />)}
                    </div>
                    
                </div>
            </InfiniteScroll>
        </div>
    );
}
