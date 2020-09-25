import "reflect-metadata";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { controller, use, get} from "../decorator";
import { getResponseData } from "../utils/util";
import Crawler from "../utils/crawler";
import Analyzer from "../utils/analyzer";

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  console.log('checkLogin')
  const isLogin = !!(req.session ? req.session.login : false);
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, "请先登录"));
  }
};
const test = (req: Request, res: Response, next: NextFunction): void => {
  console.log('test middleware');
  next()
};

@controller('/asd')
export class CrawlerController {
  @get("/getData")
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const secret = "secretKey";
    const url = `http://www.dell-lee.com/`;
    const analyzer = Analyzer.getInstance();
    new Crawler(url, analyzer);
    res.json(getResponseData(true));
  }
  
  @get("/showData")
  @use(checkLogin)
  @use(test)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, "../../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(getResponseData(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData(false, "数据不存在"));
    }
  }
}
