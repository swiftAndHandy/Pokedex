function generatePokedexHtml(pokemon, pokemonName, colorScheme, set, index) {
    const typesHtml = generateTypeHtml(pokemon);
    return `
    <div class="card preview card-collection type--${colorScheme} overview-card" id="pokedex-name-${pokemonName}" onclick="openDetailCard(${set}, ${index})">
        <div class="card-body pokemon__photo-box";>
            <div class="name-and-id">
                <h3 class="card-title font-color--${colorScheme}">${pokemonName}</h4>
                <h4># ${pokemon['id']}</h4>
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


function generateTypeHtml(pokemon) {
    let response = "";
    for (i = 0; i < pokemon.types.length; i++) {
        response += `<span class="pokemon__type-info type-info--${pokemon.types[i].type.name}">${pokemon.types[i].type.name}</span>`;
    }
    return response;
}