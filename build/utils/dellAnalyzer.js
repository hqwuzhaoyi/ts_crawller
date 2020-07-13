"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var DellAnalyzer = /** @class */ (function () {
    function DellAnalyzer() {
        this.filePath = path_1.default.resolve(__dirname, "../data/course.json");
    }
    DellAnalyzer.getIntance = function () {
        if (!this.instance) {
            return this.instance = new DellAnalyzer();
        }
        return this.instance;
    };
    DellAnalyzer.prototype.getCourseInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var courseItems = $(".course-item");
        var courseInfos = [];
        courseItems.map(function (index, ele) {
            var desc = $(ele).find(".course-desc");
            var title = desc.eq(0).text();
            var count = index;
            courseInfos.push({
                title: title,
                count: count,
            });
        });
        debugger;
        return {
            time: new Date().getTime(),
            data: courseInfos,
        };
    };
    DellAnalyzer.prototype.generateJsonContent = function (courseInfo, filePath) {
        var fileContent = {};
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
        }
        // console.log(typeof fileContent)
        // console.log((fileContent[1231] = courseInfo.data));
        fileContent[courseInfo.time] = courseInfo.data;
        return fileContent;
    };
    DellAnalyzer.prototype.analyze = function (html, filePath) {
        var courseInfo = this.getCourseInfo(html);
        var fileContent = this.generateJsonContent(courseInfo, filePath);
        console.log(fileContent);
        return JSON.stringify(fileContent);
    };
    return DellAnalyzer;
}());
exports.default = DellAnalyzer;
//# sourceMappingURL=dellAnalyzer.js.map