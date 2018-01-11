function setupPostbox() {
    const postboxes = document.getElementsByClassName('postbox');
    for (let i = 0; i < postboxes.length; i += 1) {
        const postbox = postboxes[i];
        AEditor.init(postbox);
    }
    if (postboxes.length) {
        AEditor.emojifyEditors();
    }
}

$(document).ready(() => {
    AEditor.emojifyInit();
    setupPostbox();
    $('.ui.dropdown').dropdown();
});
