import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

// Had to copy the whole class from book-review-test.js into this file so that the components show
// Define a custom HTML element called "book-preview"
customElements.define(
    "book-preview",
    class extends HTMLElement {
      // Constructor for the custom element
      constructor() {
        super();
        // Attach a shadow root to the custom element (shadow DOM)
        this.attachShadow({ mode: "open" });
      }
  
      // Called when the element is inserted into the DOM
      connectedCallback() {
        // Render the book preview template
        this.render();
      }
  
      // Define the attributes that will be watched for changes
      static get observedAttributes() {
        return ['author', 'id', 'image', 'title'];
      }
  
      // Render the book preview template
      render() {
        // Get the attributes of the custom element
        const author = this.getAttribute('author');
        const id = this.getAttribute('id');
        const image = this.getAttribute('image');
        const title = this.getAttribute('title');
  
        // Create a template element
        const template = document.createElement('template');
        /*set template with book preview html*/
        template.innerHTML = `
          <style>
            .preview {
              border-width: 0;
              width: 100%;
              font-family: Roboto, sans-serif;
              padding: 0.5rem 1rem;
              display: flex;
              align-items: center;
              cursor: pointer;
              text-align: left;
              border-radius: 8px;
              border: 1px solid rgba(var(--color-dark), 0.15);
              background: rgba(var(--color-light), 1);
            }
  
            @media (min-width: 60rem) {
              .preview {
                padding: 1rem;
              }
            }
  
            .preview_hidden {
              display: none;
            }
  
            .preview:hover {
              background: rgba(var(--color-blue), 0.05);
            }
  
            .preview__image {
              width: 48px;
              height: 70px;
              object-fit: cover;
              background: grey;
              border-radius: 2px;
              box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
                          0px 1px 1px 0px rgba(0, 0, 0, 0.1), 
                          0px 1px 3px 0px rgba(0, 0, 0, 0.1);
            }
  
            .preview__info {
              padding: 1rem;
            }
  
            .preview__title {
              margin: 0 0 0.5rem;
              font-weight: bold;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;  
              overflow: hidden;
              color: rgba(var(--color-dark), 0.8);
            }
  
            .preview__author {
              color: rgba(var(--color-dark), 0.4);
            }
          </style>
          <button class="preview" data-preview="${id}">
            <img class="preview__image" src="${image}" alt="${title}" />
            <div class="preview__info">
              <h3 class="preview__title">${title}</h3>
              <div class="preview__author">${authors[author]}</div>
            </div>
          </button>
        `;
        // Clear the shadow root before adding the new template
        this.shadowRoot.innerHTML = '';
        // Clone the template and add it to the shadow root
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }
  
      // Called when an attribute is changed
      attributeChangedCallback(name, oldValue, newValue) {
        // If the new value is different from the old value, render the change
        if (oldValue !== newValue) {
          this.render();
        }
      }
    }
  );
let page = 1;
let matches = books

const starting = document.createDocumentFragment()
const startingSlicedObject =  matches.slice(0, BOOKS_PER_PAGE)
createBookPreview(starting, startingSlicedObject)       //use the createBookPreview 

const genreHtml = document.createDocumentFragment()
const firstGenreElement = document.createElement('option')
firstGenreElement.value = 'any'
firstGenreElement.innerText = 'All Genres'
genreHtml.appendChild(firstGenreElement)

//use createObject entries function
createObjectEntries(genres, genreHtml);


document.querySelector('[data-search-genres]').appendChild(genreHtml)

const authorsHtml = document.createDocumentFragment()
const firstAuthorElement = document.createElement('option')
firstAuthorElement.value = 'any'
firstAuthorElement.innerText = 'All Authors'
authorsHtml.appendChild(firstAuthorElement)

//use createObject entries function
createObjectEntries(authors,authorsHtml);

document.querySelector('[data-search-authors]').appendChild(authorsHtml);


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector('[data-settings-theme]').value = 'night'
    changeTheme('night');   //use changeTheme function
} else {
    document.querySelector('[data-settings-theme]').value = 'day'
    changeTheme('day');   //use changeTheme function
}

document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
})

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    if (theme === 'night') {
        changeTheme('night');
    } else {
       changeTheme('day');
    }
    
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    matches = result

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    document.querySelector('[data-list-items]').innerHTML = ''
    const newItems = document.createDocumentFragment();
    const resultSlicedObject = result.slice(0, BOOKS_PER_PAGE);
    // replace the for loop  for newItems , use the createBookPreview
    createBookPreview(newItems, resultSlicedObject);

    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 0

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment();
    const fragmentSlicedObject = matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE);
    // replace the for loop  for this fragment , use the createBookPreview
    createBookPreview(fragment,fragmentSlicedObject)
    page += 1
})
//-------------------------------------------Abstracted code-------------------------------------------------------

//responsible for creating and adding book previews to a specified container element
function createBookPreview(fragment, slicedObject){            //CreateBookPreview function
    for (const { author, id, image, title } of slicedObject) {              
        const element = document.createElement('book-preview');
        element.setAttribute('author', author);
        element.setAttribute('id', id);
        element.setAttribute('image', image);
        element.setAttribute('title', title);
    
        fragment.appendChild(element)
    }
    document.querySelector('[data-list-items]').appendChild(fragment)
}
// refactor the for loop to use it multiple times without repetiton

function createObjectEntries(objectWithEntries, fragment){            

    for (const [id, name] of Object.entries(objectWithEntries)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = name
        fragment.appendChild(element)
    }

}

// Function that changes the theme of the webpage
function changeTheme(theme){

    if(theme === 'night'){
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');

    }
    else{
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }

}
//-------------------------------------------Abstracted code-------------------------------------------------------

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})