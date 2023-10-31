export function fetchEventData(username) {
    return fetch(`/event/${username}`)
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        return response.json();
    });
}

export function fetchAddEvent(eventDetails, username) {
    return fetch(`/event/${username}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        console.log(response);
    });
}

export function fetchUpdateEventBudget(eventId, newBudget) {
    return fetch(`/event/updateBudget/${eventId}`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ newBudget }),
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        console.log(response);
    });
}

export function fetchDeleteEvent(eventId) {
    return fetch(`/event/${eventId}`, {
        method: 'DELETE',
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        return response.json();
    });
}