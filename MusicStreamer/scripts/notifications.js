export function errorMessage (message) {
    const errorBox = document.getElementById('errorBox');
    errorBox.style.display = 'block';
    errorBox.textContent = message;

    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 2000);
}

export function infoMessage (message) {

    const infoBox = document.getElementById('infoBox');
    infoBox.style.display = 'block';
    infoBox.textContent = message;

    setTimeout(() => {
        infoBox.style.display = 'none';
    }, 2000);
}