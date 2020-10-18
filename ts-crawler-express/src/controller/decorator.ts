// import { RequestHandler } from "express";
// import router from '../router';
// import "reflect-metadata";

// enum Methods {
//   get = "get",
//   post = "post",
//   put = "put",
//   del = "delete",
// }

/**
 * * @path 传来的参数，内部是方法装饰器
 * * @target 对应的是类的prototype
 * * @key 方法名
 *  */
// export function get(path: string) {
//   return function (target: any, key: string) {
//     Reflect.defineMetadata("path", path, target, key);
//     Reflect.defineMetadata("method", Method.get, target, key);
//   };
// }

/**
 * * @path 传来的参数，内部是方法装饰器
 * * @target 对应的是类的prototype
 * * @key 方法名
 *  */
// export function post(path: string) {
//   return function (target: any, key: string) {
//     Reflect.defineMetadata("path", path, target, key);
//     Reflect.defineMetadata("method", Method.post, target, key);
//   };
// }



