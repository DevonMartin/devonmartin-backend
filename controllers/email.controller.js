import fetch from "node-fetch";
import nodemailer from "nodemailer";

async function validateHuman(token) {
  const secret = process.env.EMAIL_SECRET;
  const response = await fetch(
    `https://google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    {
      method: "POST",
    }
  );
  const data = await response.json();
  return data.success;
}

export const apiSendEmail = async (req, res) => {
  let data = req.body;

  let human = await validateHuman(data.token);

  if (!human) {
    res.status(201).send("Error: reCAPTCHA determined you are a bot.");
    return;
  }

  let smtpTransport = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: "devonmartinbot@gmail.com",
      pass: "ekfbxqbsxgbyngtl",
    },
  });
  let mailOptions = {
    from: data.email,
    to: "devon@devonmartin.net",
    subject: `Message from ${data.name}`,
    html: `
  <h3>Gathered Data:</h3>
  <ul>
    <li>Name: ${data.name}</li>
    <li>Email: ${data.email}</li>
    <li>Phone: ${data.phone}</li>
    <li>Company: ${data.company}</li>
  </ul>
  <h4>Message:</h4>
  <p>${data.message}</p>
  `,
  };
  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.status(201).send(error);
    } else {
      res.status(200).send("Your message has been recieved!");
    }
  });

  smtpTransport.close();
};
