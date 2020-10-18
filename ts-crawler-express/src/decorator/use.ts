import { RequestHandler } from "express";
import "reflect-metadata";
import { CrawlerController, LoginController } from "../controller";

export function use(middleware: RequestHandler) {
  return function (target: CrawlerController | LoginController, key: string) {
    // * 使用多个中间件
    const originMiddlewares =  Reflect.getMetadata("middlewares", target, key) || [];
    originMiddlewares.push(middleware);
    Reflect.defineMetadata("middlewares", originMiddlewares, target, key);
  };
}
