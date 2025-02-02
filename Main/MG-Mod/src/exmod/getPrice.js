const axios = require('axios');
const fs = require("fs");
const path = require("path");
const githubInfo = require("../../res/price/github.json");

class getPrice{
    getPriceFun(mod,callback){
        const githubInfo = require("../../res/price/github.json");
        const token = githubInfo.token;
        const owner = githubInfo.owner;
        const repo = githubInfo.repo;
        const filePath = githubInfo.filePath; // 文件在仓库中的路径
        // GitHub API 请求
        fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3.raw' // 直接获取文件内容（非Base64）
            }
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.text();
            })
            .then(priceText => {
                const priceJson = JSON.parse(priceText);
                const filePath = path.join(__dirname, "../../res/price/price.json");
                fs.writeFile(filePath, priceText, (err) => {
                    if (err) {
                        console.error("price.json保存出现错误:", err);
                        callback("001"+err);
                    } else {
                        callback(`${mod.modname}:实时跳蚤数据已更新至 ${priceJson.date[0]}年 ${priceJson.date[1]}月 ${priceJson.date[2]}日。请自主选择是否重启服务端！`);
                    }
                });
            })
            .catch(error => {
                console.error('错误:', error);
            });
    }

    getDate(){
        const currentDate = new Date();
        const Year = currentDate.getFullYear();
        const Month = currentDate.getMonth() + 1;
        const Day = currentDate.getDate();
        return [Year,Month,Day];
    }

}
module.exports = new getPrice()