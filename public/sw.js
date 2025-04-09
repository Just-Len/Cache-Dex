import React, { useEffect, useState } from "react";
import { PokeAPI } from "pokeapi-types";

interface StatsProps {
  pokemon: PokeAPI.Pokemon;
}

export const PokemonStats: React.FC<StatsProps> = ({ pokemon }) => {
  if (!pokemon || !pokemon.moves || !Array.isArray(pokemon.moves)) return <p className="text-danger">No se pudieron cargar los datos del Pokémon.</p>;

  const firstMove = pokemon.moves[0]?.move?.name;

  return (
    <div className="card p-3 mt-3">
      <h4 className="mb-3">Información de {pokemon.name.toUpperCase()}</h4>

      <ul className="list-group list-group-flush">
        <li className="list-group-item d-flex justify-content-between">
          <strong>ID</strong>
          <span>{pokemon.id}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <strong>Altura</strong>
          <span>{pokemon.height}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <strong>Peso</strong>
          <span>{pokemon.weight}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <strong>Tipo(s)</strong>
          <span>{pokemon.types.map(t => t.type.name).join(", ")}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <strong>Primer Movimiento</strong>
          <span>{firstMove || "Desconocido"}</span>
        </li>
      </ul>
    </div>
  );
};

export const CacheDex: React.FC = () => {
  const [cachedPokemons, setCachedPokemons] = useState<PokeAPI.Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokeAPI.Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getCached() {
      try {
        const cache = await caches.open("cachedex-api-v1");
        const keys = await cache.keys();
        const results = await Promise.all(
          keys.map(async (req) => {
            const res = await cache.match(req);
            if (!res) return null;
            try {
              return await res.json();
            } catch (e) {
              console.warn("Invalid JSON in cache:", req.url);
              return null;
            }
          })
        );

        const isValidPokemon = (p: any): p is PokeAPI.Pokemon => {
          return (
            p &&
            typeof p.name === "string" &&
            Array.isArray(p.moves) &&
            p.moves.length > 0
          );
        };

        const uniqueValidPokemons = results.filter((p, index, self) =>
          isValidPokemon(p) &&
          self.findIndex(other => other?.id === p.id) === index
        );

        setCachedPokemons(uniqueValidPokemons);
      } catch (err) {
        setError("Hubo un problema al leer el caché.");
        console.error(err);
      }
    }
    getCached();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Pokémons en Caché</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <div className="row">
        <div className="col-md-4">
          <ul className="list-group">
            {cachedPokemons.map((p, i) => (
              <li
                key={`${p.id}-${i}`}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedPokemon(p)}
              >
                {p.name?.toUpperCase?.() || "(sin nombre)"}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-8">
          {selectedPokemon ? (
            <PokemonStats pokemon={selectedPokemon} />
          ) : (
            <p className="text-center">Selecciona un Pokémon para ver sus estadísticas</p>
          )}
        </div>
      </div>
    </div>
  );
};