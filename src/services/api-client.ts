import { Pokemon } from "../typedef";

const API_URL = "https://beta.pokeapi.co/graphql/v1beta";

export class ApiClient
{
	async pokemonCount(): Promise<number>
	{
		const query = `#graphql
			query pokemonCount {
				count: pokemon_v2_pokemon_aggregate {
					aggregate {
						count
					}
				}
			}
		`;

		const response = await fetch(API_URL, {
			method: "POST",
			body: JSON.stringify({ operationName: "pokemonCount", query: `${query}` })
		});
		const payload = await response.json();
		return payload.data.count.aggregate.count;
	}
	async pokemon(count = 64, offset = 0): Promise<Pokemon[]>
	{
		const query = `#graphql
			query pokemons {
				pokemons: pokemon_v2_pokemon(
					limit: ${count},
					offset: ${offset}
				) {
					stats: pokemon_v2_pokemonstats {
						stat: pokemon_v2_stat {
							names: pokemon_v2_statnames(
							where: { pokemon_v2_language: { name: { _in: ["es", "en", "ja-Hrkt"] } } }
							) {
								language_id
								name
								}
							}

							stat_id
							base_stat
						}
					types: pokemon_v2_pokemontypes {
						id
						type: pokemon_v2_type {
							names: pokemon_v2_typenames(
								where: { pokemon_v2_language: { name: { _in: ["es", "en", "ja-Hrkt"] } } }
							) {
								language_id
								name
							}
							name
						}
					}
					species: pokemon_v2_pokemonspecy {
						names: pokemon_v2_pokemonspeciesnames(
							where: { pokemon_v2_language: { name: { _in: ["es", "en", "ja-Hrkt"] } } }
						) {
							language_id
							name
						}

						id
						name
					}
					sprites: pokemon_v2_pokemonsprites {
						sprites
					}

					id
					name
				}
			}
		`;

		const response = await fetch(API_URL, {
			method: "POST",
			body: JSON.stringify({ operationName: "pokemons", query: `${query}` })
		});
		const payload = await response.json();
		const pokemons: any[] = payload.data.pokemons;

		for (const pokemon of pokemons) {
			pokemon.favorite = false;
			const speciesNames = new Map<number, string>();
			for (let species_name of pokemon.species.names) {
				speciesNames.set(species_name.language_id, species_name.name);
			}
			pokemon.species.names = speciesNames;

			for (const stat of pokemon.stats) {
				const names = new Map<number, string>();
				for (const stat_name of stat.stat.names) {
					names.set(stat_name.language_id, stat_name.name);
				}
				stat.names = names;
				stat.stat = undefined;
			}
			for (let type of pokemon.types) {
				const names = new Map<number, string>();
				for (const type_name of type.type.names) {
					names.set(type_name.language_id, type_name.name);
				}
				type.names = names;
				type.type = undefined;
			}

			pokemon.sprites = pokemon.sprites[0].sprites;
		}
		return pokemons;
	}
}

