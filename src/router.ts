import { Router, Request, Response } from "express";
import Crowller from "./crowller";
import DellAnalyzer from "./dellAnalyzer";
import fs from "fs";
import path from "path";

const router = Router();
const analyzer = DellAnalyzer.getIntance();

// 问题1: express 库的类型定义文件 .d.ts 文件类型描述不准确
interface ReqWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

router.get("/", (req: Request, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(`
      <html>
          <body>
            <a href="/getData" >爬取内容</a>
            <a href="/showData" >展示内容</a>
            <a href="/logout" >退出</a>
          </body>
      </html>
    `);
  } else {
    res.send(`
      <html>
          <body>
              <form method="post" action="/login">
                  <input type="password" name="password" />
                  <button>提交</button>
              </form>
          </body>
      </html>
    `);
  }
});
router.get("/showData", (req: ReqWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    try {
      const position = path.resolve(__dirname, "../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(JSON.parse(result));
    } catch (e) {
      res.send("尚未爬取到内容");
    }
  } else {
    res.send("请登陆后查看内容");
    res.send("<a href='/'>返回</a>");
  }
});
router.get("/getData", (req: ReqWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    const secret = "secretKey";
    const url = `http://www.dell-lee.com/`;
    const analyzer = DellAnalyzer.getIntance();
    new Crowller(url, analyzer);
    res.send("getData Success!");
    res.send("<a href='/'>返回</a>");
  } else {
    res.send("请登陆后爬取内容");
    res.send("<a href='/'>返回</a>");
  }
});
router.post("/login", (req: ReqWithBody, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : false;

  if (isLogin) {
    res.send("已经登陆过");
  } else {
    if (password === "123" && req.session) {
      req.session.login = true;
      res.send("登陆成功");
    } else {
      res.send("登录失败 ");
    }
  }
});
router.get("/logout", (req: ReqWithBody, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.redirect("/");
});

export default router;
