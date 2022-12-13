const { readdirSync } = require("fs")
const { join } = require("path")
const express = require("express")
const rateLimit = require("express-rate-limit")
const env = require("dotenv").config()
const app = express()
const port = process.env.port

app.set("view engine", "ejs")
app.set("views", join(__dirname, "src/views"))
app.use(express.static(join(__dirname, "src/public")))


const PageFile = readdirSync(`./src/pages`).filter(files => files.endsWith(".js"))
for(const file of PageFile) {
	const { execute, name } = require(`./src/pages/${file}`)
	app.get(name, async(req, res) => {
		execute(req, res)
	})
}


app.use(function(req, res){
    res.status(404).send("🍌, 404")
});


// RateLimiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true,
	legacyHeaders: false
})

app.use(limiter)
app.listen(port, () => {
	console.log(`Listening to requests on http://localhost:${port} !\nHanging for dear life on process: ${process.pid}`);
});

