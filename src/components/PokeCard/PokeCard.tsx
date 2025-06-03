import './PokeCard.css'
import { useState } from "react";
import { languageIdFor, Pokemon } from "../../typedef";

interface PokecardProps
{
	pokemon: Pokemon;
	favoriteAction: (pokemon: Pokemon) => void;
}


export function Pokecard({ pokemon, favoriteAction }: PokecardProps)
{
	// I don't care about typing here anymore
	const [favorite, setFavorite] = useState((pokemon as any).favorite || false);
	const languageId = languageIdFor(navigator.languages[0]);

	let favoriteButtonText;
	let name = pokemon.name;
	let typeName = pokemon.types[0].name;
	let spriteUrl: string | undefined;

	if (favorite) {
		favoriteButtonText = "Remover de favoritos";
	}
	else {
		favoriteButtonText = "Agregar a favoritos";
	}

	if (pokemon.species) {
		const speciesLocalizedName = pokemon.species.names.get(languageId);

		if (speciesLocalizedName) {
			name = speciesLocalizedName;
		}
	}

	if (pokemon.types.length > 0) {
		const typeLocalizedName = pokemon.types[0].names.get(languageId);

		if (typeLocalizedName) {
			typeName = typeLocalizedName;
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

