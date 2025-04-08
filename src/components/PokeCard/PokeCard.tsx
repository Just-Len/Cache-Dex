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
        const success = pokemonService.setFavorite(pokemon.id);
		/*if(pokemonService['_favoriteIds'].includes(pokemon.id)){
			alert("Este pokemon ya se encuentra en favoritos")
			return;
		}*/
		if (success) {
			alert("Pokemon guardado en favoritos");
		}
		else {
			alert("Error al guardar el pokemon en favoritos");
		}
    }

	if (pokemon.sprites.other && pokemon.sprites.other["official-artwork"]) {
		const officialArtwork = pokemon.sprites.other["official-artwork"];
		if (officialArtwork) {
			spriteUrl = officialArtwork.front_default as string;
		}
	}

	return (
		<div className="col-sm-6 col-md-4 col-lg-3 mb-4">
		  <div className="card h-100 shadow bg-dark text-white rounded-4">
			<div className="card-body d-flex flex-column align-items-center">
			  <h5 className="card-title text-capitalize">{name}</h5>
	  
			  <img
				src={spriteUrl}
				alt={`Imagen de ${name}`}
				className="mb-3"
				style={{ width: "80%", height: "auto" }}
			  />
	  
			  <p className="mb-1"><strong>Tipo:</strong> {typeName}</p>
			  <p className="mb-3"><strong>ID:</strong> {pokemon?.id}</p>
	  
			  <button
				className="btn btn-warning mt-auto px-4 rounded-pill"
				onClick={(event) => savePokemon(event)}
			  >
				⭐ Guardar en favoritos
			  </button>
			</div>
		  </div>
		</div>
	  );
	  
}

