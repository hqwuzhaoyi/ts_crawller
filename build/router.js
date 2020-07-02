"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var crowller_1 = __importDefault(require("./crowller"));
var dellAnalyzer_1 = __importDefault(require("./dellAnalyzer"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var router = express_1.Router();
var analyzer = dellAnalyzer_1.default.getIntance();
router.get("/", function (req, res) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.send("\n      <html>\n          <body>\n            <a href=\"/getData\" >\u722C\u53D6\u5185\u5BB9</a>\n            <a href=\"/showData\" >\u5C55\u793A\u5185\u5BB9</a>\n            <a href=\"/logout\" >\u9000\u51FA</a>\n          </body>\n      </html>\n    ");
    }
    else {
        res.send("\n      <html>\n          <body>\n              <form method=\"post\" action=\"/login\">\n                  <input type=\"password\" name=\"password\" />\n                  <button>\u63D0\u4EA4</button>\n              </form>\n          </body>\n      </html>\n    ");
    }
});
router.get("/showData", function (req, res) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        try {
            var position = path_1.default.resolve(__dirname, "../data/course.json");
            var result = fs_1.default.readFileSync(position, "utf-8");
            res.json(JSON.parse(result));
        }
        catch (e) {
            res.send("尚未爬取到内容");
        }
    }
    else {
        res.send("请登陆后查看内容");
        res.send("<a href='/'>返回</a>");
    }
});
router.get("/getData", function (req, res) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        var secret = "secretKey";
        var url = "http://www.dell-lee.com/";
        var analyzer_1 = dellAnalyzer_1.default.getIntance();
        new crowller_1.default(url, analyzer_1);
        res.send("getData Success!");
        res.send("<a href='/'>返回</a>");
    }
    else {
        res.send("请登陆后爬取内容");
        res.send("<a href='/'>返回</a>");
    }
});
router.post("/login", function (req, res) {
    var password = req.body.password;
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.send("已经登陆过");
    }
    else {
        if (password === "123" && req.session) {
            req.session.login = true;
            res.send("登陆成功");
        }
        else {
            res.send("登录失败 ");
        }
    }
});
router.get("/logout", function (req, res) {
    if (req.session) {
        req.session.login = undefined;
    }
    res.redirect("/");
});
exports.default = router;
//# sourceMappingURL=router.js.map