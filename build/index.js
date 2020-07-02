"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var router_1 = __importDefault(require("./router"));
// 问题1: express 库的类型定义文件 .d.ts 文件类型描述不准确
// 问题2: 当使用中间件的时候,对req或者res做了修改之后,实际上类型并不能改变
var app = express_1.default();
app.use(cookie_session_1.default({
    name: "session",
    keys: ["teacher dell"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000,
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    req.teacherName = "dell";
    next();
});
app.use(router_1.default);
var port = 7008;
app.listen(port, function () {
    console.log("server is running at http://localhost:" + port);
});
//# sourceMappingURL=index.js.map