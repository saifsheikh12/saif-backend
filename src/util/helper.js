function printDate (){
    const today = new Date()

    console.log('current date :',today.getDate())

}

function printMonth (){
    const today = new Date()

    console.log('current month :',(today.getMonth()+1))

}

function getBatchInfo(){

    console.log('plutonium, week-3, day-5, the topic for today Nodejs module system.')
}

module.exports.printDate= printDate
module.exports.printMonth=printMonth
module.exports.getBatchInfo=getBatchInfo