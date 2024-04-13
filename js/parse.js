class Parser{
  constructor(){
    this.dataPromise = this.parse_data(); //automatically gets the data from the json file, can also be replaced by any data type
  
  }
  async parse_data() {
    const response = fetch("final.json");
    const data = (await response).json();
    return data;
  }
  

  count(type,job,occur){
    if(type == "fields"){    
      if(job[type] != ""){
        if (occur[job[type]] == undefined){
          
          occur[job[type]] =1
        }else{
          occur[job[type]]++;
        }
      }else{    
      }
    }    
    else{
        for(let skill of job[type]){
          if (occur[skill] == undefined){
            occur[skill] =1
          }else{
            occur[skill]++;
          }
        }
    }
  }

  async getData(type,timePeriod){
    //Gets data for a particular type and time period, the types being skills and fields
    let occur = {};
  
    const data = await this.dataPromise; // data is list of dicts
    const today = new Date();
    for(let job of data){ //job is a dict
      if(timePeriod == "all"){
        this.count(type,job,occur)
      }else{
        //Gets the jobs that are within the time frame
        const day = new Date(job["post-date"]);
        const time_elapsed_ms = today.getTime() - day.getTime();
        if(Math.floor((time_elapsed_ms)/(1000 * 60 * 60 * 24)) < timePeriod*30){
          this.count(type,job,occur)
        }
      }
    }
    return occur
  }
  async getGraphData(type,timePeriod){
    let occur = await this.getData(type,timePeriod);

    const dataArray = Object.entries(occur);
    //only shows the top 15 , the remaining are grouped in other
  //this should not occur for fields
    let chart_vals=[];
    dataArray.sort((a, b) => b[1] - a[1]);
    const top15 = dataArray.slice(0, 15);
    let remaining = 0;
    for(let i=15;i<dataArray.length;i++){
      remaining = remaining + dataArray[i][1]
    }
    
    for(const field of top15){
      chart_vals.push({name:field[0],value:field[1]});
    }
    chart_vals.push({name:"other",value:remaining});
    return chart_vals;
    
  }
    
  //searchs by title/Company , Domain , Skillset 
  async getJobs(titleOrCompany,domain,skillSet){
    let job_list = [];

    const data = await this.dataPromise;

    function checkWordsPresence(array1, array2) {
      return array1.every(word => array2.includes(word));
  };
    for(let job of data){
      let meetsCriteria= { "title" : null,"domain":null,"skills":null};
      //When there are multiple words

      if(titleOrCompany.length !==0){
        let inputWords = titleOrCompany.toLowerCase().split(" ");
        
        let titleWords  = job["title"].toLowerCase().split(" ");
        let company = [job["company"]];        
        if(checkWordsPresence(inputWords,titleWords) || checkWordsPresence(inputWords,company)){
          
          meetsCriteria['title']= true;
        }else{
          meetsCriteria['title']= false;
        }

    }
      
      if(domain !== "null"){
        if(domain !== job["fields"])
        {
          meetsCriteria['domain'] = false;
        }else{
          meetsCriteria['domain'] = true;
        }
        

      }
      
      if(skillSet !== null){
        console.log('hi')
        let hasAllSkills = true;
        for(let skill of skillSet)
        {
          if(!job['skills'].includes(skill))
          {
            hasAllSkills = false;
            break;
          }
        }
        if (hasAllSkills) {
          meetsCriteria['skills'] = true;
      }else{
        meetsCriteria['skills'] = false;
      }

        
      }

      
      
      console.log(meetsCriteria);
      if(!Object.values(meetsCriteria).some(value => value === false)){
        job_list.push({name:job["title"],company:job["company"],skills:job["skills"],domain:job["fields"]})
      }
    }
    return job_list;


  }
}


