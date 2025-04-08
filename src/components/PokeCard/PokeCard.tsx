import { PokeAPI } from "pokeapi-types";
import { useEffect, useState } from "react";
import './PokeCard.css'
import { LocalStorageService } from "../../services/local-storage";

interface PokecardProps {
  id: number;
}
 
export const Pokecard: React.FC<PokecardProps> = ({ id }) => {
    const [pokemon, setPokemon] = useState<PokeAPI.Pokemon | null>(null);
    const urlPokemon = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const localStorageService = new LocalStorageService();

    useEffect(() => {
        fetchPokemon().then((data) => setPokemon(data));
    }, []);

    const fetchPokemon = async () => {
        const response = await fetch(urlPokemon);
        return response.json();
    }

    const savePokemon = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const response = await localStorageService.setPokemon(id);
        if(response === 0) {
            alert("Pokemon guardado en favoritos");
        }else{
            alert("Error al guardar el pokemon en favoritos");
        }
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
            <div className="text-center">
                <button onClick={(event) => savePokemon(event)}>Guardar en favoritos</button>
            </div>
        </div>
    );
}