// `https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchInput}&format=json&origin=*&srlimit=20`
// `https://fr.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchInput}&gsrlimit=20&prop=extracts&exintro&explaintext&format=json&origin=*`

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
            `https://fr.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchInput}&gsrlimit=20&prop=extracts&exintro&explaintext&format=json&origin=*`
        )

        if (!response.ok) {
            throw new Error(response.status)
        }

        const data = await response.json()

        if (!data.query) {
            errorMsg.style.display = 'block'
            loader.style.display = 'none'
            throw new Error('Aucun résultat trouvé')
        }

        createCards(data.query.pages)
    } catch (err) {
        errorMsg.style.display = 'block'
        errorMsg.textContent = err
        console.error(err)
        loader.style.display = 'none'
    }
}

function createCards(data) {
    const values = Object.values(data)

    values.forEach((el) => {
        const url = `https://fr.wikipedia.org/?curid=${el.pageid}`

        const card = document.createElement('div')
        card.className = 'result-item'

        const titleCard = document.createElement('h2')
        titleCard.className = 'result-title'

        const titleLinkCard = document.createElement('a')
        titleLinkCard.href = url
        titleLinkCard.target = '_blank'
        titleLinkCard.textContent = el.title
        titleCard.append(titleLinkCard)

        const linkCard = document.createElement('p')
        linkCard.className = 'result-link'
        linkCard.textContent = url

        const descriptionCard = document.createElement('span')
        descriptionCard.className = 'result-snippet'
        descriptionCard.innerHTML = el.extract

        card.append(titleCard, linkCard, descriptionCard)
        resultsDisplay.append(card)
    })
    loader.style.display = 'none'
}
