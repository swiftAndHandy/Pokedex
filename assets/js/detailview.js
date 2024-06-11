function playPokemonCry(set, index) { // add where needed: onclick="playPokemonCry(${set}, ${index})";
    let pokemon = pokemonDetails[set][index];
    let audioFile = new Audio(pokemon['cries'][SOUND_STYLE]);
    audioFile.volume = VOLUME;
    audioFile.play();
}

function closeDetailView() {
    const pageView = document.getElementById('body');
    pageView.classList.remove('scroll-behavior--blocked');
    const viewContainer = document.getElementById('detail-view');
    viewContainer.classList.add('d-none');
    resetCardDesign(lastPokemon);
}

function openDetailCard(set, index, method = '') {
    const pageView = document.getElementById('body');
    pageView.classList.add('scroll-behavior--blocked');
    const pokemon = pokemonDetails[set][index];
    updateNavigationButtons(set, index);
    const viewContainer = document.getElementById('detail-view');
    viewContainer.classList.remove('d-none');
    renderDetailCard(pokemon, set, index);
    skipIfNotSearched(set, index, method);
}


function renderDetailCard(pokemon, set, index) {
    card = `card-1-`;
    resetCardDesign(lastPokemon); // reset, before update the last pokemon
    lastPokemon = pokemon;
    renderDetailCardHeader(card, pokemon, set, index);
}


function skipIfNotSearched(set, index, method) {
    if (method) {
        let keyword = document.getElementById('search').value.toLowerCase();
        const pokemonName = pokemonDetails[set][index]['species']['name'];
        if (!pokemonIsSearched(pokemonName, keyword)) {
            if (method == 'next') {
                increaseTillNextMatch(set, index);
            } else if (method == 'prev') {
                decreaseTillPreviousMatch(set, index);
            }
        }
    }
}

function calculateLastSetsMaxIndex() {
    let currentSets = pokemonDetails.length - 1;
    let currentSetLength = pokemonDetails[currentSets].length - 1;
    return currentSetLength;
}

function increaseTillNextMatch(set, index) {
    let keyword = document.getElementById('search').value.toLowerCase();
    const indexMax = SET_LIMIT - 1;
    const currentIndexMax = calculateLastSetsMaxIndex();
    const lastSet = pokemonDetails.length - 1;
    let currentName;
    while (!currentName || !pokemonIsSearched(currentName, keyword)) {
        ++index;
        if (index > indexMax || set == lastSet && index > currentIndexMax) {
            index = 0;
            set = findCorrectSet(set, 'increase');
        }
        currentName = pokemonDetails[set][index].name;
    }
    openDetailCard(set, index);
}

function decreaseTillPreviousMatch(set, index) {
    let keyword = document.getElementById('search').value.toLowerCase();
    const indexMax = SET_LIMIT - 1;
    const currentIndexMax = calculateLastSetsMaxIndex();
    const lastSet = pokemonDetails.length - 1;
    let currentName;

    while (!currentName || !pokemonIsSearched(currentName, keyword)) {
        --index;
        if (index < 0) {
            set = findCorrectSet(set, 'decrease');
            index = set < lastSet ? indexMax : currentIndexMax;
        }
        currentName = pokemonDetails[set][index].name;
    }
    openDetailCard(set, index);
}

function previousPokemon(set, index) {
    const method = 'prev';
    const indexMax = SET_LIMIT - 1;
    const currentIndexMax = calculateLastSetsMaxIndex();
    const lastSet = pokemonDetails.length - 1;
    --index;
    if (index < 0) {
        set = findCorrectSet(set, 'decrease');
    }
    openDetailCard(set, index, method);
}

function pokemonIsSearched(name, keyword) {
    state = name.toLocaleLowerCase().includes(keyword);
    return state;
}


function renderDetailCardHeader(card, pokemon, set, index) {
    const typesHtml = generateTypeHtml(pokemon);
    const pokemonName = capitalizeFirstLetter(pokemon['species']['name']);
    document.getElementById(`${card}bg-target`).classList.add(`bg-design--${getColorScheme(pokemon)}`);
    document.getElementById(`${card}title`).innerHTML = pokemonName;
    document.getElementById(`${card}poke-id`).innerHTML = `# ${pokemon['id']}`;
    document.getElementById(`${card}types`).innerHTML = typesHtml;
    document.getElementById(`${card}pokemon-image`).src = findPokemonImage(pokemon);
    document.getElementById(`${card}audio-player`).setAttribute('onclick', `playPokemonCry(${set}, ${index});stopBubbeling(event);`);
}


function updateNavigationButtons(set, index) {
    for (i = 0; i < 2; i++) {
        const prevButton = document.getElementById(`prev-button-${i}`);
        const nextButton = document.getElementById(`next-button-${i}`);
        prevButton.setAttribute('onclick', `previousPokemon(${set}, ${index});stopBubbeling(event);`);
        nextButton.setAttribute('onclick', `nextPokemon(${set}, ${index});stopBubbeling(event);`);
    }
}


function resetCardDesign(pokemon, target = '1') {
    if (pokemon) {
        document.getElementById(`card-${target}-bg-target`).classList.remove(`bg-design--${getColorScheme(pokemon)}`);
    }
}

function previousPokemon(set, index) {
    const method = 'prev';
    const indexMax = SET_LIMIT - 1;
    const currentIndexMax = calculateLastSetsMaxIndex();
    const lastSet = pokemonDetails.length - 1;
    --index;
    if (index < 0) {
        set = findCorrectSet(set, 'decrease');
        index = set < lastSet ? indexMax : currentIndexMax;
    }
    openDetailCard(set, index, method);
}


function nextPokemon(set, index) {
    const method = 'next';
    const indexMax = SET_LIMIT - 1;
    const currentIndexMax = calculateLastSetsMaxIndex();
    const lastSet = pokemonDetails.length - 1;
    ++index;
    if (index > indexMax || set == lastSet && index > currentIndexMax) {
        index = 0;
        set = findCorrectSet(set, 'increase');
    }
    openDetailCard(set, index, method);
}


function findCorrectSet(set, method) {
    if (method == 'decrease') {
        set = decreaseSet(set);
    } else if (method == 'increase') {
        set = increaseSet(set);
    }
    return set;
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


function flexTab(id) {
    for (let i = 0; i < 3; i++) {
        let target = document.getElementById(`card-1-tab-${i}`);
        i == id ? target.classList.add('flex') : target.classList.remove('flex');
    }
}