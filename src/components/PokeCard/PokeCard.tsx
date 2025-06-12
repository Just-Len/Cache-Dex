import { useState } from "react";
import { languageIdFor, Pokemon } from "../../typedef";
import { STRINGS } from '../../strings';

import './PokeCard.css'

interface PokecardProps
{
	pokemon: Pokemon;
	favoriteAction: (pokemon: Pokemon) => void;
}

interface ImageData
{
	alt: string;
	src?: string;
}

function Image({ alt, src }: ImageData)
{
	const [imageLoaded, setImageLoaded] = useState(false);
	
	function imageFinishedLoading() {
		console.log("image loaded");
		setImageLoaded(true);
	}

	return (
		<div className="align-items-center d-flex justify-content-center" style={{ height: "200px" }}>
			<div className="mx-auto text-center text-muted" hidden={imageLoaded}>
				<img alt="Pikachu running GIF" className="d-block mx-auto" src="image/pikachu-running.gif" style={{ width: "50%" }}/>
				Loading image
			</div>
			<img
				alt={alt}
				className="mb-3"
				hidden={!imageLoaded}
				onLoad={ imageFinishedLoading }
				src={src}
				style={{ height: "100%" }}/>
		</div>
	);
}

export function Pokecard({ pokemon, favoriteAction }: PokecardProps)
{
	const [favorite, setFavorite] = useState(pokemon.favorite);
	const languageId = languageIdFor(navigator.languages[0]);

	let favoriteButtonText;
	let favoriteButtonKind;
	let name = pokemon.name;
	let typeName = pokemon.types[0].name;
	let spriteUrl: string | undefined;

	if (favorite) {
		favoriteButtonKind = "danger";
		favoriteButtonText = STRINGS.removeFavorite;
	}
	else {
		favoriteButtonKind = "primary";
		favoriteButtonText = STRINGS.addFavorite;
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
  			<div className="pokecard card h-100 shadow rounded-4">
				<div className="card-body d-flex flex-column align-items-center">	
					<h5 className="card-title text-capitalize">{name}</h5>

					<Image alt={ `${pokemon.name} image` } src={ spriteUrl }/>
	  
					<p className="mb-1"><strong>{STRINGS.type}:</strong> {typeName}</p>
					<p className="mb-3"><strong>{STRINGS.id}:</strong> {pokemon?.id}</p>
	  
					<button
					  className={`align-items-center btn btn-outline-${favoriteButtonKind} d-flex gap-2 m-auto px-4 rounded-pill`}
					  onClick={(event) => toggleFavorite(event)}
					  tabIndex={0}>
						<div>⭐</div>
						<p className="mb-0">{favoriteButtonText}</p>
					</button>
				</div>
			</div>
		</div>
	  );
	  
}

