const User = require("../model/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const rateLimit = require('express-rate-limit');

encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return { hashedPassword, salt };
  } catch (error) {
    console.log("error in hashing password", error);
  }
};

exports.signUp = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, repassword } = req.body;
    if(password !== repassword)
      return res.status(500).json({ error : 'Password and re-password do not match'});

    const { hashedPassword, salt } = await encryptPassword(password);
    const user = await new User({
      name: name,
      email: email,
      hashedPassword: hashedPassword,
      salt: salt,
    });
    const savedUser = await user.save();
    const userResponse = {
      _id : savedUser._id,
      name : savedUser.name,
      email : savedUser.email,
      profile : `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wgARCAFoAXQDASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAIDBAEF/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhADEAAAAfZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARgWs8TUyDWySNKiwmAAAAAAAAAAAAAAAAApoL6YEAAAAA7bSNk8Fq6kZAAAAAAAAAAAAAgdzQ4gAAAAAAAAHdGYb2bSoAAAAAAAAAAicyOIAAAAAAAAAAAtqG9n0KAAAAAAAAAx25wEAAAAAAAAAAAAasvTc51QAAAAAAHO5ynggAAAAkRtsqWxnF9S1KF1IAAAABfow7V6AAAAAABh1ZAEAAAA7ohWc4AAFvadC53eIAAAA0Z5mwKAAAAABnosrQAAAADRn0Z1BAAFlcztdtQAAAABu7XYoAAAAAGHggAAAAGjPdAgAABZXoK6wAAAAA03UXqAAAAABgCAAAAANObo5prKneBK0i7SAAAAAAX6KL1AAAAAAw8srQAAAAABZWL+5xdVwAAAAAAAabq7FAAAAAAz0a8iAAAAAE7jPK6C8cCM5FDTBKXeAAAAAma+igAAAAAMO7OUBAAB0XyoWynhAAAE4DTVXetC6lAAAGijavQAAAAAAOdGHmjOgADTGCxiIAAAAABfCvSuZ3iADpdo51QAAAAAAAGPZExO8RKN5LNOAAAAAAAAlEaM+nOcA1Q0KAAAAAAAAABDJugY9NF6ZgAAAAAAAAW85Mpt7pUAAAAAAAAAAADlVwwNNCRAAAAAAALSGtJQAAAAAAAAAAAAAAKadgwNsDKvilSwVrJFLRYZLdJYTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//EACQQAAEDAwQDAQEBAAAAAAAAAAEAAhESMEADITEyEBMgIlBw/9oACAEBAAEFAv8AfZAXsC9i9hVblW5Vlewr2KofxDqIuJtzCGog4HPL0TOAHkIGcsmE504jXzkudCJnGa/Hc6FzkMdGKTAJnKY7EcZOWx04Woc0GCN8AmBdDCqAqAqEQRd0zgahuAStmovPmSEHpzbo3F47m31H010J4uaZvP629MJxk/bd222drupc4ZYZy/tkP7Wz0sN7P5ts63Dzb5ZYZy/tb0+MjTKcIP238tuaWV3HH01qebullAwtnIsKjxSUGwnOvaV083g8qtVhVomb+nxcf2/gs63NS/SVQVQVQVScx/W2GkqkBVBVqsqsqsqtflyLLjO147GyGwi9TNgOIWzk5sWtMX9QWAJWzQXTca5ObZGwvESPsfkEzea5ObH3pjB1B9MCcZwAagRB+AJI2wnCD5AkuMDAaYLxt8MbGGRIIjzphOMnBbu3yxuK5srjwNmYTOX8pjZx3NlEQn9cJvbUTWZMStTjCHMZhYiIwAyUBGedNFpFuJQ00Ggfw4BXrC9a9ZVBVDlQV6yvWqR/v/8A/8QAFBEBAAAAAAAAAAAAAAAAAAAAkP/aAAgBAwEBPwEKP//EABQRAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQIBAT8BCj//xAAfEAACAQQDAQEAAAAAAAAAAAARIVABMEBgACAxcID/2gAIAQEABj8C+/8AnbyFV1wC0JyDkHIDQhpowBhPikDcGUbI3is2MasCeC7WAfFerdr8iUK+LFN84z4aR4sHBPY6Ccw45jnHPSlIq64b3t7+AP/EACgQAQABAwQCAQQCAwAAAAAAAAEAESExMEBBYVFxIBBQgaFwkbHB4f/aAAgBAQABPyH+fXIaRHFWL4j0zunZO8h4CB5gfn7HWmYB5TlqetMWDSJwrMC78zyYmTsM5cgmzuwFWL1NmKNSBZY7kD3EVXbUrYbcD3FVV3GFhtSrMRVd1zPxtPTcbyho5NlwvzvbgRUVNhUGLVq6mYjNpSys7f3HxZlDVu1bDFqHdCW+4jFvqYjK1o5f66g0axUHXVR0wq0IpbzFVq/LEcSjZqWnw1nRd6mSKg6DvIlGmmqDWdw1D9Oi/wC8FNQNQdVVep/r0cUx+tR1Orf7tQ/TonPxFVdamf3uckeg0BcYtWv2UGjUlu2Iqj8q12JVsx9nEVSCdHMBi8UZH6CcQboq23Yt92uDuB5J1MXwRMnXz+9UUf2I0OqbjrAuCD8TuJ3E9EQ4dcKAapqutTrCGdf3E8X9RfBPTPTOogeSehnlf3ERo6YqNcVDRBWhDuyn/ZFZOh2hBOn6i3FzStPlr4NAioQIm9dSrbKU/wDBoBVpBQNeoESjR+QVaEBfjurrVrpWVMfO7VseF+flbqldbBsLS/mWD42AgoobL03HwpBLSc7G4St0fGhq5dmdJiKj9ckVnrZOw+olFPrzPxtQPcRVH6fpbN3HmCnv9MrDbge4qoyzZrRODK18NyjKD99njpKHPG8N8GLkbB8rEE23yVzAfCcNX1piwKxOVJgT7G5BWK4qRfEemdc6J1kPIQPKgfH8/wD/2gAMAwEAAgADAAAAEPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPONMOONPPPPPPPPPPPPPPPPKMwwwww89PPPPPPPPPPPPPOKQwwwwwwww0+PPPPPPPPPPOCwwwwwwwwwww01PPPPPPPPPAAwwwwwwwwwwww19PPPPPPPKAwwwww4Ggywwwww0PPPPPPPEAwwwwzwwwwAwwww1/PPPPPPAwwwww4gww0wwwww0/PPPPPPKwwwww4www1ywwwww9PPPPPLKwwwww5wxz4wwwwww9PPPPPPIwwwwwww40wwwwwww/PPPPPPAwwwwwy0mJLwwwww1/PPPPPPGAwwx0Ewww87Awww0PPPPPPPLAww+Awwwwww/Cwx1PPPPPPPPCCwwwwwwwww0ww1PPPPPPPPPPCE4wwwwwwww92HPPPPPPPPPPPDCwwwwwwwx3PPPPPPPPPPPPPPLPCBwyydPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP/EABQRAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQMBAT8QCj//xAAUEQEAAAAAAAAAAAAAAAAAAACQ/9oACAECAQE/EAo//8QAKhABAAEDAwMDBAMBAQAAAAAAAREAITEwQVFAYXEggaEQkbHBUNHwcOH/2gAIAQEAAT8Q/wC+4z8mvxAK2B7tKYh7V2P2r/UKB3PJQsp8VuA8M1jSPe1CJIz/AASAqA71NAnztUpg4s02pbwotgHJZrmLhz182eVsU/LPbXxirR+9U0m6ufsFLIeHno50I1jDk2epuK6wVPmX8dM8XnY8UIkmOm5msFOFleolzdvahnHSOPaOaRtd+OqhR7buO3RqArYKebZYdZeT9x0UJN3/AKdaxZj5oRxPQEzsUjZFnUBUBLxV0Z82jKHxUuFQ/wBaVwtyXNWJYm50EqO13U2CbvFe7fdrIo8FKuVfP0zCdqGxDuYoUf8ATtqMQyMlCDhJ1lAVwU6O7psWRoGXLHdpEkr6nU9/xU6Czk1JGdxrQ7ezUyHgrhwsaApdSz4pGWRjT7ObOt42TqZZn9tGCOwqYeSdMYZMld7CdXxGDUxRx0zx4DJqqRytTH3s+2jI9grxBGorHGqbr3dSBTe5U+GVzQBc7dpEWVnUVh3NRw6qEkJUcX8GnAQ+qcDZg5qXJZnu6v6dVIU4dWdn/tQss23KlMfzWCHkqHYaxbDltR8opzgqE493WwXjVEDhawxirGoe9bp9muKhWM7rS151xc51XmMP8F5DLq+dka2QHwVwjyxRuB9ITxLw1k/MawSwZrtYRq93XalxjuNETi3wqy/YVsk8s0tw9q732UBlK3ydyh5DvZrM+1SFKPGn2cXdZBEcNOjs6MaZaDsI5wUJIZeVMSzoWxew1KRLyyVI/wBDpQM7DXjR3s6ETL/ikKvl3aYvbYGmKMjDyV8fPNXAW34aDEMrBQg4DXJncpGyDHqQAldqWK8vNbBNjjWzm+zzVo7/AI9cyxFjoZSLt/b1QbpxVnXF31xjGaJsuKMz2359LFmfihHEdCgiNxp4t2Xog3fNbVNh46GH2YahBn8PTaT9R0aD2HikZXPn62PYK7CsOiDjLqRjIx9ZUO2znv0vExhpwMJ9MjiXRxcBUy8J+kuLtOaCMdNcVhhqC8L80pQ3Q6Ne5ihbzFPE42HNABBjqCIMwyUsIFLnoysJWRpYJlUnWTb4WzTcMd+dfOKvX71RQx3564BAE71NKnxtUpg5u02obwptwHBdrnLlz/B4z8ivxAa2B7lIYl71Dt+9f6pRwnvSsh80DI8EVjSvLegAgx/37//Z`
    };
    return res.status(201).json({
      message: "Sign up successfull",
      user: userResponse,
      token: user.generateToken()
    });
  } catch (error) {
    console.log("error in signing up: ", error);
    return res.status(500).json({ error: "error in signing up" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user){
      console.log("User don't exist")
      return res.status(400).json({ message: "User don't exist"});
    }
    const isMatched = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatched) {
      return res.status(400).json({ message: "Incorrect password" });
    } else {
      return res.status(201).json({
        message: "login successfull",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username || '',
          profile : user.profile ? `${user.profile.toString('base64')}` : '',
          friends : user.friends
        },
        token: user.generateToken(),
      });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ message: "error in login" });
  }
};

exports.logout = (req, res) => {
  try{
    return res.status(201).json({message : "Logout successfull"})
  }catch(err){
    console.log(err);
    return res.status(400).json({message: "Logout unsuccessfull"})
  }
};

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.forgot = async (req, res) => {
  try {    
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if(!user)
      return res.status(404).json({ error : "Email not found" })

    const otp = generateOTP();

    // Create transporter using Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_APP_PASS, // 16-digit app password
      },
    });

    // Mail options
    const mailOptions = {
      from: `"ChatHub Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code for Password Reset",
      html: `
        <!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="utf-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <title>Password Reset</title>
    <style>
      /* Mobile tweaks (kept tiny; most styling is inline for compatibility) */
      @media (max-width:600px){
        .container{ width: 100% !important; border-radius:16px !important; }
        .card{ padding: 20px !important; border-radius: 16px !important; }
        .otp{ font-size: 22px !important; letter-spacing: 4px !important; padding: 16px 18px !important; }
        .btn{ display:block !important; width:100% !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#e0e5ec; font-family:Arial,Helvetica,sans-serif; color:#333333;">
    <!-- Hidden preheader text -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
      Your ChatHub password reset code: ${otp} (valid for this session only)
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#e0e5ec; min-height:100vh;">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <!-- Outer card -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" class="container" style="
            width:560px; max-width:560px; background:#e0e5ec; 
            border-radius:20px; 
            box-shadow: 10px 10px 20px #bec3c9, -10px -10px 20px #ffffff;
          ">
            <tr>
              <td class="card" style="padding:32px; border-radius:20px;">
                
                <!-- Logo / App name -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" style="padding-bottom: 8px;">
                      <!-- Optional logo -->
                      <!-- <img src="{{logo_url}}" width="48" height="48" alt="ChatHub" style="display:block; border:0; outline:none; text-decoration:none; border-radius:12px; box-shadow: 4px 4px 8px #c2c7cd, -4px -4px 8px #ffffff;" /> -->
                      <div style="font-size:0; line-height:0; height:8px;">&nbsp;</div>
                      <h1 style="margin:0; font-size:22px; font-weight:700; letter-spacing:0.2px;">
                        ChatHub
                      </h1>
                    </td>
                  </tr>
                </table>

                <!-- Title -->
                <h2 style="margin: 20px 0 8px; font-size:20px; font-weight:700;">Password Reset Request</h2>

                <!-- Intro text -->
                <p style="margin: 0 0 20px; font-size:15px; line-height:1.6; color:#555;">
                  Use the one-time code below to reset your password. This code is valid for <b>this session only</b>.
                </p>

                <!-- OTP block (inset neumorphism) -->
                <div class="otp" style="
                  display:inline-block; 
                  background:#e0e5ec; 
                  border-radius:12px; 
                  padding:18px 22px; 
                  font-size:26px; 
                  font-weight:700; 
                  letter-spacing:6px; 
                  color:#333; 
                  box-shadow: inset 6px 6px 12px #bec3c9, inset -6px -6px 12px #ffffff;
                  margin: 8px 0 22px;
                ">
                  ${otp}
                </div>

                <!-- Button (slightly raised) -->
                <div style="margin: 6px 0 24px;">
                  <a href="{{reset_url}}" class="btn" style="
                    display:inline-block; 
                    background:#e0e5ec; 
                    color:#333; 
                    text-decoration:none; 
                    padding:12px 22px; 
                    border-radius:14px; 
                    font-weight:700; 
                    box-shadow: 8px 8px 16px #bec3c9, -8px -8px 16px #ffffff;
                  ">
                    Reset Password
                  </a>
                </div>

                <!-- Helper note -->
                <p style="margin:0 0 8px; font-size:13px; line-height:1.6; color:#666;">
                  Didn’t request this? You can safely ignore this email. Your password won’t change.
                </p>

                <!-- Divider (pressed line) -->
                <div style="
                  height:1px; margin:22px 0; background:#e0e5ec; 
                  box-shadow: inset 2px 2px 4px #cbd0d6, inset -2px -2px 4px #ffffff;
                "></div>

                <!-- Footer -->
                <p style="margin:0; font-size:12px; color:#7a7f85;">
                  This email was sent by ChatHub. If you need help, contact 
                  <a href="mailto:${process.env.GMAIL_USER}" style="color:#555; text-decoration:underline;">${process.env.GMAIL_USER}</a>.
                </p>

              </td>
            </tr>
          </table>
          <!-- /Outer card -->
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent successfully", otp });

  } catch (err) {
    console.error("Nodemailer error:", err.message || err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(email, newPassword);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { hashedPassword, salt } = await encryptPassword(newPassword);
    user.hashedPassword = hashedPassword;
    user.salt = salt;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Failed to reset password" });
  }
};

exports.otpLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 3,
    message: {
        error: "Too many OTP requests from this IP, please try again after 15 minutes."
    }
});