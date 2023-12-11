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

// Guests services
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

export function fetchDeleteGuest(guestId) {
    return fetch(`/api/event/guests/${guestId}`, {
        method: 'DELETE',
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        return response.json();
    });
}

export function fetchUpdateGuest(guestId, guestDetail) {
    return fetch(`/api/event/guest/${guestId}`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify( guestDetail ),
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        return response.json();
    });

}

// To-do services
export function fetchAddTodo(eventId, todoDetails) {
    return fetch(`/api/event/todo/${eventId}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify( todoDetails ),
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        if(!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    });
}

export function fetchDeleteTodo(itemId) {
    return fetch(`/api/event/todo/${itemId}`, {
        method: 'DELETE',
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        return response.json();
    });
}

export function fetchMarkDone(itemId) {
    return fetch(`/api/event/todo/${itemId}`, {
        method: 'PATCH',
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        return response.json();
    });
}

// Expenses services
export function fetchAddExpense(eventId, expenseDetails) {
    return fetch(`/api/event/expenses/${eventId}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify( expenseDetails ),
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
        if(!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    });
}

export function fetchDeleteExpense(expenseId) {
    return fetch(`/api/event/expenses/${expenseId}`, {
        method: 'DELETE',
    })
    .catch( () => Promise.reject({ error: 'network-error' }))
    .then( response => {
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