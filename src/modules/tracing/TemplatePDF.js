import PdfPrinter from 'pdfmake'

export default {
  pdfLogo: null,
  type: null,
  personalInformation: [],
  symptoms: [],
  travelHistory: null,
  safetyQuestions: [],
  relatedQuestions: [],
  personInContact: [],
  name: '',
  formParameters: {
    format: null,
    status: null,
    statusLabel: null,
    location: null
  },
  statusColor: '',
  encode: function (url) { // converting image to base 64
    return new Promise((resolve) => {
      var img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        var ctx = canvas.getContext('2d')
        ctx.drawImage(this, 0, 0)
        var dataURL = canvas.toDataURL('image/png')
        resolve(dataURL)
      }
      img.src = url
    })
  },
  getData(data, merchant) { // get the parsed data, merchant info and formParameters from the component
    this.name = merchant.name
    this.formParameters.location = data.location
    this.formParameters.format = data.format
    this.formParameters.status = data.status
    this.formParameters.statusLabel = data.statusLabel
    this.statusColor = data.status === 'danger' ? '#dc3545' : '#5cb85c'
    this.encode(merchant.logo).then(res => {
      this.pdfLogo = res // this is the logo
    })
    Object.keys(data).forEach((key) => { // iterate the data object
      if (key === 'format') {
        let format = data[key]
        if (format === 'customer') { // check the form format
          this.type = 'Customer'
        } else if (format === 'employee_checkin') {
          this.type = 'Employee Checkin'
        } else if (format === 'employee_checkout') {
          this.type = 'Employee Checkout'
        }
      } else if (key === 'personalInformation') {
        // data[key] --> is the content of personalInformation
        let information = data[key] // I equate the object personalInformation to this variable
        Object.keys(information).forEach((keyInfo) => { // iterate personalInformation object
          if(keyInfo === 'duty_hours'){
            let dutyHours = keyInfo
            delete information[dutyHours]
          }
          if (information[keyInfo] !== undefined && information[keyInfo] !== null && information[keyInfo] !== '') { // checking if the values is not undefined or null
            // let tempKey = String(keyInfo)
            if(keyInfo === 'gender'){ // Chaning the text to display in PDF
              this.personalInformation['Sex'] = information[keyInfo]
            }else if(keyInfo === 'contact_number'){
              this.personalInformation['Tel./Mobile No.'] = information[keyInfo]
            }else if(keyInfo === 'address'){
              this.personalInformation['Address in the Philippines'] = information[keyInfo]
            }else if(keyInfo === 'birth_date'){
              this.personalInformation['Date of Birth'] = information[keyInfo]
            }else if(keyInfo === 'civil_status'){
              this.personalInformation['Civil Status'] = information[keyInfo]
            }else if(keyInfo === 'immediate_superior'){
              this.personalInformation['Immediate Superior'] = information[keyInfo]
            }else if(keyInfo === 'occupation'){
              this.personalInformation['Occupation'] = information[keyInfo]
            }else if(keyInfo === 'email'){
              this.personalInformation['Email'] = information[keyInfo]
            }else if(keyInfo === 'section'){
              this.personalInformation['Section'] = information[keyInfo]
            }else if(keyInfo === 'department'){
              this.personalInformation['Department'] = information[keyInfo]
            }else if(keyInfo === 'temperature'){
              this.personalInformation['Temperature'] = information[keyInfo]
            }else{
              this.personalInformation['Name'] = this.getName(information.last_name, information.first_name, information.middle_name)
            }
          }
        })
      }else if(key === 'symptoms'){
        let temp = data[key]
        for(let i = 0; i < temp.length; i++){ // Since the temp here is still a list of object
          let symptom = temp[i] // I created a temp holder of the object inside
          this.symptoms.push(symptom) // Then push to the global var list of symptoms
        }
      }else if(key === 'travelHistory'){
        let temp = data[key]
        temp.transportation.push('Mode of transportation') // pushing the questions to the list
        temp.localities.push('Cities / municipalities in the Philippines visited for the past fourteen (14) days')
        temp.countries.push('Countries visited for the past fourteen (14) days')
        this.travelHistory = temp // equate the object temp to the global var object travelHistory
      }else if(key === 'safety_questions'){
        let temp = data[key] // safety questions array of objects
        this.safetyQuestions = temp
      }else if(key === 'company'){
        let temp = data[key] // this is an object
        Object.keys(temp).forEach((keyData) => {
          if(keyData === 'person_in_contact'){
            let personInContactTemp = temp[keyData]
            this.personInContact = personInContactTemp // this is an array objects
          }else if(keyData === 'related_questions'){
            let relatedQuestionsTemp = temp[keyData]
            this.relatedQuestions = relatedQuestionsTemp // this is an array objects
          }
        })
      }
    })
    this.formTemplate()
  },
  getName(fname, lname, mname) { // generate the fullname
    let fullname = `${lname}, ${fname} ${mname}`
    return fullname
  },
  generateSymptomsTable(){ // generate symptoms table
    let symptomsTable = [
      {
        text: 'Symptoms',
        bold: true,
        margin: [0, 20, 0, 0],
        fontSize: 16
      },
      {
        text: `Symptoms felt during the completion of this form or within fourteen (14) days prior to completion`,
        margin: [0, 10, 0, 5],
        fontSize: 12,
        bold: true
      },
      {
        table: {
          heights: 30,
          widths: [500, 'auto'],
          body: []
        }
      }
    ]
    for(let i = 0; i < this.symptoms.length; i++){ // iterate the list of symptoms
      let temp = []
      let rowCol1 = {
        text: `${this.symptoms[i].question} [${this.symptoms[i].answer}]`,
        fontSize: 12,
        margin: [0, 10, 0, 0],
        border: [true, true, false, true],
        color: `${this.symptoms[i].answer === 'no' ? 'green' : 'red'}`,
        bold: true
      }
      let rowCol2 = {
        text: ` `,
        border: [false, true, true, true]
      }
      temp.push(rowCol1)
      temp.push(rowCol2)
      symptomsTable[2].table.body.push(temp) // push the data to the body
    }
    this.symptoms = []
    return symptomsTable
  },
  generatePersonalInformationTable() { // generate personal information table
    let PersonalInformationTable = {
      table: {
        headerRows: 1,
        heights: 35,
        widths: ['*', '*'],
        body: []
      }
    }
    let tempHeader = [
      {
        text: 'Personal Information',
        bold: true,
        margin: [0, 10, 0, 0],
        fontSize: 14,
        border: [false, false, false, false]
      },
      {
        text: ' ',
        border: [false, false, false, false]
      }
    ]
    PersonalInformationTable.table.body.push(tempHeader)
    // for(let i = 0; i < this.personalInformation.length; i++){
    //   let temp = []
    //   console.log(this.personalInformation[i])
    // }
    let index = 1
    Object.keys(this.personalInformation).forEach((info) => { // iterate the object of personal information
      let temp = []
      let fillColor = ''
      fillColor = index % 2 === 0 ? '#FFFFFF' : '#EEEEEE'
      let rowCol1 = {
        text: `${info}`,
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 0],
        border: [false, false, false, false],
        fillColor: `${fillColor}`
      }
      let rowCol2 = {
        text: `${this.personalInformation[info]}`,
        fontSize: 12,
        margin: [0, 10, 0, 0],
        border: [false, false, false, false],
        fillColor: `${fillColor}`
      }
      temp.push(rowCol1)
      temp.push(rowCol2)
      PersonalInformationTable.table.body.push(temp) // push the data to the body
      index += 1
    })
    this.personalInformation = []
    return PersonalInformationTable.table
  },
  generateTravelHistory(){ // generate travel history table
    let travelHistoryTable = [
      {
        text: 'Travel History',
        bold: true,
        margin: [0, 20, 0, 0],
        fontSize: 14
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 5,
            x2: 535,
            y2: 5,
            lineWidth: 0.5,
            lineColor: '#EEEEEE'
          }
        ]
      },
      {
        table: {
          heights: 30,
          widths: [500, 'auto'],
          body: []
        },
        layout: 'lightHorizontalLines'
      }
    ]
    Object.keys(this.travelHistory).forEach((key) => { // Iterate the object of Arrays of Travel History
      let tempAnswers = []
      let temp = []
      let textAnswers = 'None'
      temp = this.travelHistory[key]
      if(this.travelHistory[key].length === 1){ // Check if the list contains only the question
        textAnswers = 'None'
        let tempRow = []
        let rowCol1 = {
          text: `${temp[0]}: ${textAnswers}`,
          fontSize: 12,
          margin: [10, 10]
        }
        tempRow.push(rowCol1)
        travelHistoryTable[2].table.body.push(tempRow) // push the data to the body
      }else{ // If the list contains the questions and answers
        this.travelHistory[key].forEach(detail => {
          tempAnswers.push(detail)
          textAnswers = tempAnswers.join(',')
        })
        let tempRow = []
        let rowCol1 = {
          text: `${temp[1]}: ${temp[0]}`,
          fontSize: 12,
          margin: [10, 10]
        }
        tempRow.push(rowCol1)
        travelHistoryTable[2].table.body.push(tempRow) // push the data to the body
      }
    })
    this.travelHistory = []
    if(this.type === 'Customer' || this.type === 'Employee Checkin'){ // check the format
      return travelHistoryTable
    }else{
      return ''
    }
  },
  generateHealtQuestionsTable(){
    // this.personInContact --->> this is an array of objects
    // this.safetyQuestions ---->> safety questions array of objects
    // this.relatedQuestions --->> this is an array objects
    let HRQtable = [
      {
        text: 'Health and Safety-Related Questions',
        fontSize: 14,
        margin: [0, 20, 0, 5],
        bold: true
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 5,
            x2: 535,
            y2: 5,
            lineWidth: 0.5,
            lineColor: '#EEEEEE'
          }
        ]
      },
      {
        table: {
          heights: 30,
          body: []
        },
        layout: 'lightHorizontalLines'
      }
    ]
    if(this.type === 'Customer'){ // Customer
      // customer in needs Saftey Questions
      let tempHeader = [
        {
          text: ''
        },
        {
          text: 'Yes',
          margin: [10, 10],
          bold: true
        },
        {
          text: 'No',
          margin: [10, 10],
          bold: true
        }
      ]
      HRQtable[2].table.body.push(tempHeader)
      for(let i = 0; i < this.safetyQuestions.length; i++){ // check the questions of customer
        let yes = ''
        let no = ''
        if(this.safetyQuestions[i].answer === 'no'){
          yes = ''
          no = 'X'
        }else if(this.safetyQuestions[i].answer === 'yes'){
          no = ''
          yes = '✔'
        }
        let temp = []
        let rowCol1 = {
          text: `${this.safetyQuestions[i].question}`,
          fontSize: 12
        }
        let rowCol2 = {
          text: `${yes}`,
          color: 'red',
          alignment: 'center',
          margin: [0, 5, 0, 10]
        }
        let rowCol3 = {
          text: `${no}`,
          color: 'green',
          alignment: 'center',
          margin: [0, 5, 0, 0]
        }
        temp.push(rowCol1)
        temp.push(rowCol2)
        temp.push(rowCol3)
        HRQtable[2].table.body.push(temp)
      }
    }else if(this.type === 'Employee Checkin'){ // Employee Checkin
      // check in needs Saftey Questions, Related Questions and Person in contact
      let tempHeader = [
        {
          text: ''
        },
        {
          text: 'Yes',
          margin: [10, 10]
        },
        {
          text: 'No',
          margin: [10, 10]
        }
      ]
      HRQtable[2].table.body.push(tempHeader)
      for(let i = 0; i < this.safetyQuestions.length; i++){ // loop for safety questions of Emp Checkin
        let fillColor = ''
        fillColor = i % 2 !== 0 ? '#FFFFFF' : '#EEEEEE'
        let yes = ''
        let no = ''
        let temp = []
        if(this.safetyQuestions[i].answer === 'no'){
          yes = ''
          no = 'X'
        }else if(this.safetyQuestions[i].answer === 'yes'){
          no = ''
          yes = '✔'
        }
        let rowCol1 = {
          text: `${this.safetyQuestions[i].question}`,
          margin: [0, 10, 0, 0],
          fontSize: 12,
          fillColor: `${fillColor}`
        }
        let rowCol2 = {
          text: `${yes}`,
          color: 'red',
          alignment: 'center',
          margin: [0, 5, 0, 10],
          fillColor: `${fillColor}`
        }
        let rowCol3 = {
          text: `${no}`,
          color: 'green',
          alignment: 'center',
          margin: [0, 5, 0, 10],
          fillColor: `${fillColor}`
        }
        temp.push(rowCol1)
        temp.push(rowCol2)
        temp.push(rowCol3)
        HRQtable[2].table.body.push(temp)
      }
      for(let i = 0; i < this.relatedQuestions.length; i++){ // loop for related questions of Emp Checkin
        let answer = String
        answer = this.relatedQuestions[i].answer.toString()
        let temp = []
        let row1 = {
          text: `${this.relatedQuestions[i].question} ${answer}`,
          margin: [0, 10, 0, 0],
          fontSize: 12
        }
        let row2 = {
          text: ` `
        }
        let row3 = {
          text: ` `
        }
        temp.push(row1)
        temp.push(row2)
        temp.push(row3)
        HRQtable[2].table.body.push(temp)
      }
      let textHead = [
        {
          text: 'People in contact last 12 hours and its relation:',
          fontSize: 12,
          margin: [0, 20, 0, 0]
        },
        {
          text: ` `
        },
        {
          text: ` `
        }
      ]
      HRQtable[2].table.body.push(textHead)
      let tempHeaderP = [
        {
          text: 'Names',
          fontSize: 12,
          margin: [10, 10],
          bold: true
        },
        {
          text: 'Relation',
          margin: [10, 10],
          fontSize: 12,
          bold: true
        },
        {
          text: ` `
        }
      ]
      HRQtable[2].table.body.push(tempHeaderP)
      for(let i = 0; i < this.personInContact.length; i++){ // loop for person in contact of Emp Checkin
        let fillColor = ''
        fillColor = i % 2 !== 0 ? '#FFFFFF' : '#EEEEEE'
        let temp = []
        let row1 = {
          text: `${this.personInContact[i].name}`,
          margin: [10, 10],
          fontSize: 12,
          fillColor: `${fillColor}`
        }
        let row2 = {
          text: `${this.personInContact[i].relation}`,
          margin: [10, 10],
          fontSize: 12,
          fillColor: `${fillColor}`
        }
        let row3 = {
          text: ` `,
          fillColor: `${fillColor}`
        }
        temp.push(row1)
        temp.push(row2)
        temp.push(row3)
        HRQtable[2].table.body.push(temp)
      }
    }else if(this.type === 'Employee Checkout'){
      // check out needs Related Questions and Person in contact
      for(let i = 0; i < this.relatedQuestions.length; i++){
        console.log(this.relatedQuestions[i])
        let answer = String
        answer = this.relatedQuestions[i].answer.toString()
        let temp = []
        let row1 = {
          text: `${this.relatedQuestions[i].question} ${answer}`,
          margin: [0, 10, 0, 0],
          fontSize: 12
        }
        let row2 = {
          text: ` `
        }
        let row3 = {
          text: ` `
        }
        temp.push(row1)
        temp.push(row2)
        temp.push(row3)
        HRQtable[2].table.body.push(temp)
      }
      let textHead = [
        {
          text: 'Co-workers transacted:',
          fontSize: 12,
          margin: [0, 20, 0, 0]
        },
        {
          text: ` `
        },
        {
          text: ` `
        }
      ]
      HRQtable[2].table.body.push(textHead)
      let tempHeaderP = [
        {
          text: 'Names',
          margin: [10, 10],
          bold: true
        },
        {
          text: 'Department',
          margin: [10, 10],
          bold: true
        },
        {
          text: ` `
        }
      ]
      HRQtable[2].table.body.push(tempHeaderP)
      for(let i = 0; i < this.personInContact.length; i++){ // loop for person in contact of Emp Checkout
        let fillColor = ''
        fillColor = i % 2 !== 0 ? '#FFFFFF' : '#EEEEEE'
        let temp = []
        let row1 = {
          text: `${this.personInContact[i].name}`,
          margin: [10, 10],
          fontSize: 12,
          fillColor: `${fillColor}`
        }
        let row2 = {
          text: `${this.personInContact[i].department}`,
          margin: [10, 10],
          fontSize: 12,
          fillColor: `${fillColor}`
        }
        let row3 = {
          text: ` `,
          fillColor: `${fillColor}`
        }
        temp.push(row1)
        temp.push(row2)
        temp.push(row3)
        HRQtable[2].table.body.push(temp)
      }
    }
    this.relatedQuestions = []
    this.personInContact = []
    this.safetyQuestions = []
    return HRQtable
  },
  generatePrivacyNotice(){
    let privacyText = []
    let tempText1 = {
      text: `Data Privacy Notice:`,
      bold: true,
      fontSize: 10,
      italics: true
    }
    let tempText2 = {
      text: `${this.name}, in line with Republic Act 10173 or the Data Privacy Act os 2012, is committed to protect and secure personal information obtained in the performances of its duties. The establishment collects the following personal information relevant in the advancement of protocols and precautionary measures against COVID-19 Acute Respiratory Disease. The collected personal information will be kept/stores and accessed only by authorized personnel and will not be shared with any outside parties unless the disclosure is required by, or in complain with applicable laws and regulations.`,
      italics: true,
      fontSize: 10,
      margin: [0, 0, 0, 15]
    }
    let tempText3 = {
      text: `Declaration and Data Privacy Consent Form:`,
      bold: true,
      fontSize: 10,
      italics: true
    }
    let tempText4 = {
      text: `I knowingly and voluntarily agree to the terms of this binding Declaration, and in doing so represent the truthfulness and veracity of the above answers. I understand that the failure to answer any questions or giving false answer can be penalized in the accordance with the law. Relative thereto, I voluntarily and freely consent to the processing and collection of personal data only in relation to COVID-19 internal protocols.`,
      italics: true,
      fontSize: 10
    }
    privacyText.push(tempText1)
    privacyText.push(tempText2)
    privacyText.push(tempText3)
    privacyText.push(tempText4)
    return privacyText
  },
  formTemplate() { // this is the main template of PDF
    var document = {
      content: [
        {
          image: `${this.pdfLogo}`,
          width: 80,
          height: 80,
          alignment: 'center'
        },
        {
          text: `${this.name}`,
          fontSize: 20,
          color: '#007bff',
          alignment: 'center',
          bold: true
        },
        {
          text: `${this.formParameters.location.route}, ${this.formParameters.location.locality}, ${this.formParameters.location.region}`,
          fontSize: 12,
          color: '#868e96',
          alignment: 'center'
        },
        {
          text: `${this.type} Health Declaration Form`,
          fontSize: 20,
          color: '#007bff',
          alignment: 'center',
          bold: true,
          margin: [0, 20, 0, 0]
        },
        {
          text: `Status: ${this.formParameters.status} [${this.formParameters.statusLabel}]`,
          color: `${this.statusColor}`,
          alignment: 'center',
          bold: true,
          margin: [0, 0, 20, 0],
          fontSize: 16
        },
        {
          text: 'Completed on: ',
          alignment: 'center',
          bold: true,
          fontSize: 16
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 5,
              x2: 535,
              y2: 5,
              lineWidth: 0.5,
              lineColor: '#EEEEEE'
            }
          ]
        },
        {
          table: this.generatePersonalInformationTable()
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 5,
              x2: 535,
              y2: 5,
              lineWidth: 0.5,
              lineColor: '#EEEEEE'
            }
          ]
        },
        this.generateTravelHistory(),
        this.generateSymptomsTable(),
        this.generateHealtQuestionsTable(),
        ' ',
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 5,
              x2: 535,
              y2: 5,
              lineWidth: 0.5,
              lineColor: '#EEEEEE'
            }
          ]
        },
        ' ',
        ' ',
        this.generatePrivacyNotice()
      ]
    }
    PdfPrinter.createPdf(document).download(`${this.type}.pdf`)
  }
}
