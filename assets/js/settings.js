function changeSoundType() {
    const soundDescription = document.getElementById('sound-label').innerHTML;
    legacySound = !legacySound;
    soundDescription = legacySound ? "legacy cries active" : "latest cries active";
}


async function toggleSettings() {
    settingsOpen = !settingsOpen;
    settingsOpen ? showSettings() : hideSettings();
}

function updateVolume() {
    let target = document.getElementById('loudness-slider-label')
    let value = document.getElementById('loudness-slider').value;
    VOLUME = value / 100;
    target.innerHTML = `Volume: ${value}%`;
}

function toggleAutoload() {
    const toggleDescription = document.getElementById('autoload-toggle-label');
    const loadingButton = document.getElementById('load-more');
    AUTOLOAD = !AUTOLOAD;
    if (AUTOLOAD) {
        toggleDescription.innerHTML = 'Autoload: active';
        loadingButton.classList.add('d-none');
        startSpinner('bar');
        fetchPokemonInformation();
    } else {
        toggleDescription.innerHTML = 'Autoload: off';
        if (morePokemonAllowed) {
            loadingButton.classList.remove('d-none');
        }
    }
}


function toggleSoundType() {
    const toggleDescription = document.getElementById('sound-style-toggle-label');
    SOUND_STYLE = SOUND_STYLE === 'legacy' ?  'latest' : 'legacy';
    toggleDescription.innerHTML = SOUND_STYLE === 'legacy' ? 'Sound Style: Legacy' : 'Sound Style: Modern'; 
}


function showSettings() {
    document.getElementById('settings-view').classList.remove('d-none');
    document.getElementById('body').classList.add('scroll-behavior--blocked');
    document.getElementById('pokemon-list').classList.add('hidden-by-settings');
}


function hideSettings() {
    document.getElementById('settings-view').classList.add('d-none');
    document.getElementById('body').classList.remove('scroll-behavior--blocked');
    document.getElementById('pokemon-list').classList.remove('hidden-by-settings');
}