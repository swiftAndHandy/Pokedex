function changeSoundType() {
    legacySound = !legacySound;
    document.getElementById('sound-label').innerHTML = legacySound ? "legacy cries active" : "latest cries active";
}

function toggleSettings(state) {
    if (state) {
        document.getElementById('settings-view').classList.remove('d-none')
    } else {
        document.getElementById('settings-view').classList.add('d-none')
    }
    state = !state
    document.getElementById('settings-toggle').onclick = function() { 
        toggleSettings(state); 
    };

    // document.getElementById('settings-toggle').onclick = () => toggleSettings(state);
}