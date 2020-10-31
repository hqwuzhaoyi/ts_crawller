import router from "../router";
import { RequestHandler } from "express";
import { Methods } from "./request";

/**
 * * @target 类的构造函数
 *  */
export function controller(root: string) {
  // * 构造函数推断
  return function (target: new (...args: any[]) => any) {
    for (let key in target.prototype) {
    //   console.log(target.prototype);
      const path: string = Reflect.getMetadata("path", target.prototype, key); // * 类的target.prototype等于方法的target
      const method: Methods = Reflect.getMetadata(
        "method",
        target.prototype,
        key
      );
      const handler: RequestHandler = target.prototype[key];
      const middlewares: RequestHandler[] = Reflect.getMetadata(
        "middlewares",
        target.prototype,
        key
      );
      if (path && method) {
        const fullPath = root === "/" ? path : `${root}${path}`;
        router[method](path, handler);
        if (middlewares) {
            router[method](fullPath, ...middlewares, handler);
        } else {
          router[method](fullPath, handler);
        }
      }
    }
  };
}
