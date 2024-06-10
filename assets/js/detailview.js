function playPokemonCry(set, index) { // add where needed: onclick="playPokemonCry(${set}, ${index})";
    let pokemon = pokemonDetails[set][index];
    let soundType = SOUND_STYLE ? 'legacy' : 'latest';
    let audioFile = new Audio(pokemon['cries'][soundType]);
    audioFile.play();
}

function closeDetailView() {
    const viewContainer = document.getElementById('detail-view');
    viewContainer.classList.add('d-none');
    // await renderDetailCard();
}

function openDetailCard(set, index) {
    const pokemon = pokemonDetails[set][index];
    updateNavigationButtons(set, index);
    const viewContainer = document.getElementById('detail-view');
    viewContainer.classList.remove('d-none');
    renderDetailCard(pokemon, set, index);
}

function renderDetailCard(pokemon, set, index, target = CURRENT_SLIDER) {
    console.log(pokemon, set, index, target);
    document.getElementById(`card-${target}-bg-target`).classList.add(`bg-design--${getColorScheme(pokemon)}`);
}

function updateNavigationButtons(set, index) {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    prevButton.setAttribute('onclick', `previousPokemon(${set}, ${index});stopBubbeling(event);`);
    nextButton.setAttribute('onclick', `nextPokemon(${set}, ${index});stopBubbeling(event);`);

}

async function previousPokemon(set, index) {
    const indexMax = SET_LIMIT - 1;
    --index;
    if (index < 0) {
        index = indexMax;
        set = await findCorrectSet(set, 'decrease');
    }
    CURRENT_SLIDER--;
    verifyCurrentSlider();
    openDetailCard(set, index);
}

async function nextPokemon(set, index) {
    const indexMax = SET_LIMIT - 1;
    ++index;
    if (index > indexMax) {
        index = 0;
        set = await findCorrectSet(set, 'increase');
    }
    CURRENT_SLIDER++;
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
