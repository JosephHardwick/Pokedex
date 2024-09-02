
document.addEventListener('DOMContentLoaded', () => {
  // Create a URLSearchParams object to parse the query parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Get the 'id' parameter from the URL
  const id = urlParams.get('id');
  console.log('id:', id);

  //method to capitalize the first letter of a string
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const fetchPokemonData = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemonData = await response.json();

      const pokemon = {
        name: capitalize(pokemonData.name),
        image: pokemonData.sprites.front_default,
        id: pokemonData.id,
        height: pokemonData.height / 10,
        weight: pokemonData.weight / 10,
        type: pokemonData.types.map((type) => type.type.name),
        abilities: pokemonData.abilities.map((ability) => ability.ability.name),
      };

      // Populate the page with Pokémon data
      document.getElementById('pokemon-name').textContent = pokemon.name;
      document.getElementById('pokemon-image').src = pokemon.image;
      document.getElementById('pokemon-image').alt = pokemon.name;
      document.getElementById('pokemon-height').textContent = `Height: ${pokemon.height.toFixed(1)} m`;
      document.getElementById('pokemon-weight').textContent = `Weight: ${pokemon.weight.toFixed(1)} kg`;
      document.getElementById('pokemon-type').textContent = `Type: ${pokemon.type.join(', ')}`;
      document.getElementById('pokemon-abilities').textContent = `Abilities: ${pokemon.abilities.join(', ')}`;
      

    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  };

  fetchPokemonData();
});