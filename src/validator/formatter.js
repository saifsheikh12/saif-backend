function removespace(){

    console.log('       FunctionUp        '.trim())
    
}


function lowercase(){

    console.log('CONVERTS A STRING TO LOWERCASE'.toLowerCase())

}


function uppercase(){

    console.log('converts a string to uppercase'.toUpperCase())

}

module.exports.trim = removespace
module.exports.lower=lowercase
module.exports.upper=uppercase