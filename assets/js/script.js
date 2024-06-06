let pokemonList;
let pokemonDetails = [];

const API_BASE_URL = 'https://pokeapi.co/api/v2/'
const LIMIT = 20;
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
    // renderAllPokemon();
}

async function fetchPokemonNames() {
    let pokemonCollection = await fetch(pokeAPI());
    let pokemonNamesJson = await pokemonCollection.json();
    return pokemonNamesJson;
}

async function fetchPokemonDetails() {
    const pokemonListResults = pokemonList['results'];
    let newDetails = [];
    for (let i = 0; i < pokemonListResults.length; i++) {
        if (calculateTotalPokemonLoaded() < pokemonList['count']) {
            let details = await fetch(pokemonListResults[i].url);
            let detailsData = await details.json();
            newDetails.push(detailsData);
        }
    }
    pokemonDetails.push(newDetails);
    console.log(pokemonDetails);
}

function pokeAPI() {
    return API_BASE_URL + 'pokemon' + '?limit=' + LIMIT + '&offset=' + calculatedOffset();
}

function forAnIndexOf() {
    const fullSetsOfPokemon = (pokemonDetails.length) * LIMIT;
    // pokemonDetails[pokemonDetailsAmount] ? console.error('Details: ' + pokemonDetails[pokemonDetailsAmount].length) : false;
    return fullSetsOfPokemon;
}

function calculatedOffset() {
    return forAnIndexOf() + OFFSET;
}

function calculateTotalPokemonLoaded() {
    let fullSets = pokemonDetails.length;
    return fullSets;
}

// function progressBar() {
//     const progressBar = document.getElementById('progress-bar');
//     let currentProgress = setInterval(() => {
//         console.log(pokemonList['results'].length);
//     }, 100)
//     progressBar.style = "width:10%";
//     progressBar.innerHTML = "10%";
// }

async function renderAllPokemon() {
    const catchedPokemon = pokemonDetails.length;
    for (let i = 0; i < catchedPokemon.length; i++) {
        generatePokedexHtml(i);
    }
}