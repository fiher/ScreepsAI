
module.exports = global.function(splittedText){
    let error = new Error()
    let caller  = error.stack.toString().split('\n')[2]
    //remove first element which is splittedText
    //if parameter
    let args = Array.prototype.slice.call(arguments,1)
    args.map( argument => {
        if(typeof argument === 'object'){
            return argument.toString()
        }else if(typeof argument === 'array'){
            return JSON.stringify(argument)
        }
    })
    let joinedText = ''
    for(i = 0; i < splittedText.length;i++){
        
        joinedText += splittedText[i]
        joinedText += args[i] ? args[i]:''
    }
    console.log(`${joinedText} \n   Called from ${caller}`)
    
}