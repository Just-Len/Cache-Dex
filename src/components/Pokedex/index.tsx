import React, {useEffect, useState} from 'react';
import { Pokecard } from '../PokeCard/PokeCard';
import { PokeAPI } from 'pokeapi-types';
import {  ApiClient } from '../../services/api-client';
import './index.css'
import InfiniteScroll from 'react-infinite-scroll-component';

export const Pokedex: React.FC = () => {
    const [hasMore, setHasMore] = useState(true);
    const [index, setIndex] = useState(0);
    const [pokemons, setPokemons] = useState<PokeAPI.Pokemon[]>([]);
    const [filteredPokemons, setFilteredPokemons] = useState<PokeAPI.Pokemon[]>([]);
    const [pokemonsToShow, setPokemonsToShow] = useState<PokeAPI.Pokemon[]>([]);

    const apiClient = new ApiClient();

    const fetchPokemons = async (offset: number) => {
        const data = await apiClient.pokemon(10, offset);
        setPokemonsToShow(((prev) => {
            const uniquePokemon = data.filter(
                (pokemon) => !prev.some((p) => p.id === pokemon.id)
            );
            setPokemons([...prev, ...uniquePokemon]);
            return [...prev, ...uniquePokemon];
        }));
        setHasMore(data.length > 0);
    };

    useEffect(() => {
        fetchPokemons(0);
    }, []);

    const fetchMoreData = async () => {
        const newIndex = index + 10;
        await fetchPokemons(newIndex);
        setIndex(newIndex);
        setPokemons(pokemonsToShow);
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value === ''){
            setPokemonsToShow(pokemons);
        }else{
            const searchValue = event.target.value.toLowerCase();
            const filtered = pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(searchValue));
            setFilteredPokemons(filtered);
            setPokemonsToShow(filteredPokemons);
        }
    }

    return (
        <div className='container-fluid'>
            <h1 className='text-center'>Pokédex</h1>
            <label>Buscar:</label>
            <input id='search-input' onChange={handleSearch} type="text" />
            <InfiniteScroll
              dataLength={pokemonsToShow.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4 className='text-center'>Cargando...</h4>}>
                <div className='container-fluid'>
                    <div className='row'>
                        {pokemonsToShow && pokemonsToShow.map((pokemon) => <Pokecard key={pokemon.id} id={pokemon.id} />)}
                    </div>
                    
                </div>
            </InfiniteScroll>
        </div>
    );
}