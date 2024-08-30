//used to wait for DOM to load before executing the code
document.addEventListener('DOMContentLoaded', () => {
  const pokemonGrid = document.getElementById('pokemon-grid');

  //function to capitalize the first letter of a string
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Function to create a grid item
  const createGridItem = (pokemon) => {
    const button = document.createElement('button');
    button.className = 'grid-item';

    const img = document.createElement('img');
    img.src = pokemon.image;
    img.alt = pokemon.name;

    const name = document.createElement('h2');
    name.textContent = capitalize(pokemon.name);

    button.appendChild(img);
    button.appendChild(name);

    // Add event listener to the button for redirection
    button.addEventListener('click', () => {
      const queryParams = new URLSearchParams({
        id: pokemon.id
      }).toString();
      window.location.href = `info.html?${queryParams}`;
    });

    return button;
  };

  // Fetch Pokémon data from PokeAPI
  const fetchPokemonData = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      const pokemonList = await Promise.all(data.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        return {
          id: pokemonData.id,
          name: pokemonData.name,
          image: pokemonData.sprites.front_default
        };
      }));

      pokemonList.forEach((pokemon) => {
        const gridItem = createGridItem(pokemon);
        pokemonGrid.appendChild(gridItem);
      });
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  };

  fetchPokemonData();
});