let pokemonList;
let pokemonDetails = [];
let allNames = [];
let countPokemonLoaded = 0;
let pokemonLoadingLimit = 649; // Gen 5 Cap, don't change

const API_BASE_URL = 'https://pokeapi.co/api/v2/'
const SET_LIMIT = 10;  // LIMIT 0 -> API overwrites with a standard of 20
const OFFSET = 0;
let AUTOLOAD = true;
let CURRENT_SLIDER = 1; // I'll use this later for detail view/carousel. 0 -> 2 left, center, right. next ++, previous --

let legacySound = true;

async function init() {
    loadLocalSettings();
    await includeHtml();
    await fetchPokemonInformation();
}

function saveLocalSettings(value) {
    localStorage.setItem('fetchedPokemon', JSON.stringify(value));
}

function loadLocalSettings() {
    if (JSON.parse(localStorage.getItem('fetchedPokemon'))) {
        pokemonDetails = JSON.parse(localStorage.getItem('fetchedPokemon'));
    }
}

async function fetchPokemonInformation() {
    startSpinner();
    loadLocalSettings();
    pokemonList = await fetchPokemonNames();
    await fetchPokemonDetails();
    await renderAllPokemon();
    stopSpinner();
    evaluateAutoload();
}

function evaluateAutoload() {
    if (AUTOLOAD) {
        startSpinner('bar');
        fetchPokemonInformation();
    }
}

async function fetchPokemonNames() {
    let pokemonCollection = await fetch(pokeAPI('pokemon'));
    let pokemonNamesJson = await pokemonCollection.json();
    return pokemonNamesJson;
}

async function fetchPokemonDetails() {
    startSpinner();
    const pokemonListResults = pokemonList['results'];
    let newDetails = [];
    if (morePokemonAllowed()) {
        for (let i = 0; i < pokemonListResults.length; i++) {
            if (morePokemonAllowed()) {
                await addPokemonInformation(newDetails, pokemonListResults, i);
            } else { stopSpinner('bar'); break; }
        }
        pokemonDetails.push(newDetails);
    }
}

function morePokemonAllowed() {
    //original was pokemonList['count'] - but this causes bugs since the api is making id-jumps at ~1025
    return allNames.length < pokemonLoadingLimit;
}

async function addPokemonInformation(newDetails, pokemonListResults, i) {
    let details = await fetch(pokemonListResults[i].url);
    let detailsData = await details.json();
    newDetails.push(detailsData);
    allNames.push(pokemonListResults[i]['name']);
    AUTOLOAD && morePokemonAllowed() ? updateProgressBar() : false;
    allNames.length >= pokemonLoadingLimit ? stopAutoload() : false;
}

function stopAutoload() {
    AUTOLOAD = false;
}

function pokeAPI(path) {
    return API_BASE_URL + path + '?limit=' + SET_LIMIT + '&offset=' + calculatedOffset();
}

function calculatedOffset() {
    return allNames.length + OFFSET;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function renderAllPokemon() {
    const latestSet = pokemonDetails.length - 1;
    const pokemonContainer = document.getElementById('pokemon-list');
        for (let i = 0; i < currentSetLength(latestSet); i++) {
            pokemonContainer.insertAdjacentHTML('beforeend', generatePokedex(latestSet, i));
        }
}

function currentSetLength(index) {
    return pokemonDetails[index].length;
}

function generatePokedex(set, index) {
    const pokemon = pokemonDetails[set][index];
    const pokemonName = capitalizeFirstLetter(pokemon['species']['name']);
    const colorScheme = getColorScheme(pokemon);
    return generatePokedexHtml(pokemon, pokemonName, colorScheme, set, index);
}

function getColorScheme(pokemon) {
    return pokemon.types[0].type.name;
}

function getPokemonId(pokemon) {
    return pokemon.game_indices[pokemon.game_indices.length - 1].game_index; // API provides bulletproof data only on the last entry
}

function startSpinner(style = 'ball') {
    if (!AUTOLOAD || allNames.length >= pokemonLoadingLimit) {
        document.getElementById('pokemon-list').classList.add('dim-screen');
        document.getElementById('loading-spinner').classList.remove('d-none');
    } else if (AUTOLOAD && style == 'bar') {
        document.getElementById('progress-div').classList.remove('d-none');
    }
}

function stopSpinner(style = 'ball') {
    if (style == 'ball') {
        document.getElementById('pokemon-list').classList.remove('dim-screen');
        document.getElementById('loading-spinner').classList.add('d-none');
    } else if (style == 'bar') {
        document.getElementById('progress-div').classList.add('d-none');
    }
}

function updateProgressBar() {
    const loadingBar = document.getElementById('loading-bar')
    let progress = allNames.length * 100 / pokemonLoadingLimit;
    loadingBar.style.width = progress + "%";
    loadingBar.innerHTML = `catched ${allNames.length}/${pokemonLoadingLimit} Pokemon`;

}

function searchForPokemon(keyword) {
    let currentSearch = document.getElementById('search');
}

function hidePokemon() {

}