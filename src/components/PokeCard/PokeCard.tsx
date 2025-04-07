import { PokeAPI } from "pokeapi-types";
import { useEffect, useState } from "react";
import './PokeCard.css'

interface PokecardProps {
  id: number;
}

export const Pokecard: React.FC<PokecardProps> = ({ id }) => {
    const [pokemon, setPokemon] = useState<PokeAPI.Pokemon | null>(null);

    useEffect(() => {
        fetchPokemon().then((data) => setPokemon(data));
    }, []);

    const fetchPokemon = async () => {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + id);
        return response.json();
    }

    return (
        <div className="col-sm-4 col-md-3 col bg-dark">
            <p className="text-center">{pokemon?.name}</p>
            <div className="text-center">
                <img width="60%" height="auto" 
                src={pokemon?.sprites?.other?.["official-artwork"]?.front_default ?? ""}
                alt="Imagen de pokemon" />
            </div>
            <p className="text-center">{pokemon?.types?.[0].type.name}</p>
            <p className="text-center">{pokemon?.id}</p>
            <button>Guardar en cache</button>
            <button>Guardar en favoritos</button>
        </div>
    );
}