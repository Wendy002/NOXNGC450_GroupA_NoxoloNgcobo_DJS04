### Discussion and Reflection

- Challenges encountered while converting the book preview and other elements into Web Components.
  **challenges** 
  - Started by  creating a separate file to try  create the web component - Failed 
  - At first i didnt use getAttribute method to get elements but tried creatig a function that get those elements while i was still using separate files, resulted in book previews not displaying
  - When the custom template was created outside the class, the book reviews were not clickable - hence I created a function to include everything i want to put under  connectedCallback()

- The rationale behind selecting certain elements for conversion into Web Components.
  - The book review template/fragment was not encapsulated and the buttons were some what slow .
  
- Insights gained about the advantages and limitations of using Web Components in web development.
   **advantages**
  - Web components are strongly encapsulated, which means they are self-contained
  - Web components can be customized with custom elements, shadow DOM, and HTML templates.
  **limitations**
  - The web components API is somewhat complex and low-level, making it harder to use than other libraries like React.
