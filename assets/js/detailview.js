function playPokemonCry(set, index) {
    let pokemon = pokemonDetails[set][index];
    let audioFile = new Audio(pokemon['cries'][SOUND_STYLE]);
    currentAudio?.pause();
    currentAudio = audioFile;
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
    const card = `card-1-`;
    resetCardDesign(lastPokemon); // reset, before update the last pokemon
    lastPokemon = pokemon;
    renderDetailCardHeader(card, pokemon, set, index);
    renderDetailCardTabs(pokemon);
}


async function renderDetailCardTabs(pokemon) {
    renderStats(pokemon);
    const skillList = await fetchSkills(pokemon);
    await renderSkills(skillList);
}


function renderStats(pokemon) {
    const stats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
    const statNames = ['HP', 'Atack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'];
    const highestStatValue = findHighestStat(pokemon, stats);
    for (let i = 0; i < stats.length; i++) {
        const target = document.getElementById(stats[i]);
        let targetPercentage = statvaluePercentage(pokemon, i, highestStatValue);
        target.style.width = `${targetPercentage}%`;
        target.innerHTML = `${statNames[i]}: ${pokemon['stats'][i]['base_stat']} points`;
    }
}


async function fetchSkills(pokemon) {
    const skill = pokemon['abilities'];
    let skillInfo = [];
    for (let i = 0; i < skill.length; i++) {
        skillInfo.push(await (await fetch(skill[i]['ability'].url)).json());
    }
    return skillInfo;
}

async function renderSkills(skillList) {
    const target = document.getElementById('skills-tab');
    let skillHtml = '<h3>Skills:</h3>';
    for (let i = 0; i < skillList.length; i++) {
        skillHtml += renderSkillHtml(skillList[i]);
    }
    target.innerHTML = skillHtml;
}


function findHighestStat(pokemon, stats) {
    let highestValue = null;
    for (let i = 0; i < stats.length; i++) {
        currentStatsvalue = pokemon['stats'][i]['base_stat'];
        highestValue = currentStatsvalue > highestValue ? currentStatsvalue : highestValue;
    }
    return highestValue;
}

function statvaluePercentage(pokemon, index, highestValue) {
    const stat = pokemon['stats'][index]['base_stat'];
    return Number((stat * 100) / highestValue).toFixed();
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
    let currentName = null;

    while (!currentName || !pokemonIsSearched(currentName, keyword)) {
        ++index;
        if (index > indexMax || set == lastSet && index > currentIndexMax) {
            index = 0;
            set = findCorrectSet(set, 'increase');
        }
        currentName = pokemonDetails[set][index].name;
    }
    openDetailCard(set, index, 'next');
}


function decreaseTillPreviousMatch(set, index) {
    let keyword = document.getElementById('search').value.toLowerCase();
    const indexMax = SET_LIMIT - 1;
    const currentIndexMax = calculateLastSetsMaxIndex();
    const lastSet = pokemonDetails.length - 1;
    let currentName = null;

    while (!currentName || !pokemonIsSearched(currentName, keyword)) {
        --index;
        if (index < 0) {
            set = findCorrectSet(set, 'decrease');
            index = set < lastSet ? indexMax : currentIndexMax;
        }
        currentName = pokemonDetails[set][index].name;
    }
    openDetailCard(set, index, 'prev');
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
        prevButton.setAttribute('onclick', `decreaseTillPreviousMatch(${set}, ${index});stopBubbeling(event);`);
        nextButton.setAttribute('onclick', `increaseTillNextMatch(${set}, ${index});stopBubbeling(event);`);
    }
}


function resetCardDesign(pokemon, target = '1') {
    if (pokemon) {
        document.getElementById(`card-${target}-bg-target`).classList.remove(`bg-design--${getColorScheme(pokemon)}`);
    }
}


function findCorrectSet(set, method) {
    set = (method == 'decrease') ? decreaseSet(set) : (method == 'increase') ? increaseSet(set) : set;
    return set;
}


function increaseSet(set) {
    const maxSetIndex = pokemonDetails.length - 1;
    ++set;
    set = set > maxSetIndex ? 0 : set;
    return set;
}


function decreaseSet(set) {
    const maxSetIndex = pokemonDetails.length - 1;
    --set;
    set = set < 0 ? maxSetIndex : set;
    return set;
}


function flexTab(id) {
    for (let i = 0; i < 3; i++) {
        let target = document.getElementById(`card-1-tab-${i}`);
        i == id ? target.classList.add('flex') : target.classList.remove('flex');
    }
}