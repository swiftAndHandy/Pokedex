let pokemonList;
let pokemonDetails = [];
let countPokemonLoaded = 0
pokemonLoadingLimit = 649; // api: dream-world

const API_BASE_URL = 'https://pokeapi.co/api/v2/'
const LIMIT = 100;
const OFFSET = 0;
let i = 0;

function init() {
    includeHtml();
    fetchPokemonInformation();
}

function setLocalPokemonDetails(value) {
    localStorage.setItem('fetchedPokemon', JSON.stringify(value));
}

function getLocalPokemonDetails() {
    if (JSON.parse(localStorage.getItem('fetchedPokemon'))) {
        pokemonDetails = JSON.parse(localStorage.getItem('fetchedPokemon'));
    }
}

async function fetchPokemonInformation() {
    getLocalPokemonDetails();
    pokemonList = await fetchPokemonNames();
    await fetchPokemonDetails();
    renderAllPokemon();
}

async function fetchPokemonNames() {
    let pokemonCollection = await fetch(pokeAPI('pokemon'));
    let pokemonNamesJson = await pokemonCollection.json();
    return pokemonNamesJson;
}

async function fetchPokemonDetails() {
    const pokemonListResults = pokemonList['results'];
    let newDetails = [];
    if (morePokemonAllowed()) {
        for (let i = 0; i < pokemonListResults.length; i++) {
            if (morePokemonAllowed()) {
                await addPokemonInformation(newDetails, pokemonListResults, i);
            }
        }
        pokemonDetails.push(newDetails);
    }
}

function morePokemonAllowed() {
    //original was pokemonList['count'] - but this causes bugs since the api is making id-jumps at ~1025
    return countPokemonLoaded < pokemonLoadingLimit;
}

async function addPokemonInformation(newDetails, pokemonListResults, i) {
    let details = await fetch(pokemonListResults[i].url);
    let detailsData = await details.json();
    newDetails.push(detailsData);
    ++countPokemonLoaded;
}

function pokeAPI(path) {
    return API_BASE_URL + path + '?limit=' + LIMIT + '&offset=' + calculatedOffset();
}

function calculatedOffset() {
    return countPokemonLoaded + OFFSET;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function renderAllPokemon() {
    const catchedPokemon = pokemonDetails.length;
    const pokemonContainer = document.getElementById('pokemon-list');
    pokemonContainer.innerHTML = '';
    for (let set = 0; set < catchedPokemon; set++) {
        for (let i = 0; i < pokemonDetails[set].length; i++) {
            pokemonContainer.insertAdjacentHTML('beforeend', generatePokedex(set, i));
        }
    }
}

function generatePokedex(set, index) {
    const pokemon = pokemonDetails[set][index];
    const pokemonName = capitalizeFirstLetter(pokemon['name']);
    const colorScheme = getColorScheme(pokemon);
    return generatePokedexHtml(pokemon, pokemonName, colorScheme);
}

function getColorScheme(pokemon) {
    return pokemon.types[0].type.name;
}