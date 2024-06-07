let pokemonList;
let pokemonDetails = [];
let countPokemonLoaded = 0
let pokemonLoadingLimit = 649; // Gen 5 Cap, don't change

const API_BASE_URL = 'https://pokeapi.co/api/v2/'
const SET_LIMIT = 20;  // LIMIT 0 -> API overwrites with a standard of 20
const OFFSET = 0;
let AUTOLOAD = false;

let legacySound = true;

async function init() {
    await includeHtml();
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
    console.log('Start new fetch');
    getLocalPokemonDetails();
    pokemonList = await fetchPokemonNames();
    await fetchPokemonDetails();
    await renderAllPokemon();
    evaluateAutoload();
}

async function evaluateAutoload() {
    if (AUTOLOAD) {
        await fetchPokemonInformation();
        console.log('Autoload triggered');
    } else {
        console.log('Autoload no more triggered');
        stopSpinner();
    }
}

async function fetchPokemonNames() {
    startSpinner();
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
            } else { break; }
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
    countPokemonLoaded >= pokemonLoadingLimit ? stopAutoload() : false;
}

function stopAutoload() {
    AUTOLOAD = false;
    console.log('Autoload stopped now, AUTOLOAD is ' + AUTOLOAD);
}

function pokeAPI(path) {
    return API_BASE_URL + path + '?limit=' + SET_LIMIT + '&offset=' + calculatedOffset();
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

function playPokemonCry(set, index) { // add where needed: onclick="playPokemonCry(${set}, ${index})";
    let pokemon = pokemonDetails[set][index];
    let soundType = legacySound ? 'legacy' : 'latest';
    let audioFile = new Audio(pokemon['cries'][soundType]);
    audioFile.play();

}

function changeSoundType() {
    legacySound = !legacySound;
    document.getElementById('sound-label').innerHTML = legacySound ? "legacy cries active" : "latest cries active";
}

async function previousPokemon(set, index) {
    const indexMax = SET_LIMIT - 1;
    --index;
    if (index < 0) {
        index = indexMax;
        set = await findCorrectSet(set, 'decrease');
    }
    console.log('Set: ' + set);
    console.log('Index: ' + index);
    openDetailCard(set, index);
}

async function nextPokemon(set, index) {
    const indexMax = SET_LIMIT - 1;
    ++index;
    if (index > indexMax) {
        index = 0;
        set = await findCorrectSet(set, 'increase');
    }
    console.log('Set: ' + set);
    console.log('Index: ' + index);
    openDetailCard(set, index);
}

function findCorrectSet(set, method) {
    if (method == 'decrease') {
        set = decreaseSet(set);
    } else if (method == 'increase') {
        set = increaseSet(set);
    }
    return set;
}

function openDetailCard(set, index) {

}

function increaseSet(set) {
    const maxSetIndex = pokemonDetails.length - 1;
    ++set;
    if (set > maxSetIndex) {
        set = 0;
    }
    return set;
}

function decreaseSet(set) {
    const maxSetIndex = pokemonDetails.length - 1;
    --set;
    if (set < 0) {
        set = maxSetIndex;
    }
    return set;
}

function startSpinner() {
    document.getElementById('pokemon-list').classList.add('dim-screen');
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function stopSpinner() {
    document.getElementById('pokemon-list').classList.remove('dim-screen');
    document.getElementById('loading-spinner').classList.add('d-none');
}