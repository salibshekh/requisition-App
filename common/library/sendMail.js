
const nodeMailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const appRoot = require("app-root-path");

let transport = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false },
    debug: true
});

const readHtmlFIle = async (path) => {
    try {
        const data = await fs.readFileSync(path, { encoding: 'utf-8' })
        return data;
    }
    catch (error) {
        return error
    }
}

const sendEmail = async (emailData) => {
    //Path of file
    let temp = `${appRoot}/views/${emailData.templateVariable}`
    const html = await readHtmlFIle(temp);

    //Compile the html content with template engine(handlebar)
    const templates = await handlebars.compile(html)

    //Sending the data to hbs file
    const replacements = emailData.data
    const htmltosend = await templates(replacements)

    //Send the mail with transporter
    const sendData = {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        html: htmltosend
    }

    if(emailData.attachment) {
        sendData.attachments = emailData.attachment
    }

    return await transport.sendMail(sendData)
        .then(info => {

            console.log(info)
            if(emailData.attachment){
                fs.unlink(`${appRoot}/public/supportImages/${emailData.attachment[0].filename}`,(err) => {
                    if(err){
                        console.log(err)
                    }
                })
            }
        }
        )
        .catch(error => console.log(error))
}

module.exports = { sendEmail }