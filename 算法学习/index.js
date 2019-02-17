const {execSync} = require('child_process');
const qiniu = require('qiniu');
const { accessKey, secretKey, Zone} = require('./cfg/cfg.js');
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

//上传成功回调
const returnBody = JSON.stringify({
    key: "$(key)",
    hash: "$(etag)",
    bucket: "$(bucket)",
    fsize: "$(fsize)",
    fname: "$(fname)",
    uuid: "$(uuid)",
    date: "$(year)年$(mon)月$(day)日",
    time: "$(hour):$(min):$(sec)",
})



//上传凭证配置
const getTokenOptions = (bucket,saveKey)=>{
    return {
        scope: bucket + ':' + saveKey,      //空间名
        saveKey,            //文件名
        expires: 7200,      //超时时间 s
        deadline: (new Date()).valueOf() / 1000 + 3600,
        returnBody,
    }
}
/**
 * 
 * @param {*} bucket 空间名称
 * @param {*} saveKey 保存名字
 * @param {*} localFile 本地文件(绝对路径)
 * @param {*} zone 机房区域 HUANAN HUADONG HUABEI BEIMEI
 * @returns {Promise} 
 */
function uploadFile(bucket,saveKey,localFile,zone){
    const config = new qiniu.conf.Config();
    config.zone = Zone[zone];
    const uploadToken = (new qiniu.rs.PutPolicy(getTokenOptions(bucket,saveKey))).uploadToken(mac);
    var resumeUploader = new qiniu.resume_up.ResumeUploader(config);
    var putExtra = new qiniu.resume_up.PutExtra();
    return new Promise((resolve,reject)=>{
        
        // 如果指定了断点记录文件，那么下次会从指定的该文件尝试读取上次上传的进度，以实现断点续传
        putExtra.resumeRecordFile = localFile + '.log';

        // 文件分片上传
        resumeUploader.putFile(uploadToken, saveKey, localFile, putExtra, function(respErr,respBody, respInfo) {
            if (respErr) {
                reject(respErr);
            }
            if (respInfo.statusCode == 200) {
                execSync('rm ' + localFile + '.log');
                resolve(respBody);
                
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
            }
        });
    })
}
function downloadFile(){

}
exports.uploadFile = uploadFile;
exports.downloadFile = downloadFile;

