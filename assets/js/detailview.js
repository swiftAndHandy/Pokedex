/**
 * Creates an Audio-Element and plays it. To prevent a sound overflow a current audio will be paused when set. 
 * @param {Int} set 
 * @param {Int} index 
 */

function playPokemonCry(set, index) {
    let pokemon = pokemonDetails[set][index];
    let audioFile = new Audio(pokemon['cries'][SOUND_STYLE]);
    currentAudio?.pause();
    currentAudio = audioFile;
    audioFile.volume = VOLUME;
    audioFile.play();
}


/**
 * Closes the detail-view by adding the css class d-none to the detail-view-div.
 * Reallows to scroll, by removing scroll-behavior-blocked from body.
 */
function closeDetailView() {
    const pageView = document.getElementById('body');
    pageView.classList.remove('scroll-behavior--blocked');
    const viewContainer = document.getElementById('detail-view');
    viewContainer.classList.add('d-none');
    resetCardDesign(lastPokemon);
}


/**
 * Blocks scroll-behavior on body. 
 * 
 * @param {Int} set 
 * @param {Int} index 
 */
async function openDetailCard(set, index) {
    skillInformationRequired && startSpinner('ball', 'information');
    const pageView = document.getElementById('body');
    pageView.classList.add('scroll-behavior--blocked');
    const pokemon = pokemonDetails[set][index];
    updateNavigationButtons(set, index);
    const viewContainer = document.getElementById('detail-view');
    viewContainer.classList.remove('d-none');
    await renderDetailCard(pokemon, set, index);
    skillInformationRequired && stopSpinner();
}


async function renderDetailCard(pokemon, set, index) {
    const card = `card-1-`;
    resetCardDesign(lastPokemon); // reset, before update the last pokemon
    lastPokemon = pokemon;
    renderDetailCardHeader(card, pokemon, set, index);
    await renderDetailCardTabs(pokemon);
}


/**
 * Prepares output of Pokémon-Details. Stats are saved in let pokemonDetails, but the skillList requires another API fetch.
 * @param {Array} pokemon - contains a specific item of pokemonDetails[set][index];
 */
async function renderDetailCardTabs(pokemon) {
    renderStats(pokemon);
    const skillList = await fetchSkills(pokemon);
    renderSkills(skillList);
}


/**
 * const stats - included data-name in API Output. 
 * const statNames - This Indices will be uses as display output
 * @param {*} pokemon - contains a specific item of pokemonDetails[set][index];
 */
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


/**
 * Fetches Poke API based on a specific pokemon
 * @param {Array} pokemon - contains a specific item of pokemonDetails[set][index];
 * @returns - A JSON with all details about the skill (Name/Description)
 */
async function fetchSkills(pokemon) {
    const skill = pokemon['abilities'];
    let skillInfo = [];
    for (let i = 0; i < skill.length; i++) {
        skillInfo.push(await (await fetch(skill[i]['ability'].url)).json());
    }
    return skillInfo;
}

/**
 * Renders the skillList of the pokemon @detail-view. 
 * @param {JSON} skillList 
 */
function renderSkills(skillList) {
    const target = document.getElementById('skills-tab');
    let skillHtml = '<h3>Skills:</h3>';
    for (let i = 0; i < skillList.length; i++) {
        skillHtml += renderSkillHtml(skillList[i]);
    }
    target.innerHTML = skillHtml;
}


/**
 * Compares every pokemon stat a pokémon can have, to find the highest value possible.
 * @param {Array} pokemon - contains a specific item of pokemonDetails[set][index];
 * @param {Array} stats - ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
 * @returns the highestValue a stat reached
 */
function findHighestStat(pokemon, stats) {
    let highestValue = null;
    for (let i = 0; i < stats.length; i++) {
        currentStatsvalue = pokemon['stats'][i]['base_stat'];
        highestValue = currentStatsvalue > highestValue ? currentStatsvalue : highestValue;
    }
    return highestValue;
}

/**
 * Calculates a stats relative high, compared to the highest stat of the pokemon. Highest Stat is 100%.
 * @param {Array} pokemon - contains a specific item of pokemonDetails[set][index];
 * @param {Int} index - it's called in renderStats(), so index is based on a for-loop
 * @param {Int} highestValue 
 * @returns percentage of ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
 * 
 */

function statvaluePercentage(pokemon, index, highestValue) {
    const stat = pokemon['stats'][index]['base_stat'];
    return Number((stat * 100) / highestValue).toFixed();
}


/**
 * The base length of a set is given in script.js => const SET_LIMIT. 
 * But when every pokemon is loaded it could be, that the last set contains less than SET_LIMITs items.
 * To prevent bugs when go to next/prev-Pokemon in Detail-View it's important to analyse the correct length of the set.
 * @returns the length of the current last set
 * <br><br>
 * 
 */
function calculateLastSetsMaxIndex() {
    let currentSets = pokemonDetails.length - 1;
    let currentSetLength = pokemonDetails[currentSets].length - 1;
    return currentSetLength;
}


/**
 * Converts value of search to lower case. 
 * Increases the index/set till the Name of the Pokémon is matching search-keyword.
 * @param {Int} set - set of the current Pokémon
 * @param {Int} index - index of the current Pokémon
 */
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
            set = increaseSet(set);
        }
        currentName = pokemonDetails[set][index].name;
    }
    openDetailCard(set, index, 'next');
}


/**
 * Converts value of search to lower case. 
 * Decreases the index/set till the Name of the Pokémon is matching search-keyword.
 * @param {Int} set - set of the current Pokémon
 * @param {Int} index - index of the current Pokémon
 */
function decreaseTillPreviousMatch(set, index) {
    let keyword = document.getElementById('search').value.toLowerCase();
    const indexMax = SET_LIMIT - 1;
    const currentIndexMax = calculateLastSetsMaxIndex();
    const lastSet = pokemonDetails.length - 1;
    let currentName = null;

    while (!currentName || !pokemonIsSearched(currentName, keyword)) {
        --index;
        if (index < 0) {
            set = decreaseSet(set);
            index = set < lastSet ? indexMax : currentIndexMax;
        }
        currentName = pokemonDetails[set][index].name;
    }
    openDetailCard(set, index, 'prev');
}


/**
 * The API doesn't provide the english information allways on the same index.
 * So this function goes trough the JSON till it finds the english information and returns the index.
 * Since this issue is possible for skill names and also for descriptions, it's required to set the wanted information as param.
 * @param {JSON} skill 
 * @param {string} type - can be name of desc
 * @returns the index of the english information
 */
function findEnglishInformation(skill, type) {
    if (type == 'name') {
        for (let i = 0; i < skill['names'].length; i++) {
            if (skill['names'][i]['language']['name'] == 'en') {
                return i;
            }
        }
    } else if (type == 'desc') {
        for (let i = 0; i < skill['effect_entries'].length; i++) {
            if (skill['effect_entries'][i]['language']['name'] == 'en') {
                return i;
            }
        }
    }
}

/**
 * @param {string} name of the pokemon
 * @param {string} keyword - searchbar value
 * @returns true, when pokémon-name includes the keyword
 */
function pokemonIsSearched(name, keyword) {
    let state = name.toLocaleLowerCase().includes(keyword);
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

/**
 * Updates JavaScript-Functions on various buttons, based on the displayed pokemons set and index.
 * To keep them up to date is important, because the current set/index is the starting point for the linked functions.
 * @param {Int} set - pokemon Position in json
 * @param {Int} index - pokemon position in json
 */
function updateNavigationButtons(set, index) {
    for (i = 0; i < 2; i++) {
        const prevButton = document.getElementById(`prev-button-${i}`);
        const nextButton = document.getElementById(`next-button-${i}`);
        prevButton.setAttribute('onclick', `decreaseTillPreviousMatch(${set}, ${index});stopBubbeling(event);`);
        nextButton.setAttribute('onclick', `increaseTillNextMatch(${set}, ${index});stopBubbeling(event);`);
        nextButton.setAttribute('onclick', `increaseTillNextMatch(${set}, ${index});stopBubbeling(event);`);
    }
}

/**
 * Resets the colorScheme of detailView-Card to prevent stacking of multiple designs and display issues. 
 * @param {*} pokemon - contains a specific item of pokemonDetails[set][index];
 * @param {string} target - in this version not required to set. it's a relict of an older version, where detail-view used more cards
 */
function resetCardDesign(pokemon, target = '1') {
    if (pokemon) {
        document.getElementById(`card-${target}-bg-target`).classList.remove(`bg-design--${getColorScheme(pokemon)}`);
    }
}

/**
 * If current set is > latestSet, set the set to 0. Otherwise increase the set-number.
 * @param {Int} set 
 * @returns new set value
 */
function increaseSet(set) {
    const maxSetIndex = pokemonDetails.length - 1;
    ++set;
    set = set > maxSetIndex ? 0 : set;
    return set;
}


/**
 * If current set is >= 0, reduce the set-number. Or, if the set is < 0, go to the latest set.
 * @param {Int} set 
 * @returns new set value
 */
function decreaseSet(set) {
    const maxSetIndex = pokemonDetails.length - 1;
    --set;
    set = set < 0 ? maxSetIndex : set;
    return set;
}

/**
 * Update the tab-bar on detail-view. This function is called when clicking on a tab (index.html - detail-view).
 * If the Tab id is == 1, it's required to set skillInformationRequired to true. This enables a loading-screen on skill-information. 
 * @param {Int} id 
 */
function flexTab(id) {
    skillInformationRequired = id == 1 ? true : false;
    for (let i = 0; i < 3; i++) {
        let target = document.getElementById(`card-1-tab-${i}`);
        i == id ? target.classList.add('flex') : target.classList.remove('flex');
    }
}