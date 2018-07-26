let http = require("http");
let express = require("express");
let app = express();
let fs = require("fs");
let colors = require("colors");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname + '/app'));

let server = http.createServer(app);
server.listen(8080, () => {
    console.log("[INFO] server listening on port 8080".green);
});

let iconData = {};
let iconFileName = __dirname + '/icons.json';

try {
    let fileData = fs.readFileSync(iconFileName);
    iconData = JSON.parse(fileData);
    console.log("[INFO] successfully loaded icon data!".green);
} catch (err) {
    console.log("[ERROR] icons.json not found!".red);
}

app.get('/bootstrap', (req, res) => {
    res.contentType("text/css");
    res.status(200).sendFile(__dirname + '/app/css/bootstrap.min.css');
});

app.get('/fontawesome', (req, res) => {
    res.contentType("text/css");
    res.status(200).sendFile(__dirname + '/app/css/all.min.css');
});

app.get('/jquery', (req, res) => {
    res.contentType("text/javascript");
    res.status(200).sendFile(__dirname + '/app/js/jquery-3.3.1.min.js');
});

app.get('/popper', (req, res) => {
    res.contentType("text/javascript");
    res.status(200).sendFile(__dirname + '/app/js/popper.min.js');
});

app.get('/bootstrapjs', (req, res) => {
    res.contentType("text/javascript");
    res.status(200).sendFile(__dirname + '/app/js/bootstrap.min.js');
});

app.get('/icons', (req, res) => {
    let data = "";
    let giveBrands = true;
    let giveSolid = true;
    let giveRegular = true;
    let giveLight = true;
    let version = "";

    if(req.query.style != null){
        if(req.query.style == "brands"){
            giveSolid = false;
            giveRegular = false;
            giveLight = false;
        } else if (req.query.style == "solid"){
            giveBrands = false;
            giveRegular = false;
            giveLight = false;
        } else if (req.query.style == "regular"){
            giveBrands = false;
            giveSolid = false;
            giveLight = false;
        } else if (req.query.style == "light"){
            giveBrands = false;
            giveSolid = false;
            giveRegular = false;
        }
    }

    if(req.query.version != null){
        version = req.query.version;
    }
    

    for(let icon in iconData){
        let temp = iconData[icon];
        if(version == temp.changes[0] || version == ""){
            if(temp.styles.length == 1 && giveBrands){
                data += `<div class="col-2 mt-3 text-center">
                    <div class="card">
                        <div class="card-header">
                            <a href="/icons/${icon}?style=brands"><i class="fab fa-${icon} fa-fw fa-4x"></i></a>
                        </div>
                        <div class="card-text">
                            ${icon}
                        </div>
                    </div>
                </div>`;
            } else if(temp.styles.length == 3){
                if(giveSolid)
                data += `<div class="col-2 mt-3 text-center">
                    <div class="card">
                        <div class="card-header">
                        <a href="/icons/${icon}?style=solid"><i class="fas fa-${icon} fa-fw fa-4x"></i></a>
                        </div>
                        <div class="card-text">
                            ${icon}
                        </div>
                    </div>
                </div>`;
                if(giveRegular)
                data += `<div class="col-2 mt-3 text-center">
                    <div class="card">
                        <div class="card-header">
                        <a href="/icons/${icon}?style=regular"><i class="far fa-${icon} fa-fw fa-4x"></i></a>
                        </div>
                        <div class="card-text">
                            ${icon}
                        </div>
                    </div>
                </div>`;
                if(giveLight)
                data += `<div class="col-2 mt-3 text-center">
                    <div class="card">
                        <div class="card-header">
                        <a href="/icons/${icon}?style=light"><i class="fal fa-${icon} fa-fw fa-4x"></i></a>
                        </div>
                        <div class="card-text">
                            ${icon}
                        </div>
                    </div>
                </div>`;
            }
        }
        
    }

    res.contentType("text/html");
    res.status(200).send(data);
});

let colorPalette = [["#99E9F2", "#3BC9DB", "#15AABF", "#0C8599"],["#EEBEFA", "#DA77F2", "#BE4BDB", "#9C36B5"],["#FCC2D7", "#F783AC", "#E64980", "#C2255C"],["#FFD8A8", "#FFA94D", "#FD7E14", "#E8590C"],["#D8F5A2", "#A9E34B", "#82C91E", "#66A80F"]];


app.get('/icons/:icon', (req, res) => {
    let random = Math.floor(Math.random() * Math.floor(colorPalette.length));
    let temp = iconData[req.params.icon];
    let style = req.query.style;
    let data = "";

    data += `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
        <link rel="stylesheet" href="/bootstrap">
        <link rel="stylesheet" href="/fontawesome">
        <title>Font Awesome Viewer - ${req.params.icon}</title>
        <style>
            .pulse{
                animation-name:pulse;
                animation-duration:2s;
                animation-iteration-count:infinite;
                animation-direction:alternate;
            }

            .rainbow {
                animation-name:rainbow;
                animation-duration:5s;
                animation-iteration-count:infinite;
                animation-timing-function:linear;
            }

            @keyframes pulse{
                from {opacity:0.75;}
                to {opacity:0.5;}
            }

            @keyframes rainbow{
                0% {color: hsl(0, 100%, 50%);}
                10% {color: hsl(36, 100%, 50%);}
                20% {color: hsl(72, 100%, 50%);}
                30% {color: hsl(108, 100%, 50%);}
                40% {color: hsl(144, 100%, 50%);}
                50% {color: hsl(180, 100%, 50%);}
                60% {color: hsl(216, 100%, 50%);}
                70% {color: hsl(252, 100%, 50%);}
                80% {color: hsl(288, 100%, 50%);}
                90% {color: hsl(324, 100%, 50%);}
                100% {color: hsl(360, 100%, 50%);}
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h1 class="display-4">${req.params.icon}</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-8">
                    ${temp.label}
                    <i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-sm"></i>
                    ${temp.unicode}
                </div>
                <div class="col-4">
                    Added: <b>Version ${temp.changes[0]}</b>
                    Changed: <b>Version ${temp.changes[temp.changes.length-1]}</b>
                </div>
            </div>
            <div class="row">
                <div class="col-12 bg-dark py-1 rounded"></div>
            </div>
            <div class="row mt-3">
                <div class="col-3 text-center">
                    <span data-toggle="tooltip" data-placement="bottom" title="2x"><i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-2x"></i></span>
                </div>
                <div class="col-3 text-center">
                    <span data-toggle="tooltip" data-placement="bottom" title="4x"><i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-4x"></i></span>
                </div>
                <div class="col-3 text-center">
                    <span data-toggle="tooltip" data-placement="bottom" title="7x"><i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-7x"></i></span>
                </div>
                <div class="col-3 text-center">
                    <span data-toggle="tooltip" data-placement="bottom" title="10x"><i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-10x"></i></span>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col-3">
                    <div class="card shadow rounded">
                        <div class="card-body py-4 px-5 text-center">
                            <i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-3x"></i>
                        </div>
                    </div>
                </div>
                <div class="col-3">
                    <div class="card shadow rounded">
                        <div class="card-body py-4 px-5 text-center" style="background-color:#CCCCD5;">
                            <i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-3x"></i>
                        </div>
                    </div>
                </div>
                <div class="col-3">
                    <div class="card shadow rounded">
                        <div class="card-body py-4 px-5 text-center" style="background-color:#88888F;color:#FFFFFF">
                            <i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-3x"></i>
                        </div>
                    </div>
                </div>
                <div class="col-3">
                    <div class="card shadow rounded">
                        <div class="card-body py-4 px-5 text-center" style="background-color:#33333F;color:#FFFFFF">
                            <i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-3x"></i>
                        </div>
                    </div>
                </div>
                <div class="col-3 mt-3">
                    <div class="card shadow rounded">
                        <div class="card-body py-4 px-5 text-center" style="background-color:${colorPalette[random][0]};color:#FFFFFF">
                            <i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-3x"></i>
                        </div>
                    </div>
                </div>
                <div class="col-3 mt-3">
                    <div class="card shadow rounded">
                        <div class="card-body py-4 px-5 text-center" style="background-color:${colorPalette[random][1]};color:#FFFFFF">
                            <i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-3x"></i>
                        </div>
                    </div>
                </div>
                <div class="col-3 mt-3">
                    <div class="card shadow rounded">
                        <div class="card-body py-4 px-5 text-center" style="background-color:${colorPalette[random][2]};color:#FFFFFF">
                            <i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-3x"></i>
                        </div>
                    </div>
                </div>
                <div class="col-3 mt-3">
                    <div class="card shadow rounded">
                        <div class="card-body py-4 px-5 text-center" style="background-color:${colorPalette[random][3]};color:#FFFFFF">
                            <i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-3x"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-5 rounded" style="background-color:#495057">
                <div class="col-12 py-3">
                    <div class="row">
                        <div class="col-10 offset-1 text-center py-2" style="background-color:#343A40;color:#EEEEEE;">
                            <span style="color:#868E96;">&lt;</span><span style="color:#FFD8A8;">i</span> <span style="color:#FFA94D;">class</span><span style="color:#868E96;">=&quot;</span>fa${style[0]} fa-${req.params.icon}<span style="color:#868E96;">&quot;&gt;&lt;/</span><span style="color:#FFD8A8;">i</span><span style="color:#868E96;">&gt;</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col-4 rounded pb-5 rounded" style="background-color:${colorPalette[random][0]};">
                    <div style="position:relative;left:7%;width:86%;background-color:#343A40;height:16rem;border-bottom-left-radius:1rem;border-bottom-right-radius:1rem;"> <!-- Handy -->
                        <div style="position:relative;left:5%;width:90%;height:13rem;background-color:${colorPalette[random][0]};"> <!-- Display -->
                            <div style="position:relative;text-align:center;color:#FFFFFF;height:0rem;" class="pulse"><i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-4x"></i></div> <!-- Icon -->
                            <div style="position:relative;width:100%;height:3rem;"> <!-- Menu -->
                                <div style="position:relative;text-align:center;height:100%;width:33%;float:left;top:10rem;background-color:rgba(0,0,0,0.5);color:#FFFFFF;"><i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-2x"></i></div>
                                <div style="position:relative;text-align:center;height:100%;width:34%;float:left;top:10rem;background-color:rgba(0,0,0,0.2);color:#FFFFFF;"><i class="fas fa-plus-square fa-fw fa-2x"></i></div>
                                <div style="position:relative;text-align:center;height:100%;width:33%;float:left;top:10rem;background-color:rgba(0,0,0,0.2);color:#FFFFFF;"><i class="fas fa-comment fa-fw fa-2x"></i></div>
                            </div>
                        </div>
                        <div style="position:relative;border-radius:100%;background-color:${colorPalette[random][0]};height:2rem;width:2rem;margin:auto;top:0.5rem;"></div> <!-- Home Button -->
                    </div>
                </div>
                <div class="col-4 rounded pb-5 rounded" style="background-color:${colorPalette[random][1]};">
                    <div class="rounded" style="position:relative;margin:auto;background-color:#EEEEEE;top:7rem;height:4rem;">
                        <div style="position:relative;width:20%;height:100%;float:left;">
                            <i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-4x rainbow"></i>
                        </div>
                        <div style="position:relative;width:80%;height:100%;float:left;text-align:center;">
                            <span style="color:${colorPalette[random][3]};font-size:1.4rem;">Somewhere over the rainbow...</span>
                        </div>
                    </div>
                </div>
                <div class="col-4 rounded pb-5 rounded" style="background-color:${colorPalette[random][3]};">
                    <div class="rounded" style="position:relative;margin:auto;background-color:#EEEEEE;top:7rem;height:4rem;">
                        <div style="position:relative;width:20%;height:100%;float:left;text-align:center;">
                            <span style="position:relative;top:1rem;color:${colorPalette[random][3]}"><i class="fa${style[0]} fa-${req.params.icon} fa-fw fa-2x fa-spin"></i></span>
                        </div>
                        <div style="position:relative;width:80%;height:100%;float:left;text-align:center;">
                            <span style="color:${colorPalette[random][3]};font-size:1.4rem;">Give it a spin!</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-5 bg-dark">
                <div class="col-12 py-5 text-center">
                    <div style="position:relative;float:left;width:24.5%;background-color:#343A40;color:#AAAAAA">
                        <i class="fas fa-home fa-fw"></i> Home
                    </div>
                    <div style="position:relative;float:left;width:0.5%;background-color:#000000;">|</div>
                    <div style="position:relative;float:left;width:24.5%;background-color:#343A40;color:#AAAAAA">
                        <i class="fas fa-microchip fa-fw"></i> Technology
                    </div>
                    <div style="position:relative;float:left;width:0.5%;background-color:#000000;">|</div>
                    <div style="position:relative;float:left;width:24.5%;background-color:#343A40;color:#AAAAAA">
                        <i class="fas fa-users fa-fw"></i> About us
                    </div>
                    <div style="position:relative;float:left;width:0.5%;background-color:#000000;">|</div>
                    <div style="position:relative;float:left;width:24.5%;background-color:#343A40;color:#EEEEEE">
                        <i class="fa${style[0]} fa-${req.params.icon} fa-fw"></i> Blog
                    </div>
                </div>
            </div>
            <div class="row mt-5 mb-5">
                <div class="col-4 offset-4">
                    <a href="/" class="btn btn-outline-primary btn-block">Zurück</a>
                </div>
            </div>
        </div>
        <script src="/jquery"></script>
        <script src="/popper"></script>
        <script src="/bootstrapjs"></script>
        <script>
            $(document).ready(() => {
                $('[data-toggle="tooltip"]').tooltip();
            });
        </script>
    </body>
    </html>`;

    res.contentType("text/html");
    res.status(200).send(data);
});