/*  Main script */

/* configuration settings */
const host = "desktop-esvk1ts";

//virtual host prefix
const prefix = "ticket";

//username
const UserId = "qlik1";

//App ID
const appId = '9cd8e69f-49e6-423a-86bf-fe5c53257f0c';


// base path of the qlik host - desktop-esvk1ts, virtual host - ticket
const baseqlikpath = "https://" + host + "/" + prefix;

//body
const data = {
  "UserId": UserId
  //,"AppId":"9cd8e69f-49e6-423a-86bf-fe5c53257f0c"
};

//get authentication without redirection
fetch('http://127.0.0.1:8090/ticket', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "no-cors"
        },
        body: JSON.stringify(data)
    })
    .then(response => {

      //console.log('response status ', response.status);
      return response.json();
    })
    .then((data) => {

       // console.log('data', data);

        console.log(data.Ticket);

        let ticket = data.Ticket;

        openImg(ticket,baseqlikpath,appId);

    })
    .catch((error) => {
        document.querySelector('.error').innerHTML = error;
    });

//Get apps
fetch('http://127.0.0.1:8090/apps', {
  method: 'POST',
  headers: {
      "Content-Type": "application/json",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "no-cors"
  },
  body: JSON.stringify(data)
})
.then(response => {

//console.log('response status ', response.status);
return response.json();
})
.then((apps) => {

 console.log('apps', apps);

})
.catch((error) => {
  console.error('apps error', error);
});


//Load image before mashup
function openImg(ticket, baseqlikpath, appId) {

    let im = document.createElement("img");

    im.onload = function () {

        console.log(this.src + ' loaded');

        load_mashup(appId);
  
    }
    im.onerror = function () {
        console.log('img error');

        console.log('Error with user permissions.');
    } // if necessary
    im.src = baseqlikpath + "/resources/img/core/dark_noise_16x16.png?QlikTicket=" + ticket + "&t=" + (new Date()).getTime();

}

//main mashup script
function load_mashup(appId) {

  //Iframe Element
 /*  let iframe = '<iframe src="https://desktop-esvk1ts/ticket/single/?appid=9cd8e69f-49e6-423a-86bf-fe5c53257f0c&sheet=5bf9f897-c454-4df0-8140-8d00c37388ba&opt=ctxmenu,currsel" style="border:none;width:100%;height:100%;"></iframe>';

  const element = document.getElementById('qdt2');
  element.style.height = "800px";
  element.innerHTML = iframe; */

  console.log('appId',appId);

  //Qdt Element
  //const appId = '9cd8e69f-49e6-423a-86bf-fe5c53257f0c';

  const config = {
    host: host,
    secure: true,
    port: 443,
    prefix: prefix,
    appId: appId
  };

  const { qdtCapabilityApp, QdtViz } = window.QdtComponents;
  const element1 = document.getElementById('qdt1');
  const element2 = document.getElementById('qdt2');

  const init = async () => {

    const app = await qdtCapabilityApp(config);
    QdtViz({
      element: element1,
      app,
      options: {
        id: 'CurrentSelections',
        height: 50
      },
    });
    QdtViz({
      element: element2,
      app,
      options: {
        id: '21e2069d-7504-4cc0-9145-fe49ea5ac401',
        height: 400,
      },
      properties: {
        exportData: false,
        exportDataOptions: { format: 'CSV_T', state: 'P' },
        exportImg: false,
        exportImgOptions: { width: 600, height: 400, format: 'JPG' },
        exportPdf: false,
        exportPdfOptions: { documentSize: { width: 300, height: 150 } },
      }
    });

    // getAppObjectList - function for the rendering sheet
    app.getAppObjectList( (reply) => {
      console.log('getAppObjectList',reply);
    });

  }

  init();


} //load_mashup()


/* =====================  */
/*  Rendering sheet code  */
/* =====================  */

 //add sheet to the page
 //getSheet(app, sheet_id);

 //clear all selections on refresh
//app.field().clear();

 //app.getObject('obj','JXRgk');

 /******The getSheet function takes an application guid and sheet object id to loop
 through and render on demand the objects in a selected sheet of an app******/
 /* function getSheet(app, sheet) {

     app.getAppObjectList(function (reply) {
         console.log('reply', reply.qAppObjectList.qItems);
         reply.qAppObjectList.qItems.forEach(function (value) {
             if (value.qInfo.qId === sheet) {
                 //console.log('value.qInfo',value.qInfo); //height:100%
                 var html = '<div class="inner-container">', cols = 0,
                     rows = 0;
                 //console.log('value.qData.cells', value.qData.cells);
                 value.qData.cells.forEach(function (v) {
                     cols = Math.max(cols, v.col + v.colspan);
                     rows = Math.max(rows, v.row + v.rowspan);
                     console.log(cols + ' ' + rows);
                 });
                 value.qData.cells.forEach(function (v) {
                     var style = 'position:absolute;padding:10px;';
                     style += 'left:' + (v.col * 100) / cols + '%;';
                     style += 'top:' + (v.row * 100) / rows + '%;';
                     style += 'width:' + (v.colspan * 100) / cols + '%;';
                     style += 'height:' + (v.rowspan * 100) / rows + '%;';
                     html += '<div class="qvobject" style="' + style + '" data-qid="' + v.name + '"></div>';
                     console.log('style',style);
                 });
                 html += '</div>';
                 $('#content').html(html).find('div').each(function () {
                     //js file edits
                     var qid = $(this).data('qid');
                     if (qid) {
                         app.getObject(this, qid);
                     }
                 });
                 return false;
             }
         });
     });
 } */