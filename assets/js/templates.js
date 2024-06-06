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

function generatePokedexHtml(set, index) {
    const pokemon = pokemonDetails[set][index];
    const pokemonName = capitalizeFirstLetter(pokemon['name']);
    const typesHtml = generateTypeHtml(pokemon);
    return `
    <div class="card text-bg-success">
        <div class="card-body pokemon__photo-box">
            <h5 class="card-title">${pokemonName}</h5>
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