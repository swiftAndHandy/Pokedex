function playPokemonCry(set, index) { // add where needed: onclick="playPokemonCry(${set}, ${index})";
    let pokemon = pokemonDetails[set][index];
    let soundType = SOUND_STYLE ? 'legacy' : 'latest';
    let audioFile = new Audio(pokemon['cries'][soundType]);
    audioFile.play();
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

async function openDetailCard(set, index) {
    const viewContainer = document.getElementById('detail-view');
    viewContainer.classList.remove('d-none');
}