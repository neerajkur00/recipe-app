const nodemailer = require('nodemailer')

const sendMail =async (res,user)=>{
    try{
        const url = `http://localhost:3000/users/forget-password/${user._id}`
        const transport = nodemailer.createTransport({
            service:'gmail',
            host:'smtp.gamil.com',
            port:465,
            auth:{
                user:'devanshibilthare@gmail.com',
                pass:'aknqibzvlmsdypmf'
            }
        })

        const mailOptions = {
            from:"Recipe Hub pvt ltd <recipehub@gmail.com>",
            to:user.email,
            subject:'Reset Password Link',
            text:'Do not share this link with anyone',
            html:`<a href="${url}">Reset Password</a>`
        }

        transport.sendMail(mailOptions,async(err,info)=>{
            try{
                user.resetPasswordToken = 1
                await user.save()
                res.send(`<h1>CVheck Your Inbox / Spam folder</h1>`)
            }catch(err){
                res.send(err)
            }
        })
    }catch(err){
        res.send(err)
    }
}


module.exports = sendMail