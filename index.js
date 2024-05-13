// `https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchInput}&format=json&origin=*&srlimit=20`

const form = document.querySelector('form')
const input = document.querySelector('input')
const errorMsg = document.querySelector('.error-msg')
const resultsDisplay = document.querySelector('.results-display')
const loader = document.querySelector('.loader')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (input.value === '') {
        errorMsg.textContent = 'Veuillez effectuer une recherche'
        return
    } else {
        errorMsg.style.display = 'none'
        errorMsg.textContent = ''
        loader.style.display = 'flex'
        resultsDisplay.textContent = '' // Vider le contenu de la précédente recherche
        wikiApiCall(input.value)
    }
})

async function wikiApiCall(searchInput) {
    try {
        const response = await fetch(
            `https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchInput}&format=json&origin=*&srlimit=20`
        )

        if (!response.ok) {
            throw new Error(response.status)
        }

        const data = await response.json()

        createCards(data.query.search)
    } catch (err) {
        errorMsg.style.display = 'block'
        errorMsg.textContent = err
        console.error(err)
        loader.style.display = 'none'
    }
}

function createCards(data) {
    if (!data.length) {
        errorMsg.style.display = 'block'
        errorMsg.textContent = 'Aucun résultat trouvé'
        loader.style.display = 'none'
        return
    }

    data.forEach((el) => {
        const url = `https://fr.wikipedia.org/?curid=${el.pageid}`

        const card = document.createElement('div')
        card.className = 'result-item'

        const titleCard = document.createElement('h3')
        titleCard.className = 'result-title'

        const titleLinkCard = document.createElement('a')
        titleLinkCard.href = url
        titleLinkCard.target = '_blank'
        titleLinkCard.textContent = el.title
        titleCard.append(titleLinkCard)

        const linkCard = document.createElement('a')
        linkCard.href = url
        linkCard.className = 'result-link'
        linkCard.target = '_blank'
        linkCard.textContent = url

        const descriptionCard = document.createElement('span')
        descriptionCard.className = 'result-snippet'
        descriptionCard.innerHTML = el.snippet

        const br = document.createElement('br')

        card.append(titleCard, titleLinkCard, linkCard, descriptionCard, br)
        resultsDisplay.append(card)
    })
    loader.style.display = 'none'
}
