import cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { Analyzer } from "./crowller";

interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number;
  data: Course[];
}

interface Content {
  [propName: number]: Course[];
}

export default class DellAnalyzer implements Analyzer {
  private static instance: DellAnalyzer;

  static getIntance() {
      if(!this.instance) {
          return this.instance = new DellAnalyzer();
      }
      return this.instance
  }

  private filePath = path.resolve(__dirname, "../data/course.json");

  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $(".course-item");
    const courseInfos: Course[] = [];
    courseItems.map((index, ele) => {
      const desc = $(ele).find(".course-desc");
      const title = desc.eq(0).text();
      const count = index;
      courseInfos.push({
        title,
        count,
      });
    });
    debugger;
    return {
      time: new Date().getTime(),
      data: courseInfos,
    };
  }

  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    // console.log(typeof fileContent)
    // console.log((fileContent[1231] = courseInfo.data));
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo, filePath);
    console.log(fileContent);
    return JSON.stringify(fileContent);
  }

  private constructor() {}
}
