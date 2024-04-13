class loader{
    constructor(){
        this.parser = new Parser();
    }

    loadBox(type,timePeriod){
        let container = document.getElementById(`${type}-container`);
        let title = document.createElement('p');
        title.textContent = `Top ${type}`;
        container.appendChild(title);
        this.loadDropDown(type);
        this.generate_chart(type,timePeriod);
    }

    async generate_chart(type,timePeriod){
        if(document.getElementById(`${type}-chart`) != undefined)
        {
            document.getElementById(`${type}-chart`).remove()
        }
    
        let chartDiv = document.createElement('div');    
        let dropDown = document.getElementById(`selector-${type}`)    
        chartDiv.id = `${type}-chart`;//Change this interferes with studd
        let container = document.getElementById(`${type}-container`);
        container.insertBefore(chartDiv,dropDown)
        
        
        

        let graphData = await this.parser.getGraphData(type,timePeriod);
        let chart = echarts.init(chartDiv);
        let options = {
            color: [
                '#bc15ef',
                '#61a0a8',
                '#d48265',
                '#91c7ae',
                '#749f83',
                '#ca8622',
                '#bda29a',
                '#6e7074',
                '#546570',
                '#c4ccd3'
              ],   
            series: [
            { 
                type: 'pie',
                data: graphData,
                label: {
                    textBorderColor: 'transparent',    
                    textStyle: {
                        color: 'black',
                        textBorderColor: 'transparent',    
                    },
                    
                        
                    }
    
                    
                  },
                
                
            
          ]
      };
    
        chart.setOption(options);
    
    
    };
    loadDropDown(type){

        let dropDown = document.createElement('select');
        
        let option1 = document.createElement('option');
        option1.value = "All time";
        option1.textContent = "All Time";
    
        let option2 = document.createElement('option');
        option2.value = "1 Month";
        option2.textContent = "1 Month";
    
        let option3 = document.createElement('option');
        option3.value = "3 Months";
        option3.textContent = "3 Month";
       
        dropDown.appendChild(option1);
        dropDown.appendChild(option2);
        dropDown.appendChild(option3);
        dropDown.classList.add("time-selector");
        dropDown.id = `selector-${type}`;
        let container = document.getElementById(`${type}-container`);
        container.appendChild(dropDown);
    
    }

    initializeChartEvent() {
        let selectorSkill = document.getElementById("selector-skills");
        selectorSkill.addEventListener("change",() => {
            
            let selected = selectorSkill.value;
            
            let words = selected.split(/\s+/);
            let old_graph = document.getElementById("skills-chart");
            old_graph.remove();
            if(words[0].toLowerCase() == "all"){
                this.generate_chart("skills","all");
            }else{
                this.generate_chart("skills",parseInt(words[0]));
            }
            
        });
        let selectorField = document.getElementById("selector-fields");
        selectorField.addEventListener("change",() => {
            let selected = selectorField.value;
            let words = selected.split(/\s+/);
            let old_graph = document.getElementById("fields-chart");
            old_graph.remove();
            if(words[0].toLowerCase() == "all"){
                this.generate_chart("fields","all");
            }else{
                this.generate_chart("fields",parseInt(words[0]));
            }
            
        });


    }

    init(){
        this.loadBox("skills","all");
        this.loadBox("fields","all");
        this.initializeChartEvent();
    }
}

let c = new loader();
c.init();
