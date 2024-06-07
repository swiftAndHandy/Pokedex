async function includeHtml() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function generatePokedexHtml(pokemon, pokemonName, colorScheme, set, index) {
    const typesHtml = generateTypeHtml(pokemon);
    return `
    <div class="card type--${colorScheme}" id="pokedex-name-${pokemonName}" onclick="openDetailCard(${set}, ${index})">
        <div class="card-body pokemon__photo-box" onclick="playPokemonCry(${set}, ${index})";>
            <div class="pokemon__info-box__header">
                <h5 class="card-title font-color--${colorScheme}">${pokemonName}</h5>
                <span># ${getPokemonId(pokemon)}</span>
            </div>
            <div class="pokedex__card">
                <div class="pokemon__type-box">
                    ${typesHtml}
                </div>
                    <img src="${pokemon['sprites']['other']['dream_world']['front_default']}" class="pokedex__image" alt="//">
            </div>
        </div>
    </div>
    `;
}

function generateTypeHtml(pokemon) {
    let response = "";
    for (i = 0; i < pokemon.types.length; i++) {
        response += `<span class="pokemon__type-info">${pokemon.types[i].type.name}</span>`;
    }
    return response;
}