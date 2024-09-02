document.addEventListener('DOMContentLoaded', () => {
  const pokemonGrid = document.getElementById('pokemon-grid');

  // Function to capitalize the first letter of a string
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Function to create a grid item for a Pokemon
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

    // Event listener for button click to navigate to Pokemon info page
    button.addEventListener('click', () => {
      const queryParams = new URLSearchParams({
        id: pokemon.id
      }).toString();
      window.location.href = `info.html?${queryParams}`;
    });

    return button;
  };

  // Function to fetch Pokemon data for a specific generation
  const fetchPokemonData = async (generationId) => {
    try {
      //API GET request to pull all pokemon for a given generation
      const response = await fetch(`https://pokeapi.co/api/v2/generation/${generationId}`);
      //parses the response into json
      const data = await response.json();
        //creates list of pekemon from json data
        const pokemonList = await Promise.all(data.pokemon_species.map(async (species) => {
          //pulls URLs from previous request
          const pokemonResponse = await fetch(species.url);
          //parses data for specific pokemon
          const pokemonData = await pokemonResponse.json();
          //pulls data for specific pokemon
          const pokemonDetailsResponse = await fetch(pokemonData.varieties[0].pokemon.url);
          const pokemonDetails = await pokemonDetailsResponse.json();
          
          return {
            id: pokemonDetails.id,
            name: pokemonDetails.name,
            image: pokemonDetails.sprites.front_default
          };
        }));
      // Clear existing grid
      pokemonGrid.innerHTML = ''; 
      // Create grid items for each Pokemon
      pokemonList.forEach((pokemon) => {
        const gridItem = createGridItem(pokemon);
        pokemonGrid.appendChild(gridItem);
      });
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  };

  const buttons = document.querySelectorAll('.topnav button');
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      fetchPokemonData(index + 1); // Generation IDs are 1-based
    });
  });

  fetchPokemonData(1); // Fetch initial generation (Gen 1)
});