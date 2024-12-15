import React, { useState } from "react";
import { useGetPokemonByIdQuery } from "./features/pokemon/pokemonApi";
import "./App.css";
function App() {
  const [pokemonId, setPokemonId] = useState(1);
  const {
    data: pokemon,
    isLoading,
    isError,
  } = useGetPokemonByIdQuery(pokemonId);

  const handleIncrease = () => {
    setPokemonId((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (pokemonId > 1) {
      setPokemonId((prev) => prev - 1);
    }
  };

  return (
    <div className="App">
      <div className="pokemon-container">
        <h1>Pokemon Viewer</h1>
        <div className="controls">
          <button onClick={handleDecrease} disabled={pokemonId <= 1}>
            Previous
          </button>
          <span>Current ID: {pokemonId}</span>
          <button onClick={handleIncrease}>Next</button>
        </div>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error loading Pokemon</div>}

        {pokemon && (
          <div className="pokemon-details">
            <h2>{pokemon.name}</h2>
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              width="200"
            />
            <div className="stats">
              <p>Height: {pokemon.height}</p>
              <p>Weight: {pokemon.weight}</p>
              <p>Base Experience: {pokemon.base_experience}</p>
            </div>
            {pokemonId === 5 && pokemon.name.first.second}
            {/* the above line is added to break code  */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
