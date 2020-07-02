import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import router from "./router";

// 问题1: express 库的类型定义文件 .d.ts 文件类型描述不准确
// 问题2: 当使用中间件的时候,对req或者res做了修改之后,实际上类型并不能改变

const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["teacher dell"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use((req: Request, res: Response, next: NextFunction) => {
  req.teacherName = "dell";
  next();
});
app.use(router);

const port = 7008;

app.listen(port, () => {
  console.log("server is running at http://localhost:" + port);
});
