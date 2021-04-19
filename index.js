const axios = require('axios')
const clipboardy = require('clipboardy');
const fs = require('fs');
const FormData = require('form-data');
const shelljs = require('shelljs');

// ----------------------------------------------------------------
const apiKey = '' // download ShareX SXCU from galactic hosting and copy key
const username = '' // for example, doge is the username in /home/doge
// ----------------------------------------------------------------

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let data = new FormData();
const filename = makeid(20)
const dir = `/home/${username}/images/` + filename + '.png'
shelljs.exec(`gnome-screenshot -a -f ${dir}`)
data.append('file', fs.createReadStream(dir), `${filename}.png`)
axios.post('https://host.galactic-hosting.xyz/api/upload', data, {
    headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        "User-Agent": "ShareX/13.4.0",
        "Authorization": apiKey,
    }
})
.then(function (response) {
    shelljs.exec(`rm ${dir}`)
    clipboardy.writeSync(response.data.url);
})
.catch(function (response) {
    console.error(response);
});
