var hashSum = require("hash-sum");
module.exports = function genId(filePath){
	return hashSum(filePath);
};