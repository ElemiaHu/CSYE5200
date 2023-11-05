export function fetchSession() {
    return fetch('/api/session')
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        if(!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    });
}

export function fetchLogin(username) {
    return fetch('/api/session', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ username }),
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        if(!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    });
}

export function fetchLogout() {
    return fetch('/api/session', {
        method: 'DELETE',
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => response.json());
}

export function fetchEventData(userId) {
    return fetch(`/api/user/event/${userId}`)
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        if(!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    });
}

export function fetchAddEvent(eventDetails, userId) {
    return fetch(`/api/event/${userId}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        if(!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    });
}

export function fetchEventDetails(eventId) {
    return fetch(`/api/event/${eventId}`)
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        if(!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    });
}

export function fetchEventGuests(eventId) {
    return fetch(`/api/event/guests/${eventId}`)
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        if(!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    });
}

export function fetchAddGuest(eventId, guestDetails) {
    return fetch(`/api/event/guests/${eventId}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(guestDetails),
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        if(!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    });
}

export function fetchEventTodo(eventId) {
    return fetch(`/api/event/todo/${eventId}`)
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        if(!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    });
}

export function fetchEventExpenses(eventId) {
    return fetch(`/api/event/expense/${eventId}`)
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        if(!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
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