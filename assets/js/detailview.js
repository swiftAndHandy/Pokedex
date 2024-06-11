function playPokemonCry(set, index) { // add where needed: onclick="playPokemonCry(${set}, ${index})";
    let pokemon = pokemonDetails[set][index];
    let soundType = SOUND_STYLE ? 'legacy' : 'latest';
    let audioFile = new Audio(pokemon['cries'][soundType]);
    audioFile.play();
}

function closeDetailView() {
    const pageView = document.getElementById('body');
    pageView.classList.remove('scroll-behavior--blocked');
    const viewContainer = document.getElementById('detail-view');
    viewContainer.classList.add('d-none');
    // resetCardDesign(LAST_SLIDER, lastPokemon, true);
}

function openDetailCard(set, index) {
    const pageView = document.getElementById('body');
    pageView.classList.add('scroll-behavior--blocked');
    const pokemon = pokemonDetails[set][index];
    updateNavigationButtons(set, index);
    const viewContainer = document.getElementById('detail-view');
    viewContainer.classList.remove('d-none');
    renderDetailCard(pokemon, set, index);
}

function renderDetailCard(pokemon, set, index, target = CURRENT_SLIDER) {
    card = `card-${target}-`;
    resetCardDesign(lastPokemon); // reset, before update the last pokemon
    lastPokemon = pokemon;
    renderDetailCardHeader(card, pokemon);
}

function renderDetailCardHeader(card, pokemon) {
    const typesHtml = generateTypeHtml(pokemon);
    const pokemonName = capitalizeFirstLetter(pokemon['species']['name']);
    document.getElementById(`${card}bg-target`).classList.add(`bg-design--${getColorScheme(pokemon)}`);
    document.getElementById(`${card}title`).innerHTML = pokemonName;
    document.getElementById(`${card}poke-id`).innerHTML = `# ${pokemon['id']}`;
    document.getElementById(`${card}types`).innerHTML = typesHtml;
    document.getElementById(`${card}pokemon-image`).src = findPokemonImage(pokemon);
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
    const indexMax = SET_LIMIT - 1;
    LAST_SLIDER = CURRENT_SLIDER;
    // --CURRENT_SLIDER;
    --index;
    if (index < 0) {
        index = indexMax;
        set = findCorrectSet(set, 'decrease');
    }
    verifyCurrentSlider();
    openDetailCard(set, index);
}

function nextPokemon(set, index) {
    const indexMax = SET_LIMIT - 1;
    LAST_SLIDER = CURRENT_SLIDER;
    // ++CURRENT_SLIDER;
    ++index;
    if (index > indexMax) {
        index = 0;
        set = findCorrectSet(set, 'increase');
    }
    verifyCurrentSlider();
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

function verifyCurrentSlider() {
    if (CURRENT_SLIDER < 0) {
        CURRENT_SLIDER = 2;
    } else if (CURRENT_SLIDER > 2) {
        CURRENT_SLIDER = 0;
    }
}

function flexTab(id) {
    for (let i = 0; i < 3; i++) {
        let target = document.getElementById(`card-1-tab-${i}`);
        i == id ? target.classList.add('flex') : target.classList.remove('flex');
    }
}