function changeSoundType() {
    legacySound = !legacySound;
    document.getElementById('sound-label').innerHTML = legacySound ? "legacy cries active" : "latest cries active";
}

function toggleSettings(openSettings) {
    openSettings ? showSettings() : hideSettings();
    document.getElementById('settings-toggle').onclick = function () {
        toggleSettings(!openSettings);
    };
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