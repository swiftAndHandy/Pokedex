/**
 * This variables are necessairy for the fetching process. 
 * It's possible to increase the pokemonLoadingLimit, but in this case the Sprite-Style will change after 649 Pokemon.
 * This is the limit for dreamworldsprites, since they only exist till Pokémon-Generation 5.
 */
let pokemonList = null;
let pokemonDetails = [];
let countPokemonLoaded = 0;
const pokemonLoadingLimit = 649;

/**
 * This variables are required for Detail-View
 */
let lastPokemon = null;
let skillInformationRequired = false;

/**
 * This Settings are related to the pokeapi.co.
 * SET_LIMIT = 0 -> API Base Value of 20
 * OFFSET is used for calculatedOffset() and increases with countPokemonLoaded (global). It's not necessary to set this, only if you wan't to skip some pokemon.
 * dreamworldSprites exist only for the first 649 Pokemon; i use this as a const only for readability of code.
 */
const API_BASE_URL = 'https://pokeapi.co/api/v2/'
const SET_LIMIT = 0;
const OFFSET = 0;
const dreamworldSprites = 649; // 

/**
 * Some values the user can change in settings-menu
 */
let AUTOLOAD = false;
let SOUND_STYLE = 'latest';
let settingsOpen = false;
let VOLUME = 0.5;
let currentAudio = null;


async function init() {
    loadLocalSettings();
    hideLoadMore();
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
        fetchPokemonInformation();
    }
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
            } else { break; }
        }
        pokemonDetails.push(newDetails);
    }
}


function morePokemonAllowed() {
    return countPokemonLoaded < pokemonLoadingLimit;
}


async function addPokemonInformation(newDetails, pokemonListResults, i) {
    let details = await fetch(pokemonListResults[i].url);
    let detailsData = await details.json();

    newDetails.push(detailsData);
    ++countPokemonLoaded;
    AUTOLOAD && morePokemonAllowed() ? updateProgressBar() : stopAutoload();
}


function stopAutoload() {
    if (AUTOLOAD) {
        document.getElementById('autoload-toggle').disabled = true;
        document.getElementById('autoload-toggle').checked = false;
        document.getElementById('autoload-toggle-label').innerHTML = "Autoload complete";
    }
    AUTOLOAD = false;
    stopSpinner('bar');
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
    const latestSet = pokemonDetails.length - 1;
    const pokemonContainer = document.getElementById('pokemon-list');

    for (let i = 0; i < currentSetLength(latestSet); i++) {
        pokemonContainer.insertAdjacentHTML('beforeend', generatePokedex(latestSet, i));
        isASearchRequired();
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

/**
 * 
 * @param {string} style 
 * @param {string} text 
 */
function startSpinner(style = 'ball', text = '') {
    if (AUTOLOAD && style == 'bar') {
        document.getElementById('progress-div').classList.remove('d-none');
    } else if (text == 'information') {
        document.getElementById('skill-loading-spinner').classList.remove('d-none');
    } else if (!AUTOLOAD || countPokemonLoaded >= pokemonLoadingLimit) {
        document.getElementById('loading-spinner').classList.remove('d-none');
    }
}

function stopSpinner(style = 'ball') {
    if (style == 'ball') {
        document.getElementById('loading-spinner').classList.add('d-none');
        document.getElementById('skill-loading-spinner').classList.add('d-none');
    } else if (style == 'bar') {
        document.getElementById('progress-div').classList.add('d-none');
    }
}


function hideLoadMore() {
    if (pokemonLoadingLimit === countPokemonLoaded || AUTOLOAD) {
        document.getElementById('load-more').classList.add('d-none');
    }
}


function updateProgressBar() {
    const loadingBar = document.getElementById('loading-bar')
    let progress = countPokemonLoaded * 100 / pokemonLoadingLimit;

    loadingBar.style.width = progress + "%";
    loadingBar.innerHTML = `catched ${countPokemonLoaded}/${pokemonLoadingLimit} Pokemon`;
}

function isASearchRequired() {
    if (document.getElementById('search').value) {
        searchForPokemon();
    }
}


//Base-Search Function without a limit of pokemon showed
function searchForPokemon() {
    let keyword = document.getElementById('search').value.toLowerCase();
    let allPokedexCards = document.querySelectorAll('.overview-card');

    allPokedexCards.forEach(card => {
        let pokemonName = card.id.replace('pokedex-name-', '');
        if (pokemonName.toLocaleLowerCase().includes(keyword)) {
            card.classList.remove('d-none');
        } else {
            card.classList.add('d-none');
        }
    });
}


function findPokemonImage(pokemon) {
    let imageOf = pokemon['id'];
    return imageOf <= dreamworldSprites ? pokemon['sprites']['other']['dream_world']['front_default'] : pokemon['sprites']['front_default'];
}


function stopBubbeling(event) {
    event.stopPropagation();
}


function animateNavigation(side) {
    let target = side == 'prev' ? document.getElementById('prev-button') : document.getElementById('next-button');
    target.classList.add(`carousel-${side}-clicked`);
    target.disabled = true;
    setTimeout(() => {
        target.classList.remove(`carousel-${side}-clicked`);
        target.disabled = false;
    }, 600);
}
