//     ___         __              __       ____                  __
//    /   | ____ _/ /______ ______/ /_     / __ \____ _____  ____/ /__  __  __
//   / /| |/ __ `/ //_/ __ `/ ___/ __ \   / /_/ / __ `/ __ \/ __  / _ \/ / / /
//  / ___ / /_/ / ,< / /_/ (__  ) / / /  / ____/ /_/ / / / / /_/ /  __/ /_/ /
// /_/  |_\__,_/_/|_|\__,_/____/_/ /_/  /_/    \__,_/_/ /_/\__,_/\___/\__, /
//                                                                   /____/
//                           [ SKYROUTES 1.2 ]
//       
//     All Rights Reserved - https://github.com/AakashPandey/skyroutes


const chng="yo", vn="pre-a1";
var appCash=["/index.html"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(vn).then(e=>e.addAll(appCash)))}),self.addEventListener("message",e=>{"skipWaiting"===e.data.action?self.skipWaiting():"clearOld"===e.data.action&&e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{if(!vn.includes(e))return caches.delete(e)}))).then(()=>{console.log("old caches are cleared now")}))}),self.addEventListener("fetch",e=>{const a=new URL(e.request.url);"navigate"!==e.request.mode||a.origin!==location.origin||a.pathname.includes(".")?appCash.includes(a.pathname)?e.respondWith(caches.match(a)):e.respondWith(fetch(a)):e.respondWith(pauseReq(a))});var readDB=(e,a,t)=>new Promise((t,s)=>{req=indexedDB.open(e.dbName,e.dbVer),req.onsuccess=(n=>{req=n.target.result;var r=req.transaction([e.dbStore]).objectStore(e.dbStore);(r=r.get(a)).onsuccess=(e=>{routesSW=e.target.result,t()}),r.onerror=(e=>{s(e)})})}),routesSW=0;self.addEventListener("message",e=>{"skipWaiting"===e.data.action?self.skipWaiting():"clearOld"===e.data.action?e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{if(!vn.includes(e))return caches.delete(e)}))).then(()=>{console.log("[App Updated]")})):"rescanPath"===e.data.action&&(console.log("rebuilding paths"),dbScan())});var dbScan=()=>new Promise(e=>{readDB(dbDef,1).then(a=>{e()})}),pauseReq=async e=>(0===routesSW&&await dbScan(),routesSW[e.pathname.slice(1)]?caches.match("/index.html"):fetch(e)),dbDef={dbName:"SkyRoutes",dbVer:1,dbStore:"routes"};
