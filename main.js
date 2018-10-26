// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const {ipcMain} = require('electron')
ipcMain.on('createJSON', (event, arg) => {
      console.log('receive params=>'+arg);
      createJson(arg);
});

function createJson(filepath) {
  if(!filepath) {
      alert("Sorry ,You arn't select any directory !" );
      return ;
  }
  //JSON文件
  this.isLoading = true
  const fs = require('fs')
  const path = require('path')
  fs.readdir(filepath, (err, file) => {
    if (err) {
       alert('Failed to Open directory');
       return;
    }

    let dirs = new Array();
    let tempIndex = 0;
    for (let filename of file) {
      const stat = fs.statSync(path.join(filepath, filename))
      if(stat.isDirectory()) {
          //读取每一个目录
          //同步读取文件夹配置
          let data = fs.readFileSync(path.join(filepath,filename,'meta.txt'));
          console.log("文件夹名称："+filename+ "文件夹配置: " + data.toString());
          try {
              let meta = JSON.parse(data);
              let price  = meta.price;
              let dirId  = meta.dirId;
              //构造对象
              var dir = {};
              dir['dirId'] = dirId;
              dir['price'] = price;
              dir['dirname'] = filename;
              let files =  readFilelist(filepath,filename,(tempIndex+1));
              if(files) {
                dir['fiels'] =  files;
                dirs[tempIndex] = dir;
                tempIndex++;
              }
              console.log(JSON.stringify(dirs));

          } catch(err) {
            console.err('parse file meta error '+JSON.stringify(err));
          }
      }
    }
});

 function readFilelist(filepath,filename,index) {
              //循环文件夹的pdf
               fs.readdir(path.join(filepath,filename), (err, filelist) => {
                  if (err) {
                    alert('Failed to Open directory');
                    return;
                  }
                  let fileIndex = 0;
                  let files = new Array();
                  for (let pdfFilename of filelist) {
                    const statPdf =  fs.statSync(path.join(filepath, filename,pdfFilename))
                    if(statPdf.isFile()) {
                      if (path.extname(pdfFilename).toLowerCase() === '.pdf') {
                        var file= {};
                        file['fileid'] =   index+"00"+fileIndex;
                        file['fee'] = false;
                        file['price'] = 0;
                        file['filename'] = pdfFilename;
                        file['pdf'] = encodeURIComponent(pdfFilename);
                        file['icon'] = 'http://test.apm.wang/assets/chusanhuaxue/pdf-icon.jpeg';
                        file['cTime'] = '2018/10/18 8:7:54';
                        file['author'] = 'zxy';
                        file['pages'] = 100;                            
                        files[fileIndex] = file;
                        fileIndex ++;
                      }
                    }
                  }
                 return files;
                  // dirs[tempIndex] = dir;
                  // //读取文件夹下面的pdf列表文件
                  // console.log("文件夹："+JSON.stringify(dirs));
              });
}
}


