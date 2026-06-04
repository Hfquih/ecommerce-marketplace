const nodemailer = require('nodemailer');
const {BadRequest} = require('../errors')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

const support = async(req,res)=>{

    const { username, email, message } = req.body

    if(!username || !email || !message){
        throw new BadRequest('Please provide all fields')
    }

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        replyTo: email,
        to: process.env.EMAIL_USER,
        subject: `Contact Form - ${username}`,
        html: `
            <h2>New Contact Message</h2>

            <p><strong>Name:</strong> ${username}</p>

            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Message:</strong></p>

            <p>${message}</p>
        `
    })

    res.status(200).json({
        msg:'Message sent successfully'
    })
}

module.exports = support