export default class Filtering{
  filteredDailyData = []
  filteredWeeklyData = []
  filteredMonthlyData = []
  filteredYearlyData = []
  receivedData = null
  filterYear = null
  received = null
  filteredYears = []
  months = []
  constructor(data, filterYear){
    this.receivedData = data
    this.received = data
    this.filterYear = filterYear
    this.addDate()
    this.getYears(this.received)
  }
  addDate(){
    this.receivedData.forEach(element => {
      let year = new Date(element.created_at).getFullYear()
      let month = new Date(element.created_at).getMonth()
      let day = new Date(element.created_at).getDate()
      month = (String(month + 1).length < 2) ? ('0' + String(month + 1)) : String(month + 1)
      day = (String(day).length < 2) ? ('0' + String(day)) : String(day)
      element.date = year + '-' + month + '-' + day
    })
  }
  daysCountGetter(mo){
    let year = this.filterYear
    let month = mo
    var weeks = []
    let firstDate = new Date(year, month, 1)
    let lastDate = new Date(year, month + 1, 0)
    let numDays = lastDate.getDate()
    var start = 1
    var end = 7 - firstDate.getDay()
    while(start <= numDays){
      weeks.push({start: start, end: end})
      start = end + 1
      end = end + 7
      if(end > numDays){
        end = numDays
      }
    }
    return {start: weeks[0].start, end: weeks[weeks.length - 1].end}
  }
  filteredDaily(){
    let days = [] // storage for unique days
    let initdailyData = []
    let uniqueMonths = []
    let tyear = String(new Date().getFullYear())
    let tmonth = (String(new Date().getMonth() + 1).length < 2) ? '0' + String(new Date().getMonth() + 1) : String(new Date().getMonth() + 1)
    let tday = (String(new Date().getDate()).length < 2) ? '0' + String(new Date().getDate()) : String(new Date().getDate())
    let tdate = tyear + '-' + tmonth + '-' + tday
    this.receivedData.forEach(element => {
      // console.log('tracing ', element.status)
      if(new Date(element.date).getFullYear() === Number(this.filterYear)){
        if(!days.includes(element.date)){
          days.push(element.date)
          switch(element.status){
            case 'positive':
              element.positive_size = 1
              element.recovered_size = 0
              element.death_size = 0
              element.pum = 0
              element.pui = 0
              element.lsi = 0
              element.tested = 0
              element.symptoms = 0
              element.rofw = 0
              break
            case 'recovered':
              element.positive_size = 0
              element.recovered_size = 1
              element.death_size = 0
              element.pum = 0
              element.pui = 0
              element.lsi = 0
              element.tested = 0
              element.symptoms = 0
              element.rofw = 0
              break
            case 'death':
              element.positive_size = 0
              element.recovered_size = 0
              element.death_size = 1
              element.pum = 0
              element.pui = 0
              element.lsi = 0
              element.tested = 0
              element.symptoms = 0
              element.rofw = 0
              break
            case 'pum':
              element.positive_size = 0
              element.recovered_size = 0
              element.death_size = 0
              element.pum = 1
              element.pui = 0
              element.lsi = 0
              element.tested = 0
              element.symptoms = 0
              element.rofw = 0
              break
            case 'pui':
              element.positive_size = 0
              element.recovered_size = 0
              element.death_size = 0
              element.pum = 0
              element.pui = 1
              element.lsi = 0
              element.tested = 0
              element.symptoms = 0
              element.rofw = 0
              break
            case 'lsi':
              element.positive_size = 0
              element.recovered_size = 0
              element.death_size = 0
              element.pum = 0
              element.pui = 0
              element.lsi = 1
              element.tested = 0
              element.symptoms = 0
              element.rofw = 0
              break
            case 'tested':
              element.positive_size = 0
              element.recovered_size = 0
              element.death_size = 0
              element.pum = 0
              element.pui = 0
              element.lsi = 0
              element.tested = 1
              element.symptoms = 0
              element.rofw = 0
              break
            case 'symptoms':
              element.positive_size = 0
              element.recovered_size = 0
              element.death_size = 0
              element.pum = 0
              element.pui = 0
              element.lsi = 0
              element.tested = 0
              element.symptoms = 1
              element.rofw = 0
              break
            case 'rofw':
              element.positive_size = 0
              element.recovered_size = 0
              element.death_size = 0
              element.pum = 0
              element.pui = 0
              element.lsi = 0
              element.tested = 0
              element.symptoms = 0
              element.rofw = 1
              break
          }
          element.status = ''
          initdailyData.push(element)
        }else{
          initdailyData.forEach(daily => {
            if(element.date === daily.date){
              switch(element.status){
                case 'positive':
                  daily.positive_size += 1
                  break
                case 'recovered':
                  daily.recovered_size += 1
                  break
                case 'death':
                  daily.death_size += 1
                  break
                case 'pum':
                  daily.pum += 1
                  break
                case 'pui':
                  daily.pui += 1
                  break
                case 'lsi':
                  daily.lsi += 1
                  break
                case 'tested':
                  daily.tested += 1
                  break
                case 'symptoms':
                  daily.symptoms += 1
                  break
                case 'rofw':
                  daily.rofw += 1
                  break
              }
              element.status = ''
            }
          })
        }
      }
    })
    days.forEach(element => {
      if(!uniqueMonths.includes(new Date(element).getMonth())){
        uniqueMonths.push(new Date(element).getMonth())
      }
    })
    for(var h = Math.min(...uniqueMonths); h < Math.max(...uniqueMonths); h++){
      if(!uniqueMonths.includes(h)){
        uniqueMonths.push(h)
      }
    }
    for(var i = 0; i < uniqueMonths.length; i++){
      let temp = uniqueMonths[i + 1]
      if(i + 1 !== uniqueMonths.length){
        if(uniqueMonths[i] > uniqueMonths[i + 1]){
          uniqueMonths[i + 1] = uniqueMonths[i]
          uniqueMonths[i] = temp
          i = -1
        }
      }
    }
    let uniqueDate = days
    this.filteredDailyData = initdailyData
    uniqueMonths.forEach(element => {
      let year = this.filterYear
      let month = (String(element + 1).length < 2) ? '0' + String(element + 1) : String(element + 1)
      for(var i = this.daysCountGetter(element).start; i < this.daysCountGetter(element).end + 1; i++){
        let cl = i
        let d = (String(cl).length < 2) ? '0' + String(cl) : String(cl)
        let petsa = year + '-' + month + '-' + d
        if(!uniqueDate.includes(petsa)){
          let m = {
            positive_size: 0,
            recovered_size: 0,
            death_size: 0,
            pum: 0,
            pui: 0,
            lsi: 0,
            tested: 0,
            symptoms: 0,
            rofw: 0,
            date: petsa,
            status: ''
          }
          this.filteredDailyData.push(m)
          uniqueDate.push(petsa)
        }
        if(petsa === tdate){
          break
        }
      }
    })
    this.filteredDailyData.sort(function(a, b) { return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0) })
    this.months = uniqueMonths
  }
  filteredWeekly(){
    let Wmonths = []
    let tyear = String(new Date().getFullYear())
    let tmonth = (String(new Date().getMonth() + 1).length < 2) ? '0' + String(new Date().getMonth() + 1) : String(new Date().getMonth() + 1)
    let tday = (String(new Date().getDate()).length < 2) ? '0' + String(new Date().getDate()) : String(new Date().getDate())
    let tdate = tyear + '-' + tmonth + '-' + tday
    for(var i = 0; i < 12; i++){
      let year = this.filterYear
      let month = i
      let weeks = []
      let firstDate = new Date(year, month, 1)
      let lastDate = new Date(year, month + 1, 0)
      let numDays = lastDate.getDate()
      let start = 1
      let end = 7 - firstDate.getDay()
      while(start <= numDays){
        weeks.push({start: start, end: end, count: (end - start) + 1})
        start = end + 1
        end = end + 7
        if(end > numDays){
          end = numDays
        }
      }
      Wmonths.push({data: [], weeks: weeks})
    }
    for(var xx = 0; xx < Wmonths.length; xx++){
      for(var dd = 0; dd < Wmonths[xx].weeks.length; dd++){
        if(this.months.includes(xx)){
          let initWeeklyData = {
            positive_size: 0,
            recovered_size: 0,
            death_size: 0,
            pum: 0,
            pui: 0,
            lsi: 0,
            tested: 0,
            symptoms: 0,
            rofw: 0,
            date: '',
            status: ''
          }
          for(var adlaw = Wmonths[xx].weeks[dd].start; adlaw < Wmonths[xx].weeks[dd].end + 1; adlaw++){
            for(var dailyD = 0; dailyD < this.filteredDailyData.length; dailyD++){
              if(new Date(this.filteredDailyData[dailyD].date).getMonth() === xx){
                if(new Date(this.filteredDailyData[dailyD].date).getDate() === adlaw){
                  initWeeklyData.positive_size += this.filteredDailyData[dailyD].positive_size
                  initWeeklyData.recovered_size += this.filteredDailyData[dailyD].recovered_size
                  initWeeklyData.death_size += this.filteredDailyData[dailyD].death_size
                  initWeeklyData.pum += this.filteredDailyData[dailyD].pum
                  initWeeklyData.pui += this.filteredDailyData[dailyD].pui
                  initWeeklyData.lsi += this.filteredDailyData[dailyD].lsi
                  initWeeklyData.tested += this.filteredDailyData[dailyD].tested
                  initWeeklyData.rofw += this.filteredDailyData[dailyD].rofw
                  initWeeklyData.symptoms += this.filteredDailyData[dailyD].symptoms
                  initWeeklyData.date = this.filteredDailyData[dailyD].date
                  break
                }
              }
            }
          }
          Wmonths[xx].data.push(initWeeklyData)
        }
      }
    }
    let initWeekly = []
    for(var weekly = Math.min(...this.months); weekly < Math.max(...this.months) + 1; weekly++){
      let trapper = null
      for(var xy = 0; xy < Wmonths[weekly].data.length; xy++){
        if(Wmonths[weekly].data[xy].date <= tdate && Wmonths[weekly].data[xy].date !== ''){
          initWeekly.push(Wmonths[weekly].data[xy])
          trapper = xy
        }
      }
      if(Wmonths[weekly].data[trapper].date <= tdate){
        if(Wmonths[weekly].weeks[Wmonths[weekly].weeks.length - 1].count < 7 && weekly !== Math.max(...this.months)){
          let temp = Wmonths[weekly + 1].data[0]
          initWeekly[initWeekly.length - 1].positive_size += temp.positive_size
          initWeekly[initWeekly.length - 1].death_size += temp.death_size
          initWeekly[initWeekly.length - 1].recovered_size += temp.recovered_size
          initWeekly[initWeekly.length - 1].pum += temp.pum
          initWeekly[initWeekly.length - 1].pui += temp.pui
          initWeekly[initWeekly.length - 1].tested += temp.tested
          initWeekly[initWeekly.length - 1].symptoms += temp.symptoms
          initWeekly[initWeekly.length - 1].lsi += temp.lsi
          initWeekly[initWeekly.length - 1].rofw += temp.rofw
          Wmonths[weekly + 1].data.shift()
          Wmonths[weekly + 1].weeks.shift()
        }
      }
    }
    this.filteredWeeklyData = initWeekly
  }
  filteredMonthly(){
    let initMonthlyData = []
    if(this.filteredDailyData.length < 1){
      this.addDate()
      this.dateSorting()
      this.filteredDaily()
    }else{
      this.months.forEach((month, index) => {
        let temp = {
          positive_size: 0,
          recovered_size: 0,
          death_size: 0,
          pum: 0,
          pui: 0,
          lsi: 0,
          tested: 0,
          symptoms: 0,
          rofw: 0
        }
        for(var i = 0; i < this.getDailyData().length; i++){
          let xxx = this.getDailyData()[i]
          if(new Date(this.getDailyData()[i].date).getMonth() === month){
            temp.positive_size += xxx.positive_size
            temp.recovered_size += xxx.recovered_size
            temp.death_size += xxx.death_size
            temp.pum += xxx.pum
            temp.pui += xxx.pui
            temp.tested += xxx.tested
            temp.lsi += xxx.lsi
            temp.symptoms += xxx.symptoms
            temp.rofw += xxx.rofw
            temp.date = this.getDailyData()[i].date
            temp.location = this.getDailyData()[i].location
          }
        }
        initMonthlyData.push(temp)
      })
    }
    this.filteredMonthlyData = initMonthlyData
  }
  filteredYearly(){
    let initYearly = []
    if(this.filteredMonthlyData.length < 1){
      this.addDate()
      this.dateSorting()
      this.filteredDaily()
      this.filteredMonthly()
    }else{
      let temp = this.filteredMonthlyData[0]
      for(var i = 1; i < this.filteredMonthlyData.length; i++){
        temp.positive_size += this.filteredMonthlyData[i].positive_size
        temp.recovered_size += this.filteredMonthlyData[i].recovered_size
        temp.death_size += this.filteredMonthlyData[i].death_size
        temp.pum += this.filteredMonthlyData[i].pum
        temp.pui += this.filteredMonthlyData[i].pui
        temp.lsi += this.filteredMonthlyData[i].lsi
        temp.tested += this.filteredMonthlyData[i].tested
        temp.symptoms += this.filteredMonthlyData[i].symptoms
        temp.rofw += this.filteredMonthlyData[i].rofw
      }
      initYearly.push(temp)
    }
    this.filteredYearlyData = initYearly
  }
  getYearlyData(){
    return this.filteredYearlyData
  }
  getMonthlyData(){
    return this.filteredMonthlyData
  }
  getWeeklyData(){
    return this.filteredWeeklyData
  }
  getDailyData(){
    return this.filteredDailyData
  }
  getYears(){
    let data = this.received
    for(var i = 0; i < data.length; i++){
      if(!this.filteredYears.includes(new Date(data[i].created_at).getFullYear())){
        this.filteredYears.push(new Date(data[i].created_at).getFullYear())
      }
    }
    return this.filteredYears
  }
}
