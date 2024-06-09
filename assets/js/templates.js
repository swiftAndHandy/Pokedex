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
    const typesHtml = generateTypeHtml(pokemon, colorScheme);
    return `
    <div class="card card-collection type--${colorScheme} overview-card" id="pokedex-name-${pokemonName}" onclick="openDetailCard(${set}, ${index})">
        <div class="card-body pokemon__photo-box";>
            <div class="pokemon__info-box__header">
                <h4 class="card-title font-color--${colorScheme}">${pokemonName}</h4>
                <span># ${pokemon['id']}</span>
            </div>
            <div class="pokedex__card">
                <div class="pokemon__type-box">
                    ${typesHtml}
                </div>
                    <img src="${findPokemonImage(pokemon)}" class="pokedex__image" alt="image of ${pokemonName}">
            </div>
        </div>
    </div>
    `;
}

function generateTypeHtml(pokemon, colorScheme) {
    let response = "";
    for (i = 0; i < pokemon.types.length; i++) {
        response += `<span class="pokemon__type-info type-${colorScheme}">${pokemon.types[i].type.name}</span>`;
    }
    return response;
}