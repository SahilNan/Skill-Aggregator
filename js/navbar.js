function load_nav_bar(){
    bar = document.getElementById('navbarjs');
    
    for(const i of ['home.svg','search.svg']){
        let container = document.createElement('a');
        container.id= `${i.slice(0,-4)}`;
        
        const img = document.createElement('img');
        img.src = `icons/${i}`;

        container.appendChild(img);
        const textNode = document.createElement('span'); // Create a span for the text
        textNode.textContent= `${i.slice(0,-4)}`; // Set text content
        container.appendChild(textNode); 
        bar.appendChild(container);
    }
    home = document.getElementById('home');
    home.setAttribute("href", 'index.html');
    
    search = document.getElementById('search');
    search.setAttribute("href","search.html");
}


load_nav_bar()

document.addEventListener('DOMContentLoaded',function(){
    const navbar = document.getElementById('navbarjs');
    let currentURL = window.location.href;

    let children = navbar.childNodes;
    children.forEach(function(element){
        if(element.href===currentURL){ 
            element.classList.add('current-page');

        }
        else{
            element.classList.remove('current-page');
        }
    })

})