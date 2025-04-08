import { PokeAPI } from "pokeapi-types";
import './PokeCard.css'
import { PokemonService } from "../../services/pokemon-service";

interface PokecardProps
{
	pokemon: PokeAPI.Pokemon;
	species?: PokeAPI.PokemonSpecies;
	types: PokeAPI.Type[];
}

const pokemonService = new PokemonService();

export const Pokecard: React.FC<PokecardProps> = ({ pokemon, species, types }) => {
	let name = pokemon.name;
	let typeName = pokemon.types[0].type.name;
	let spriteUrl: string | undefined;

	if (species) {
		const speciesLocalizedName = species.names.find(name => name.language.name == "es");

		if (speciesLocalizedName) {
			name = speciesLocalizedName.name;
		}
	}

	if (types && types.length > 0) {
		const typeLocalizedName = types[0].names.find(name => name.language.name == "es");

		if (typeLocalizedName) {
			typeName = typeLocalizedName.name;
		}
	}
	
    const savePokemon = async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const response = await pokemonService.setPokemon(pokemon.id);
        switch (response) {
            case 0:
                alert("Pokemon guardado en favoritos");
                break;
            case 1:
                alert("Pokemon ya guardado en favoritos");
                break;
            case -1:
                alert("Error al guardar el pokemon en favoritos");
                break;
        }
    }

	if (pokemon.sprites.other && pokemon.sprites.other["official-artwork"]) {
		const officialArtwork = pokemon.sprites.other["official-artwork"];
		if (officialArtwork) {
			spriteUrl = officialArtwork.front_default as string;
		}
	}

	return (
		<div className="col-sm-4 col-md-3 col bg-dark">
			<p className="text-center">{name}</p>
			<div className="text-center">
				<img width="60%" height="auto"
					src={spriteUrl}
					alt="Imagen de pokemon" />
			</div>
			<p className="text-center">{typeName}</p>
			<p className="text-center">{pokemon?.id}</p>
			<div className="text-center">
                <button onClick={(event) => savePokemon(event)}>Guardar en favoritos</button>
            </div>
		</div>
	);
}

