import "reflect-metadata";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { controller, get, post, use } from "./decorator";
import { getResponseData } from "../utils/util";
import Crawler from "../utils/crawler";
import Analyzer from "../utils/analyzer";

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, "请先登录"));
  }
};

@controller
class CrawlerController {
  @get("/getData")
  @use(checkLogin)
  getData(req: BodyRequest, res: Response) {
    const secret = "secretKey";
    const url = `http://www.dell-lee.com/`;
    const analyzer = Analyzer.getInstance();
    new Crawler(url, analyzer);
    res.json(getResponseData(true));
  }

  @get("/showData")
  @use(checkLogin)
  showData(req: BodyRequest, res: Response) {
    try {
      const position = path.resolve(__dirname, "../../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(getResponseData(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData(false, "数据不存在"));
    }
  }
}
