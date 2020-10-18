import "reflect-metadata";
import { CrawlerController, LoginController } from "../controller";

export enum Methods {
  get = "get",
  post = "post",
  put = "put",
  del = "delete",
}

// * 方法装饰器 工厂函数

function getRequestDecorator(type: Methods) {
  return function (path: string) {
    /**
     * * @ target 联合类型
     */
    return function (target: CrawlerController | LoginController, key: string) {
      Reflect.defineMetadata("path", path, target, key);
      Reflect.defineMetadata("method", type, target, key);
    };
  };
}

export const get = getRequestDecorator(Methods.get);
export const post = getRequestDecorator(Methods.post);
export const put = getRequestDecorator(Methods.put);
export const del = getRequestDecorator(Methods.del);
