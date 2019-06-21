window.addEventListener('offline', (e) => {
    if (e.type === "offline") {
        uit('e-net', 1);
        inpb(1);
    } else {
        inpb(0);
        uit('e-net', 0);
    }
});

window.addEventListener('online', (e) => {
    if (e.type === "online") {
        uit('e-net', 0);
        inpb(0);
    } else {
        inpb(1);
        uit('e-net', 1);
    }
});

var lang = 0;
var pathEvents = (p) => {
    back = document.getElementById('back');
    if (p === "") {
        uit('back', 0);
    } else if (Routes[p] !== "" && p !== "play" && paths.length !== 1) {
        uit('back', 1);
        back.onclick = () => { nav('') }
    } else if (p === "play" && paths.length !== 1) {
        // console.log(paths[paths.length - 2]);
        back.onclick = () => { nav(paths[paths.length - 2]) }
    } else if (paths.length === 1) {
        nav('');
    }

}

var inpb = (c) => {
    if (c === 0) {
        document.getElementById('board').style.pointerEvents = "auto";
    } else {
        document.getElementById('board').style.pointerEvents = "none";
    }
}

var addticks = (t) => {
    try {
        // console.log(t.innerText + ' yooo');
        if (!t.innerText.includes('✔')) {
            t.innerText += "  ✔";
        }
    } catch (e) {

    }
}

var tickall = () => {
    var ct = 0
    try {
        rr = Object.keys(JSON.parse(localStorage.Routes));
    } catch (e) {
        rr = [];
    }
    rr.map((e) => {
        if (e !== "") {
            var full = 0;
            ec = document.getElementById(e).children;
            for (i = 0; i < ec.length; i++) {
                if (ec[i].innerText.includes("✔")) {
                    full++;
                }
            }

            // console.log(full);
            if (full === ec.length) {
                addticks(document.getElementById('home').children[ct]);
            }
            ct++;

        }
    });
}


var rstate = () => {
    if (localStorage.rounds) {
        la = JSON.parse(localStorage.rounds);
        // lll = la;
        lak = Array.from(Object.keys(la));
        // llll = lak;
        lak.map((e) => {
            // t = document.getElementById(e[0]).children[e[1]];
            la[e].map((ee) => {
                t = document.getElementById(e).children[ee];
                addticks(t);
            });

        });
    }

    tickall();
}





var langSelect = (ch) => {
    // fetch and store to mem
    if (!localStorage.lang) {
        rstate();
        return;
    }
    // fetch localst lang file then to lang var
    fetch(`/assets/lang/core/${localStorage.lang}.txt`).then(async (res) => {
        lang = await res.text();
        langDaemon('head', 1);
        langDaemon('back', 1);
        langDaemon('next', 1);
        langDaemon('lbl', 1);
        langDaemon('by', 1);
        langDaemon('e-ans');
        langDaemon('e-done');


        ids = Object.keys(JSON.parse(localStorage.Routes));
        ids.map((id) => {
            (id == "") ? id = "home" : null;
            if (id == "play") return;
            langDaemon(id);
        });

        rstate();

    });
}

var langDaemon = (id, e) => {
    if (!lang) {
        return;
    }
    var sheet = document.getElementById(id).children;
    if (e === 1) {
        // refactor code later
        // console.log('element level');
        var sheet = document.getElementById(id);
        var trans = "";
        txt = sheet.innerText;
        j = lang.indexOf(txt);
        var flag = 0;
        while (lang[j] !== "\n") {
            if (lang[j - 1] === ":" || flag === 1) {
                flag = 1;
                trans += lang[j];
            }
            j++;
        }
        // console.log(`${txt} : ${trans}`);
        (trans === "" || trans === undefined) ? trans = txt : null;
        sheet.innerText = trans;
    } else {
        for (i = 0; i < sheet.length; i++) {
            var trans = "";
            txt = sheet[i].innerText;
            j = lang.indexOf(txt);
            var flag = 0;
            while (lang[j] !== "\n") {
                if (lang[j - 1] === ":" || flag === 1) {
                    flag = 1;
                    trans += lang[j];
                }
                j++;
            }
            // console.log(`${txt} : ${trans}`);
            (trans === "" || trans === undefined) ? trans = txt : null;
            sheet[i].innerText = trans;
        }
    }

}

var imgFit = (id) => {
    var n = document.getElementById(id);
    if (n.src.includes('upTo5')) {
        n.style.width = "50%";
    }
}

var oalert = (msg, bt, ba) => {
    document.getElementById('omsg').innerHTML = msg;
    inpb(1);
    uit('overlay', 1);
    document.getElementById('oact').innerText = bt;
    document.getElementById('oact').onclick = () => { ba(); uit('overlay', 0) }
}

var gameskel;

var gamef = () => {
    fetch(`/assets/game.json`).then(async (res) => {
        gameskel = await res.json();
    });
}

langSelect();
var gdat, lvl, round, ans, sess, mix = 0, ff = 0;

var game = (n) => {
    round = n;
    ses = 0;
    sess = 0;
    sn = 0;
    lvl = paths[paths.length - 2];
    gdat = gameskel[lvl];
    gbuild();
}

gamef();
var gbuild = () => {
    document.getElementById('q').innerText = "";
    document.getElementById('count').innerText = "";

    uit('ans', 0);
    g = gdat[round];
    // console.log(g);
    if (!sess) {
        sess = 0;
    }


    if (g["set"] !== undefined) {
        sn = g["set"].length;
        // Enter qna mode
        if (g["set"][ses] === undefined && sn !== 0) {
            inpb(1);
            uit('e-done', 1);
            return;
        }

        if (ses < sn) {

            if (sess < g["set"][ses]["opts"].length) {
                ops = g["set"][ses]["opts"][sess];
                ans = g["set"][ses]["ans"][sess];
                // ques null mix case
                if (g["set"][ses]["ques"] === "") {
                    mix++;
                    document.getElementById('q').innerText = "";
                    document.getElementById('count').innerText = "";
                    img = document.getElementById('qimg');
                    img.src = `/assets/images/core/${lvl}_${round + 1}_${ses + mix}q.jpg`;
                    inpb(1);
                    uit('qimg', 0);
                    uit('spin', 1);
                    img.onload = () => {
                        inpb(0);
                        uit('qimg', 1);
                        uit('spin', 0);
                    }
                    document.getElementById('op1').innerHTML = ops[0];
                    document.getElementById('op2').innerHTML = ops[1];
                    document.getElementById('op3').innerHTML = ops[2];
                    document.getElementById('op4').innerHTML = ops[3];
                    sess++;
                    uit('ques', 1);
                    if (g["set"][ses]["ans"][sess] === undefined) {
                        ff = 1;
                    }
                } else {
                    mix = 0;
                    document.getElementById('q').innerText = g["set"][ses]["ques"];
                    langDaemon('q', 1);
                    document.getElementById('count').innerText = `${sess + 1}/${g["set"][ses]["opts"].length}`
                    img = document.getElementById('qimg');
                    img.src = `/assets/images/core/${lvl}_${round + 1}_${ses + 1}.${sess + 1}q.jpg`;
                    inpb(1);
                    uit('qimg', 0);
                    uit('spin', 1);
                    img.onload = () => {
                        inpb(0);
                        uit('qimg', 1);
                        uit('spin', 0);
                    }
                    imgFit('qimg');
                    document.getElementById('op1').innerHTML = ops[0];
                    document.getElementById('op2').innerHTML = ops[1];
                    document.getElementById('op3').innerHTML = ops[2];
                    document.getElementById('op4').innerHTML = ops[3];
                    sess++;
                }

            } else {

                if (ff === 1) {
                    ff = 0;
                    inpb(1);
                    uit('e-done', 1);
                    return;


                }

                if (mix !== 0) {
                    return;
                }




                img = document.getElementById('aimg');
                img.src = `/assets/images/core/${lvl}_${round + 1}_${ses + 1}a.jpg`;
                uit('spin', 1);
                inpb(1);
                img.onload = () => {
                    inpb(0);
                    uit('spin', 0);
                }
                uit('ques', 0);
                uit('ans', 1);
                ses++;
                sess = 0;
                return;
            }
        }

        uit('ques', 1);
        return;

    }

    if (g["opts"][sess] === undefined) {
        inpb(1);
        uit('e-done', 1);
        return;
    }

    if (g["opts"]) {
        ops = g["opts"][sess];
        ans = g["ans"][sess];
        img = document.getElementById('qimg')
        img.src = `/assets/images/core/${lvl}_${round + 1}_${sess + 1}q.jpg`;
        uit('spin', 1);
        document.getElementById('board').style.pointerEvents = "none";
        inpb(1);

        img.onload = () => {
            inpb(0);
            uit('spin', 0);
        }
        imgFit('qimg');
        document.getElementById('op1').innerHTML = ops[0];
        document.getElementById('op2').innerHTML = ops[1];
        document.getElementById('op3').innerHTML = ops[2];
        document.getElementById('op4').innerHTML = ops[3];
    }

    sess++;
    uit('ques', 1);
}

var next = (el) => {
    if (el.innerText === ans.toString()) {
        if (sn !== 0 && mix === 0) {                                                                               // abacus_2_1a.JPG
            gbuild();
        } else if (mix === 0) {
            img = document.getElementById('aimg')
            img.src = `/assets/images/core/${lvl}_${round + 1}_${sess}a.jpg`;
            inpb(1);
            uit('spin', 1);
            img.onload = () => {
                inpb(0);
                uit('spin', 0);
            }
            imgFit('aimg');
            uit('ques', 0);
            uit('ans', 1);
        } else {
            // mix case
            img = document.getElementById('aimg')
            img.src = `/assets/images/core/${lvl}_${round + 1}_${ses + mix}a.jpg`;
            inpb(1);
            uit('spin', 1);
            img.onload = () => {
                inpb(0);
                uit('spin', 0);
            }

            imgFit('aimg');
            uit('ques', 0);
            uit('ans', 1);

        }

    } else {
        inpb(1);
        uit('e-ans', 1);
    }
}

var gameup = () => {
    // nav back;
    nav(paths[paths.length - 2]);
    t = document.getElementById(lvl).children[round];
    addticks(t);
    l = localStorage.rounds;
    try {
        l = JSON.parse(l);
    } catch (e) { };

    if (l === undefined || l === "") {
        obj = {};
        obj[lvl] = [round];
        localStorage.rounds = JSON.stringify(obj);
        // console.log("case1 ")
    } else if (l[lvl] !== undefined) {

        if (!l[lvl].includes(round)) {
            l[lvl].push(round);
            localStorage.rounds = JSON.stringify(l);
        }
        // console.log("case2")
    } else if (l[lvl] === undefined) {
        l[lvl] = [];
        l[lvl].push(round);
        localStorage.rounds = JSON.stringify(l);
        // console.log("case3 " + l[lvl])
    }

    gdat, lvl, round, ans, sess;
    tickall();
}



var lll, llll;

if (window.navigator.onLine !== true) {
    inpb(1);
    uit('e-net', 1);
} else inpb(0);
