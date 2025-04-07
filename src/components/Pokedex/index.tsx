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

    const apiClient = new ApiClient();

    const fetchPokemons = async (offset: number) => {
        const data = await apiClient.pokemon(10, offset);
        setPokemons(((prev) => {
            const uniquePokemon = data.filter(
                (pokemon) => !prev.some((p) => p.id === pokemon.id)
            );
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
    }

    return (
        <div className='container-fluid'>
            <p className='text-center'>Pokedex</p>
            <InfiniteScroll
              dataLength={pokemons.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4 className='text-center'>Loading...</h4>}>
                <div className='container-fluid'>
                    <div className='row'>
                        {pokemons && pokemons.map((pokemon) => <Pokecard key={pokemon.id} id={pokemon.id} />)}
                    </div>
                </div>
            </InfiniteScroll>
        </div>
    );
}