import cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { Analyzer } from "./crawler";
import moment from "moment";

interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: string;
  data: Course[];
}

interface Content {
  [propName: string]: Course[];
}

export default class DellAnalyzer implements Analyzer {
  private static instance: DellAnalyzer;

  static getInstance() {
    if (!this.instance) {
      return (this.instance = new DellAnalyzer());
    }
    return this.instance;
  }

  private filePath = path.resolve(__dirname, "../../data/course.json");

  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $(".course-item");
    const courseInfos: Course[] = [];
    courseItems.map((index, ele) => {
      const desc = $(ele).find(".course-desc");
      const title = desc.eq(0).text();
      const count = Math.floor(Math.random() * 1000);
      courseInfos.push({
        title,
        count,
      });
    });
    debugger;
    return {
      time: moment().locale("zh-cn").format("YYYY-MM-DD HH:mm:ss"),
      data: courseInfos,
    };
  }

  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      try {
        fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (err) {
        console.log("data是空的", fileContent);
      }
    }
    // console.log(typeof fileContent)
    // console.log((fileContent[1231] = courseInfo.data));
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }

  private constructor() {}
}
