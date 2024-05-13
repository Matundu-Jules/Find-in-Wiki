// `https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchInput}&format=json&origin=*&srlimit=20`

const form = document.querySelector('form')
const input = document.querySelector('input')
const errorMsg = document.querySelector('.error-msg')
const resultsDisplay = document.querySelector('.results-display')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (input.value === '') {
        errorMsg.textContent = 'Veuillez effectuer une recherche'
        return
    } else {
        errorMsg.style.display = 'none'
        errorMsg.textContent = ''
        wikiApiCall(input.value)
    }
})

async function wikiApiCall(searchInput) {
    try {
        const response = await fetch(
            `https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchInput}&format=json&origin=*&srlimit=20`
        )
        console.log(response)

        const data = await response.json()
        console.log(data)

        createCards(data.query.search)
    } catch (err) {
        console.error(err)
    }
}

function createCards(data) {
    if (!data.length) {
        errorMsg.textContent = 'Aucun résultat trouvé'
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
}
