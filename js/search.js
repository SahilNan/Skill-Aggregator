class optionsLoader{
    constructor(){
        this.p = new Parser();
        this.fields = null;
        this.skills = null;
        this.initData();
        this.chosenSkills = [];
    }
    

    async initData(){
        this.fields = await this.p.getData('fields','all');
        this.skills = await this.p.getData('skills','all');
    }
    loadOptions(){
        let searchbar = document.createElement('input');
        searchbar.id = "search-bar";
        searchbar.placeholder ="search titles or companies"
        


        let optionsContainer = document.createElement('div');
        optionsContainer.id = 'options-container'
        let domain = document.createElement('select');
        

        domain.id = 'domain-selector'
        let base = document.createElement('option');
        base.value = null;
        base.textContent = 'All';
        domain.appendChild(base); 
        for(let field in this.fields)
        {
            let option = document.createElement('option');
            option.value = field;
            option.textContent =field;
            domain.appendChild(option);
        }

        optionsContainer.appendChild(searchbar);
        optionsContainer.appendChild(domain);
        this.loadHeading(optionsContainer);
        let skillBar = document.createElement('div');
        skillBar.id = "skill-bar";
        optionsContainer.appendChild(skillBar);
        document.body.appendChild(optionsContainer);
        
        
        let resultsDiv = document.createElement('div');
        resultsDiv.id = 'results-container';
        document.body.appendChild(resultsDiv);

    }
    loadSkillSelector(){

        let container =document.createElement('div');
        container.classList.add('multi-select');

        let addbox = document.createElement('div');
        let text = document.createElement('p');
        text.textContent = "Add Skills";
        let down = document.createElement('img');
        down.src = "icons/arrow-down.svg";
        addbox.appendChild(text);
        addbox.appendChild(down);
        addbox.classList.add("select-box")

        let optioncontainer =document.createElement('div');
        optioncontainer.classList.add('options')


        let searcher = document.createElement('input');
        searcher.placeholder = "Search";
        searcher.classList.add('search-boxer');
        optioncontainer.appendChild(searcher);
        for(let skill in this.skills){
            let option = document.createElement('div');
            option.textContent = skill;
            option.classList.add('option');
            optioncontainer.appendChild(option)
        }
        container.appendChild(addbox);
        container.appendChild(optioncontainer);
        let optionsContainer = document.getElementById('options-container');
        optionsContainer.append(container);

    
    }        
    attachEventListeners(){
        this.handleOptionSelection();

        document.getElementById("search-btn").addEventListener('click', ()=>{
            let title = document.getElementById('search-bar');//value is obtained
            let domainSelector = document.getElementById('domain-selector');
            const selectedValue = domainSelector.value; //Value is obtained
            
            title = title.value.trim();
            console.log(`Title is : ${title}\nDomain is : ${selectedValue}\nskillset is  : ${this.chosenSkills}`)
            
            if(this.chosenSkills.length ===0){
                loadResults(title,selectedValue,null);
            }
            else{
                loadResults(title,selectedValue,this.chosenSkills);
            }
        })
        
    }

    loadSearchBtn(){
        let searchBtn = document.createElement('button');
        searchBtn.id="search-btn";
        searchBtn.textContent = "Search"
        let optionsContainer = document.getElementById('options-container');
        optionsContainer.append(searchBtn);

    }

    loadHeading(container){
        let mainHeading = document.createElement('h2');
        mainHeading.textContent = "Search Jobs"
        mainHeading.classList.add("text-label")

        
        container.appendChild(mainHeading);
        
    }
    handleOptionSelection(){
        const box = document.querySelector('.select-box');
        const options = document.querySelector('.options');
        const searchBox = document.querySelector('.search-boxer');
        
        // Toggle options display
        box.addEventListener('click', function() {
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
        searchBox.value = "";
        
       
        });
            
        // Filter options based on search input
        searchBox.addEventListener('input', function() {
            const searchText = searchBox.value.toLowerCase();
            const optionElements = document.querySelectorAll('.option');
            
            
            optionElements.forEach(function(option) {
                const optionText = option.textContent.toLowerCase();
                if (optionText.includes(searchText)) {
                option.style.display = 'block';
                } else {
                option.style.display = 'none';
                }
            });
        });
            
        // Handle option selection
        options.addEventListener('click', (event) => {
            const selectedOption = event.target;
            if (selectedOption.classList.contains('option')) {
                if (selectedOption.classList.contains('selected')) {
                selectedOption.classList.remove('selected');
                } else {
                selectedOption.classList.add('selected');
                }
                // Close dropdown after selecting an option
                options.style.display = 'none';
                // Add selected option value to list
                if(this.chosenSkills.indexOf(selectedOption.textContent.trim()) !== -1){
                }else{
                    this.chosenSkills.push(selectedOption.textContent.trim());
                    this.loadSelectedSkillOptions();
                

                }
                
            }
            });
    }

    loadSelectedSkillOptions(){
        //Generates the list of skills on the page
        let bar = document.getElementById("skill-bar");

        let addedSkill = this.chosenSkills[this.chosenSkills.length-1]
        if(addedSkill !== undefined){
            let option = document.createElement('div');
            option.classList.add('skill-display')
            let text = document.createElement('p');

            text.textContent = addedSkill;

            let remove = document.createElement('img');
            remove.classList.add("x-btn");
            remove.src = "icons/x.svg";
            option.appendChild(text);
            option.appendChild(remove);
            bar.appendChild(option);


        }
        
            

        
    }

    removeSkills(){
        const container = document.getElementById('skill-bar');
        container.addEventListener('click', (event)=>{
            if (event.target.classList.contains("x-btn")) {
                // Get the skill that was clicked
                const clickedSkill = event.target;
                const text = clickedSkill.previousSibling.textContent;

            
                let index = this.chosenSkills.indexOf(text);
                this.chosenSkills.splice(index,1);
                let parent = clickedSkill.parentNode
                // Remove the clicked skill from the DOM and from the skill List
                parent.parentNode.removeChild(parent);
              }

        });

    }
    async init(){
        await this.initData();
        this.loadOptions();
        this.loadSkillSelector();
        
        this.loadSearchBtn();
        this.attachEventListeners();
        this.removeSkills();
    }

}



let o = new optionsLoader();
o.init();


let lp = new Parser();

//Creates cards
async function loadResults(titleOrCompany,Domain,SkillList)
{
    function removeAllChildren(element) {
        while (element.hasChildNodes()) {
          element.removeChild(element.firstChild);
        }
      }
    
    let jobs = await lp.getJobs(titleOrCompany,Domain,SkillList);
    
    
    
    
    let resultsDiv = document.getElementById('results-container');
    removeAllChildren(resultsDiv);
    
    
    for(let i of jobs){
        let card = document.createElement('div');
        card.classList.add("job-card");
        const jobNameDiv = document.createElement("p");
        jobNameDiv.textContent = i.name;
        jobNameDiv.classList.add("job-title");
    
        const companyDiv = document.createElement("p");
        companyDiv.textContent = i.company;
        companyDiv.classList.add("company-name");

        const skillList = document.createElement("div");
        skillList.classList.add("job-skills")
        for(let j of i["skills"])
        {
            let skill = document.createElement("p");
            skill.textContent = j;
            skillList.appendChild(skill);
        }
        card.appendChild(jobNameDiv);
        card.appendChild(companyDiv);
        card.appendChild(skillList);
        resultsDiv.appendChild(card);
    }
    
    

}

loadResults('');


