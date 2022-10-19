const prodreg = require('express').Router();
const {LOGIN, PASSWORD, BASE_URL} = process.env;
const fetch = require('node-fetch');
const URL = BASE_URL + '?type=productregistration'

prodreg.get('/:userid',async (req,res) => {

    console.info(`📗 ${req.method} request to ${req.path}`)
    console.info(URL)
    
    // res.json(`Get Method of Prod Reg for ${req.params.userid}`)

    const customObj = await fetch(URL, {

        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(LOGIN + ':' + PASSWORD).toString('base64')
        }
    });

    const meetingObj = await customObj.json();
    res.json(meetingObj);

})

prodreg.post('/newreg/:userid', async(req,res)=> {

    // if (req.body && req.params.userid) {
        // console.info(`${req.method} request received`)
        
        // console.info(req.body)

        fetch(BASE_URL, {
     
        // Adding method type
        method: "POST",
        
        body: JSON.stringify(req.body),
        
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': 'Basic ' + Buffer.from(LOGIN + ':' + PASSWORD).toString('base64')
        
        }
        })
 
        // Converting to JSON
        .then(response => response.json())
        
        // Displaying results to console
        .then(newProd => {console.info(newProd)
            
            console.info('Prod registration ID: '+ newProd.data.id);
            console.info('User ID '+ req.params.userid);
            
            fetch('https://z3nsatishiyer.zendesk.com/api/sunshine/relationships/records', {

                method: "POST",
                body: JSON.stringify({"data": {"relationship_type": "userid", "source": "zen:user:"+req.params.userid, "target": newProd.data.id}}),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': 'Basic ' + Buffer.from(LOGIN + ':' + PASSWORD).toString('base64')
                
                }
            })
            .then( response2 => response2.json())
            .then (relationResponse => {console.info (relationResponse)})


        }
        );

    // }


})
      


module.exports = prodreg;