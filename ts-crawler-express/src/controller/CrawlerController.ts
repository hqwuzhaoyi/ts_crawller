import "reflect-metadata";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { controller, use, get} from "../decorator";
import { getResponseData } from "../utils/util";
import Crawler from "../utils/crawler";
import Analyzer from "../utils/analyzer";

interface CourseItem {
  title: string;
  count: number;
}

interface DataStructure {
  [key: string]: CourseItem[];
}

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

@controller('/api')
export class CrawlerController {
  @get("/getData")
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const secret = "secretKey";
    const url = `http://www.dell-lee.com/`;
    const analyzer = Analyzer.getInstance();
    console.log(123)
    new Crawler(url, analyzer);
    res.json(getResponseData<responseResult.getData>(true));
  }
  
  @get("/showData")
  @use(checkLogin)
  // @use(test)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, "../../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(getResponseData<responseResult.showData>(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData<responseResult.showData>(false, "数据不存在"));
    }
  }
}
