const hostname = window.location.hostname;

let serverIndex = 0;
let app = '';

if (hostname.includes('alphaapps.aoc')) {
  serverIndex = 0;
  app = 'MaterialRequestBE/api/'
} else if (hostname.includes('aoccol-181x')){
  serverIndex = 1;
  app = 'MaterialRequestBE/api/';
}else if (hostname.includes('aoccol-181sc')){
  serverIndex = 3;
  app = 'MaterialRequestBE/api/';
}else if (hostname.includes('aoccol-181s')){
  serverIndex = 4;
  app = 'MaterialRequestBE/api/';
}
// else if(hostname.includes('localhost'))
// {
//     serverIndex = 2;
//   app = 'api/';
// }
else if(hostname.includes('localhost'))
{
  serverIndex = 4;
  app = 'MaterialRequestBE/api/';
}
else{
    serverIndex = 3;
    app = 'api/';
}

export const AppConfig = {
    serverIndex,
    app
};
