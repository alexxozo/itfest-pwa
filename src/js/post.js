export function post(url = ``, data) {
    // Default options are marked with *
    return fetch(url, {
        method: "POST",
        mode: "cors",
        body: data,
    })
        .then(response => response.json())
        .catch(error => console.error(error)); // parses response to JSON
}