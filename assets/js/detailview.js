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
    const pokemonName = capitalizeFirstLetter(pokemon['species']['name']);
    resetCardDesign(LAST_SLIDER, lastPokemon);
    lastPokemon = pokemon;
    document.getElementById(`card-${target}-bg-target`).classList.add(`bg-design--${getColorScheme(pokemon)}`);
    document.getElementById(`card-title-${target}`).innerHTML = pokemonName;
    console.log(`${pokemonName} sollte angezeigt werden auf ${target}/${CURRENT_SLIDER}`);
}

function updateNavigationButtons(set, index) {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    prevButton.setAttribute('onclick', `previousPokemon(${set}, ${index});animateNavigation('prev');stopBubbeling(event);`);
    nextButton.setAttribute('onclick', `nextPokemon(${set}, ${index});animateNavigation('next');stopBubbeling(event);`);

}

function resetCardDesign(target, pokemon) {
    if (pokemon) {
        setTimeout(() => {
            const pokemonName = capitalizeFirstLetter(pokemon['species']['name']);
            console.log(`Hier sollte auf Karte ${target} ${pokemonName} gelöscht werden.`);
            document.getElementById(`card-${target}-bg-target`).classList.remove(`bg-design--${getColorScheme(pokemon)}`);    
        }, 600);
        
    }
}

function previousPokemon(set, index) {
    const indexMax = SET_LIMIT - 1;
    LAST_SLIDER = CURRENT_SLIDER;
    --CURRENT_SLIDER;
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
    ++CURRENT_SLIDER;
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
