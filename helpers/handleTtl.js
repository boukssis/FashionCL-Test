const handleTtl = ()=>{
    const date = new Date()
    date.setMinutes(date.getMinutes() + process.env.TTL )

    return date.getTime() 
}

module.exports = handleTtl

 