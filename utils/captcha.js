const { createCanvas } = require("canvas");

function randomText(length = 6) {

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    return Array.from({ length }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join("");

}

async function createCaptcha() {

    const answer = randomText();

    const width = 1000;
    const height = 500;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#5865F2");
    gradient.addColorStop(1, "#2B2D31");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative circles
    for (let i = 0; i < 25; i++) {

        ctx.beginPath();

        ctx.arc(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 8 + 2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.fill();

    }

    // Card
    ctx.fillStyle = "#FFFFFF";
    roundRect(ctx, 180, 140, 640, 220, 25);

    // Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("AXIORA VERIFICATION", width / 2, 70);

    ctx.font = "30px Arial";
    ctx.fillText("Type the code below", width / 2, 115);

    // Captcha
    ctx.fillStyle = "#5865F2";
    ctx.font = "bold 90px Arial";
    ctx.fillText(answer, width / 2, 275);

    // Noise lines
    for (let i = 0; i < 6; i++) {

        ctx.strokeStyle = "rgba(88,101,242,.35)";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();

    }

    // Footer
    ctx.fillStyle = "#555";
    ctx.font = "24px Arial";
    ctx.fillText(
        "Expires in 5 Minutes • Axiora Security",
        width / 2,
        335
    );

    return {
        answer,
        image: canvas.toBuffer("image/png")
    };

}

function roundRect(ctx, x, y, w, h, r) {

    ctx.beginPath();

    ctx.moveTo(x + r, y);

    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);

    ctx.closePath();

    ctx.fill();

}

module.exports = {
    createCaptcha
};
