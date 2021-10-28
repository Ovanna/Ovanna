// const jwt = require('jsonwebtoken')
// const secretKey = process.env.SECRET_KEY

// const auth = async (req, res, next) => {
//   try {
//     const header = req.header('Authorization')

//     if (!header) {
//       return res.status(401).send({
//         status: 'failed',
//         message: 'Unauthorized'
//       })
//     }

//     const token = header.substring('Bearer '.length)
//     const verify = jwt.verify(token, secretKey, (err, decode) => {
//       if (err) {
//         return res.status(401).send({
//           status: 'failed',
//           message: err.message
//         })
//       }
//       return decode.id
//     })

//     req.idUser = verify

//     next()
//   } catch (error) {
//     console.log(error.message)
//     res.status(500).send({
//       status: 'failed',
//       message: 'server error'
//     })
//   }
// }

// module.exports = auth








const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) => {

    try {
        
        let header = req.header('Authorization')

        if(!header){
            return res.send({
                status: 'failed',
                message: 'Forbidden Access!'
            })
        }        

        const token = header.replace('Bearer ', '')

        const secretKey = process.env.SECRET_KEY

        const verified = jwt.verify(token, secretKey) 
    
        req.idUser = verified 

        next()

    } catch (error) {

        console.log(err)
        res.status({  
            status: 'failed',
            message: 'Server Error'
        })

    }    
}





