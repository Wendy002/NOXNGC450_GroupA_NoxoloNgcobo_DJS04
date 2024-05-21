import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
class BookPreview extends HTMLElement{
    
    
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
customElements.define("book-preview", BookPreview);