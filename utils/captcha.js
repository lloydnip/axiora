    const svgCaptcha = require("svg-captcha");
    const sharp = require("sharp");

    async function createCaptcha() {

        const captcha = svgCaptcha.create({

            size: 6,
            noise: 2,
            color: true,
            background: "#202020",

            width: 500,
            height: 180,

            ignoreChars: "0OoIiLl1",

            fontSize: 80

        });

        const image = await sharp(
            Buffer.from(captcha.data)
        )
            .png()
            .toBuffer();

        return {
            answer: captcha.text,
            image
        };

    }   

    module.exports = {
        createCaptcha
    };
