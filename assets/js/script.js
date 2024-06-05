let pokemonList;
let pokemonDetails;

const API_BASE_URL = 'https://pokeapi.co/api/v2/'
const LIMIT = 30;
const OFFSET = 0;
let i = 0;

function init() {
    includeHtml();
    fetchPokemonInformation();
}

async function fetchPokemonInformation() {
    pokemonList = await fetchPokemonNames();
    pokemonDetails = await fetchPokemonDetails();
    renderAllPokemon();
}

async function fetchPokemonNames() {
    let pokemonCollection = await fetch(pokeAPI());
    let pokemonNamesJson = await pokemonCollection.json();
    return pokemonNamesJson;
}

async function fetchPokemonDetails() {
    const pokemonListResults = pokemonList['results'];
    let detailsJson = [];
    for (let i = 0; i < pokemonListResults.length; i++) {
        let details = await fetch(pokemonListResults[i].url);
        let detailsData = await details.json();
        detailsJson.push(detailsData);
    }
    console.log(detailsJson);
    return detailsJson;
}

function pokeAPI() {
    return API_BASE_URL + 'pokemon' + '?limit=' + LIMIT + '&offset=' + OFFSET;
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