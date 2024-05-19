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

//initialize variables  
let page = 1;
let matches = books

const starting = document.createDocumentFragment()
const startingSlicedObject =  matches.slice(0, BOOKS_PER_PAGE)
createBookPreview(starting, startingSlicedObject)       //use the createBookPreview 

// Create genre options
function createGenreOptions() {
    const genreFragment = document.createDocumentFragment();                 // Create a document fragment to hold the genre options
    const firstGenreElement = document.createElement('option');              // Create the "All Genres" option element
    firstGenreElement.value = 'any';                                                                                                            
    firstGenreElement.innerText = 'All Genres';                  
    genreFragment.appendChild(firstGenreElement);    // Append the genre options to the search genres element
    createObjectEntries(genres, genreFragment);     // Create the rest of the genre options using the createObjectEntries function
    document.querySelector('[data-search-genres]').appendChild(genreFragment);    // Append the "All Genres" option to the fragment
}
//call function
createGenreOptions();

// Create author options
function createAuthorOptions() {
    const authorFragment = document.createDocumentFragment();    // Create a document fragment to hold the author options
    const firstAuthorElement = document.createElement('option');
    firstAuthorElement.value = 'any';
    firstAuthorElement.innerText = 'All Authors';             // Create the "All Authors" option element
    authorFragment.appendChild(firstAuthorElement);  // Append the "All Authors" option to the fragment
    createObjectEntries(authors, authorFragment);          // Create the rest of the author options using the createObjectEntries function
    document.querySelector('[data-search-authors]').appendChild(authorFragment);    // Append the author options to the search authors element
}
//call function
createAuthorOptions(); 


// Function to set the theme based on the user's preferred color scheme
function setThemeBasedOnUserPreference() {
    // Check if the window.matchMedia API is supported
    if (window.matchMedia) {
      // Use the ternary operator to set the theme based on the user's preference
      document.querySelector('[data-settings-theme]').value = 
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
      // Use the changeTheme function to apply the selected theme
      changeTheme(document.querySelector('[data-settings-theme]').value);
    }
  }
  
// Call the function to set the theme
setThemeBasedOnUserPreference();

// Function to update the "Show more" button
function updateShowMoreButton() {

    const button = document.querySelector('[data-list-button]');
    
    // Calculate the number of remaining books
    const remainingBooks = matches.length - (page * BOOKS_PER_PAGE);
    
    // Update the button text to show the number of remaining books
    button.innerText = `Show more (${remainingBooks > 0 ? remainingBooks : 0})`;
    
    // Disable the button if there are no more books to show
    button.disabled = remainingBooks <= 0;
    
    button.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${remainingBooks > 0 ? remainingBooks : 0})</span>
    `;
}
  
  // Call the function to update the button
updateShowMoreButton();
//------------------------------event  listeners-------------------------------------------
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
//---------------------------event listeners ------------------------------------------------------
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    changeTheme(theme == 'night'? 'night':'day')   //use the change theme function   
    document.querySelector('[data-settings-overlay]').open = false
})


document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)

    matches = filterBooks(books,filters) // use filterBooks function withh given form data filter
    page = 1;
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
    //call updateshowmore function 

    updateShowMoreButton();

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

// Select the "Show more" button element
document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment(); 
    // Slice the matches array to get the next set of books to display
    const fragmentSlicedObject = matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE);
    
    // Create the book preview elements for the sliced object and append them to the fragment
    createBookPreview(fragment, fragmentSlicedObject);
    
    // Increment the page number to keep track of which books to display next
    page += 1;
    
  });
//-------------------------------------------Abstracted code-------------------------------------------------------
// Function to filter books based on the given filters
function filterBooks(books, filters) {
    const result = [];
  
    for (const book of books) {
      let genreMatch = filters.genre === 'any';
  
      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }
  
      if (
        (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === 'any' || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }
  
    return result;
  }

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
        // If the active flag is already set, exit the loop
      
        // Get the preview ID from the node's dataset
        const previewId = node?.dataset?.preview;
        // If a preview ID is found
        if (previewId) {
          // Find the book with the matching ID and set it as the active book
          active = books.find((book) => book.id === previewId);
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