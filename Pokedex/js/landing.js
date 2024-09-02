document.addEventListener('DOMContentLoaded', () => {
  const pokemonGrid = document.getElementById('pokemon-grid');

  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

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

    button.addEventListener('click', () => {
      const queryParams = new URLSearchParams({
        id: pokemon.id
      }).toString();
      window.location.href = `info.html?${queryParams}`;
    });

    return button;
  };

  const fetchPokemonData = async (generationId) => {
    try {
      // Send a GET request to the PokeAPI to fetch data for the specified generation
      const response = await fetch(`https://pokeapi.co/api/v2/generation/${generationId}`);
      // Parse the response as JSON
      const data = await response.json();
      // Use Promise.all to fetch data for each Pokemon species in the generation
      const pokemonList = await Promise.all(data.pokemon_species.map(async (species) => {
        // Send a GET request to fetch data for the specific Pokemon species
        const pokemonResponse = await fetch(species.url);
        // Parse the response as JSON
        const pokemonData = await pokemonResponse.json();
        // Fetch additional details for the Pokemon
        const pokemonDetailsResponse = await fetch(pokemonData.varieties[0].pokemon.url);
        // Parse the response as JSON
        const pokemonDetails = await pokemonDetailsResponse.json();
        // Return an object containing the Pokemon's ID, name, and image URL
        return {
          id: pokemonDetails.id,
          name: pokemonDetails.name,
          image: pokemonDetails.sprites.front_default
        };
      }));

      pokemonGrid.innerHTML = ''; // Clear existing grid
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