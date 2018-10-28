var fs = require("fs");
module.exports = {
    writefile : function(path,data,recall){ //异步
        fs.writeFile(path,data,function(err){
            if(err){
                throw err;
            }
            console.log('saved!');
            recall('写文件成功');
        });
        console.log("异步写文件完成");
    },

    writeFileSync : function(path,data){    //同步
        fs.writeFileSync(path,data);
        console.log("同步写文件完成");
    }
}

