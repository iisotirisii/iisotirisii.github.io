//     ___         __              __       ____                  __
//    /   | ____ _/ /______ ______/ /_     / __ \____ _____  ____/ /__  __  __
//   / /| |/ __ `/ //_/ __ `/ ___/ __ \   / /_/ / __ `/ __ \/ __  / _ \/ / / /
//  / ___ / /_/ / ,< / /_/ (__  ) / / /  / ____/ /_/ / / / / /_/ /  __/ /_/ /
// /_/  |_\__,_/_/|_|\__,_/____/_/ /_/  /_/    \__,_/_/ /_/\__,_/\___/\__, /
//                                                                   /____/
//                           [ SKYROUTES 1.2 ]
//       
//     All Rights Reserved - https://github.com/AakashPandey/skyroutes

navigator.serviceWorker.addEventListener('controllerchange', ()=>{
    window.location.reload()
}
);

var swork;
if ('serviceWorker'in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
        if (swork = reg.waiting) {
            upsw()
        }
        reg.addEventListener('updatefound', ()=>{
            console.log('New state found');
            swork = reg.installing;
            swork.addEventListener('statechange', ()=>{
                if (swork.state === 'installed' && navigator.serviceWorker.controller) {
                    upsw()
                }
            }
            )
        }
        )
    }).catch(function(error) {
        console.log(error);
    })
}
var upsw = ()=>{
    swork.postMessage({
        action: 'clearOld'
    });
    swork.postMessage({
        action: 'skipWaiting'
    });
    console.log('fired the update')
}
var ui = (el)=>{
    el = document.getElementById(el);
    if (el.classList.contains('irt')) {
        el.classList.toggle('irt');
        el.classList.toggle('vis');
        return
    }
    el.classList.toggle('rt');
    el.classList.toggle('vis')
}
var iu = ()=>{
    e = document.querySelectorAll(".vis");
    for (i = 0; i < e.length; i++) {
        e[i].classList.remove('vis');
        e[i].classList.add('rt')
    }
}
var Routes;
var ipp = ()=>{
    var Path = {};
    e = document.querySelectorAll(".irt");
    Path[""] = e[0].id;
    e = document.querySelectorAll(".rt");
    for (i = 0; i < e.length; i++) {
        Path[e[i].id] = e[i].id
    }
    return (Path)
}
var dbDef = {
    dbName: "SkyRoutes",
    dbVer: 1,
    dbStore: "routes",
    dbKeyp: "auto"
}
var run = ()=>{
    Routes = ipp();
    if (!localStorage.Routes) {
        localStorage.Routes = JSON.stringify(Routes);
        dbRun(dbDef, Routes).then(e=>{
            console.log(e)
        }
        )
    }
    if (localStorage.Routes !== JSON.stringify(Routes)) {
        dbRun(dbDef, Routes, 1).then(e=>{
            console.log(e);
            navigator.serviceWorker.controller.postMessage({
                action: 'rescanPath'
            });
            localStorage.Routes = JSON.stringify(Routes)
        }
        )
    }
    nav()
}

var uit = (id, st) => {
    el = document.getElementById(id);
    if(st==0) {
        el.classList.toggle('show');
        el.style.display = "none";
    } else {
        el.classList.toggle('show');
        el.style.display = "block";
    }
}

var paths = [];

var nav = (p) => {
    paths.push(p);
    // If URI Load
    if (!p && p !== "") {
      rt = Routes[location.pathname.slice(1)];
    } else {
      rt = Routes[p];
      if (p !== "") {
        history.pushState({ path: rt }, "SkyRoute", `/${rt}`);
      } else {
        history.pushState({ path: rt }, "SkyRoute", `/`);
      }
    }
    iu();
    if (!rt) {
       trn = location.pathname.slice(1);
        // band-aid
       (trn=="index.html") ? nav('') : null; 
       console.log("Route invalid");
    } else {
      ui(rt);
    }
    pathEvents(location.pathname.slice(1));
  }
document.addEventListener('DOMContentLoaded', ()=>{
    run();
    window.addEventListener('popstate', ()=>{
        nav()
    }
    )
}
, !1);
var dbRun = (dbDef,data,up)=>{
    return new Promise((resolve,reject)=>{
        req = indexedDB.open(dbDef.dbName, dbDef.dbVer);
        req.onsuccess = (ev)=>{
            if (up === 1) {
                key = 1;
                req = ev.target.result;
                var trx = req.transaction([dbDef.dbStore], "readwrite").objectStore(dbDef.dbStore);
                req = trx.get(key);
                req.onsuccess = (r)=>{
                    if (r.target.result !== undefined) {
                        pdata = r.target.result;
                        pdata = data;
                        var upd = trx.put(pdata, key);
                        upd.onsuccess = (e)=>{
                            resolve(`[updateDB] ${dbDef.dbName}, updated ${key} `)
                        }
                    } else {
                        resolve(`[updateDB] ${dbDef.dbStore}, key: ${key} not found`)
                    }
                }
                ;
                trx.onerror = (e)=>{
                    resolve(e)
                }
            }
        }
        req.onupgradeneeded = (e)=>{
            req = e.target.result;
            var objectStore = req.createObjectStore(dbDef.dbStore, {
                autoIncrement: !0
            });
            objectStore.transaction.oncomplete = async(e)=>{
                trx = req.transaction(dbDef.dbStore, "readwrite").objectStore(dbDef.dbStore);
                trx.add(data);
                (`[createDB] ${dbDef.dbName}, task finished`)
            }
            objectStore.transaction.onerror = (event)=>{
                resolve(`[createDB] ${dbDef.dbName}, ${event.request.errorCode}`)
            }
            ;
            req.onerror = (e)=>{}
        }
    }
    )
}
