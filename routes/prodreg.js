const prodreg = require('express').Router();
const {LOGIN, PASSWORD, BASE_URL} = process.env;
const fetch = require('node-fetch');


prodreg.get('/:userid',async (req,res) => {
    var prodRegIds="";
   
    const URL = BASE_URL + `/zen:user:${req.params.userid}/relationships/userid`

    const customObj = await fetch(URL, {

        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(LOGIN + ':' + PASSWORD).toString('base64')
        }
    });

    var prodRegObj = await customObj.json();
    
    prodRegObj = prodRegObj.data

    // ProdRegObj has the IDs of the Product Registration Custom Object.

    //Iterate the array and extract the Individual IDs in a comma separated string
    prodRegObj.forEach(getProdRegIds)

    function getProdRegIds(record) {
        prodRegIds += record.target +','
    }

    // console.log(prodRegIds)

    const URL2 = BASE_URL+ `?ids=${prodRegIds}`
    // console.log(URL2)

    //Make second API call with the Individual Ids as the query parameter
    const regData = await fetch(URL2, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(LOGIN + ':' + PASSWORD).toString('base64')
        }
    })
    var prodRegData = await regData.json()
    //ProdReg Data has the attribute information and can be returned to the client.
    res.json(prodRegData);

})

prodreg.post('/newreg/:userid', async(req,res)=> {

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
            
            // console.info('Prod registration ID: '+ newProd.data.id);
            // console.info('User ID '+ req.params.userid);
            
            // Get the Newly add Custom Object's ID and the user ID that is passed in the request to make second API call
            //The Second API call associates the new CO to the user.
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

})
      


module.exports = prodreg;