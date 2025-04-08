import { PokeAPI } from "pokeapi-types";
import './PokeCard.css'
import { useState } from "react";

interface PokecardProps
{
	pokemon: PokeAPI.Pokemon;
	species?: PokeAPI.PokemonSpecies;
	types: PokeAPI.Type[];
	favoriteAction: (pokemon: PokeAPI.Pokemon) => void;
}


export function Pokecard({ pokemon, species, types, favoriteAction }: PokecardProps)
{
	// I don't care about typing here anymore
	const [favorite, setFavorite] = useState((pokemon as any).favorite || false);

	let favoriteButtonText;
	let name = pokemon.name;
	let typeName = pokemon.types[0].type.name;
	let spriteUrl: string | undefined;

	if (favorite) {
		favoriteButtonText = "Remover de favoritos";
	}
	else {
		favoriteButtonText = "Agregar a favoritos";
	}

	if (species) {
		const speciesLocalizedName = species.names.find(name => name.language.name == "es");

		if (speciesLocalizedName) {
			name = speciesLocalizedName.name;
		}
	}

	if (types.length > 0) {
		const typeLocalizedName = types[0].names.find(name => name.language.name == "es");

		if (typeLocalizedName) {
			typeName = typeLocalizedName.name;
		}
	}
	
	if (pokemon.sprites.other && pokemon.sprites.other["official-artwork"]) {
		const officialArtwork = pokemon.sprites.other["official-artwork"];
		if (officialArtwork) {
			spriteUrl = officialArtwork.front_default as string;
		}
	}

    function toggleFavorite(_: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		favoriteAction(pokemon);
		setFavorite(!favorite);
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
				onClick={(event) => toggleFavorite(event)}
			  >
				⭐ <p style={{ display: "inline"}}> {favoriteButtonText} </p>
			  </button>
			</div>
		  </div>
		</div>
	  );
	  
}

