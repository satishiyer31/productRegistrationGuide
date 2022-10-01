const prodreg = require('express').Router();


prodreg.get('/:userid',(req,res) => {

console.info(`📗 ${req.method} request to ${req.path}`)
res.json(`Get Method of Prod Reg for ${req.params.userid}`)
})
      


module.exports = prodreg;