const fs = require("fs")


function register() {
    fs.readFile("/data/User.json", (err, buffer) => {
        if (err) return console.error('File read error: ', err)

        const data = JSON.parse(buffer.toString())
        alert(data.fName);

        fs.writeFile("test.json", JSON.stringify(data), err => {
            if (err) return console.error('File write error:', err)
        })
    })
}