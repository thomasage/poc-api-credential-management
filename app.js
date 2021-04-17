if (!navigator.credentials) {
    alert('Credential Management API not supported')
}

const url = new URL(location.href)
if (url.pathname === '/' || url.pathname === '/index.html') {
    credentialsFetch()
        .then(credentials => loginCheck(credentials.id, credentials.password))
        .catch(() => {
            location.href = '/login.html'
        })
} else if (url.pathname === '/login.html') {
    document.getElementById('form-login').addEventListener('submit', loginSubmit)
}

/**
 * @returns {Promise}
 */
function credentialsFetch() {
    console.debug('CALL credentialsFetch')
    if (!navigator.credentials) {
        return Promise.reject(501)
    }
    return navigator.credentials
        .get({password: true})
        .then(credentials => credentials ? Promise.resolve(credentials) : Promise.reject(404))
}

/**
 * @param {String} id
 * @param {String} password
 * @returns {Promise}
 */
function credentialsStore(id, password) {
    console.debug('CALL credentialsStore')
    if (!navigator.credentials) {
        return Promise.reject(501)
    }
    const credentials = new PasswordCredential({id, password})
    return navigator.credentials.store(credentials)
}

/**
 * Fake authentication
 * @param {String} username
 * @param {String} password
 * @returns {Promise}
 */
function loginCheck(username, password) {
    if (username === 'myuser' && password === 'supersecret') {
        return Promise.resolve(200)
    }
    return Promise.reject(401)
}

/**
 * @param {Event} event
 */
function loginSubmit(event) {
    console.debug('CALL loginSubmit')
    event.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    loginCheck(username, password)
        .then(() => {
            credentialsStore(username, password)
        })
        .then(() => {
            location.href = 'index.html'
        })
        .catch(() => {
            alert('Bad Credentials')
        })
}
