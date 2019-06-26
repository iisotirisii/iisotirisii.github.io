window.addEventListener('offline', (e) => {
    if (e.type === "offline") {
        uit('e-net', 1);
    } else {
        uit('e-net', 0);
    }
});

window.addEventListener('online', (e) => {
    if (e.type === "online") {
        uit('e-net', 0);
    } else {
        uit('e-net', 1);
    }
});

var lang = 0;
var pathEvents = (p) => {
    if (p === "") {
        uit('header_btn', 0);
        if (localStorage.lang || localStorage.lang === "") {
            nav('levels');
        }    
    } else if (p === "play") {
        uit('header_btn', 0);
        uit('back', 1);
    } else {
        uit('header_btn', 1);
        uit('back', 0);
    }

    if(paths.length === 1) {
        nav('');
    }

    if(p==="settings") {
        uit('header_btn', 0);
    }

}


var addticks = (t) => {
    try {
        // console.log(t.innerText + ' yooo');
        if (!t.innerText.includes('✔')) {
            t.innerText += "  ✔";
            t.classList.add('green');
        }
    } catch (e) {

    }
}

var tickall = () => {
    var ct = 0;
    try {
        rr = Object.keys(JSON.parse(localStorage.Routes));
    } catch (e) {
        rr = [];
    }
    rr.map((e) => {
        
            if(e==="levels" || e==="play" || e==="" || e==="settings"){
                return;
            }
            var full = 0;
            ec = document.getElementById(e).children;
            for (i = 0; i < ec.length; i++) {
                if (ec[i].innerText.includes("✔")) {
                    full++;
                }
            }
           

            if (full === ec.length-3) {
                addticks(document.getElementById('pad').children[ct]);
            }
            ct++;
        
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



var ld = (id, e) => {
    if (!lang) {
        return;
    }
    var sheet = document.getElementById(id).children;
    if (e === 1) {
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
            if(j>5000) {
                console.log("killed translator err : " + txt);
                return;
            }
        } 
        (trans === "" || trans === undefined) ? trans = txt : null;
        sheet.innerText = trans;
    } else if (e === "m") {
        var sheet = document.getElementById(id);
        var trans = "";
        j = lang.indexOf("Hi there!");
        var flag = 0;
        while (lang[j] !== "\n") {
            if (lang[j - 1] === ":" || flag === 1) {
                flag = 1;
                trans += lang[j];
            }
            j++;
            if(j>5000) {
                console.log("killed translator err : " + txt);
                return;
            }
        }
        (trans === "" || trans === undefined) ? trans = "nope" : null;
        sheet.innerText = trans;
    } else if (e===0){
        for (i = 0; i < sheet.length; i++) {
            var trans = "";
            txt = sheet[i].innerText;
            // alert(txt)
            j = lang.indexOf(txt);
            var flag = 0;
            while (lang[j] !== "\n") {
                if (lang[j - 1] === ":" || flag === 1) {
                    flag = 1;
                    trans += lang[j];
                }
                j++;
                if(j>5000) {
                    console.log("killed translator err : " + txt);
                    return;
                }
            }
            // alert(`${txt} : ${trans}`);
            (trans === "" || trans === undefined) ? trans = txt : null;
            sheet[i].innerText = trans;
        }
    }

}


var langSelect = (ch) => {
    // alert('called loop');
    // fetch and store to mem
    if (!localStorage.lang) {
        rstate();
        return;
    }
    // fetch localst lang file then to lang var
    fetch(`/assets/lang/core/${localStorage.lang}.txt`).then(async (res) => {
        lang = await res.text();
        // optimize this later, not acceptable

        ld('header_text', 1);
        ld('start', 1);

        ld('back1', 1);
        ld('back2', 1);
        ld('back3', 1);
        ld('back4', 1);
        ld('back5', 1);
        ld('back6', 1);
        ld('back7', 1);
        ld('back8', 1);

        ld('next', 1);
        ld('wallah', 1);
        ld('roundc', 1);
        ld('kay', 1);

        ld('lang_label', 1);
        ld('desc', 'm');

        ld('net', 1);
        ld('net', 1);
        ld('by', 1);
        ld('by1', 1);
        ld('lbl', 1);
        ld('rpg', 1);
        ld('rpl', 1);
        ld('oact', 1);
        
        ld("pad", 0);
        vd = Object.keys(JSON.parse(localStorage.Routes));
        vd.map((x) => {
            if (x === "play" || x === "" || x === "lang" || x ==="settings" || x==="levels") return;
            ld(x, 0);
        });

        // console.log('done');
        rstate();
    }).catch((e) => {

    });
}


var imgFit = (id) => {
    var n = document.getElementById(id);
    if (n.src.includes('upTo5_1') || n.src.includes('upTo5_7_1a') || n.src.includes('upTo5_7_1q') || n.src.includes('upTo5_5') || n.src.includes('upTo5_6') || n.src.includes('upTo5_2') ||  n.src.includes('upTo5_7') ) {
        if(id==='aimg') {
            n.style.width = "35%";
            return;
        }
        n.style.width = "50%";
        n.classList.add("ffit");
    } else {
        if(id==='aimg') {
            n.style.width = "65%";
            return;
        }
        n.style.width = "85%";
        try {
            n.classList.remove("ffit");
        } catch (e) { }
    }
}

var gameskel;

var gamef = () => {
    fetch(`/assets/game.json`).then(async (res) => {
        gameskel = await res.json();
    });
}

var gdat, lvl, round, ans, sess, mix = 0, ff = 0;

var game = (n) => {
    // alert(n);
    round = n;
    ses = 0;
    sess = 0;
    sn = 0;
    lvl = paths[paths.length - 2];
    gdat = gameskel[lvl];
    gbuild();
}


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
            // inpb(1);
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
                    uit('qimg', 0);
                    uit('qspin', 1);
                    img.onload = () => {
                        uit('qspin', 0);
                        uit('qimg', 1);
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
                    ld('q', 1);
                    document.getElementById('count').innerText = `${sess + 1}/${g["set"][ses]["opts"].length}`
                    img = document.getElementById('qimg');
                    img.src = `/assets/images/core/${lvl}_${round + 1}_${ses + 1}.${sess + 1}q.jpg`;
                    uit('qimg', 0);
                    uit('qspin', 1);
                    img.onload = () => {
                        uit('qimg', 1);
                        uit('qspin', 0);
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
                    uit('e-done', 1);
                    return;
                }

                if (mix !== 0) {
                    return;
                }

                img = document.getElementById('aimg');
                img.src = `/assets/images/core/${lvl}_${round + 1}_${ses + 1}a.jpg`;
                uit('aspin', 1);
                uit('aimg', 0);

                img.onload = () => {
                    uit('aspin', 0);
                    uit('aimg', 1);
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
        uit('e-done', 1);
        return;
    }

    if (g["opts"]) {
        ops = g["opts"][sess];
        ans = g["ans"][sess];
        img = document.getElementById('qimg');
        img.src = `/assets/images/core/${lvl}_${round + 1}_${sess + 1}q.jpg`;
        uit('qspin', 1);
        uit('qimg', 0);
        img.onload = () => {
            uit('qspin', 0);
            uit('qimg', 1);
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
            uit('aspin', 1);
            uit('aimg', 0);
            img.onload = () => {
                uit('aspin', 0);
                uit('aimg', 1);
            }
            imgFit('aimg');
            uit('ques', 0);
            uit('ans', 1);
        } else {
            img = document.getElementById('aimg')
            img.src = `/assets/images/core/${lvl}_${round + 1}_${ses + mix}a.jpg`;
            uit('aspin', 1);
            uit('aimg', 0);
            img.onload = () => {
                uit('aspin', 0);
                uit('aimg', 1);
            }
            imgFit('aimg');
            uit('ques', 0);
            uit('ans', 1);
        }
    } else {
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
    } else if (l[lvl] !== undefined) {

        if (!l[lvl].includes(round)) {
            l[lvl].push(round);
            localStorage.rounds = JSON.stringify(l);
        }
    } else if (l[lvl] === undefined) {
        l[lvl] = [];
        l[lvl].push(round);
        localStorage.rounds = JSON.stringify(l);
    }

    gdat, lvl, round, ans, sess;
    tickall();
}



var lll, llll;

if (window.navigator.onLine !== true) {
    // inpb(1);
    uit('e-net', 1);
} else {

}

var runit = () => {
    localStorage.runit = "ok";
    localStorage.lang = document.getElementById('lang').value;
    window.location.reload();
}


llang = document.getElementById('lang');
try {
    llang.onchange = () => {
        localStorage.lang = llang.value;
        llang.disabled = true;
        langSelect();
    }
} catch (e) {

}

var back = () => nav(paths[paths.length - 2]);
gamef();
langSelect();