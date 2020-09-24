import { RequestHandler, Router } from "express";

export const router = Router();

enum Method {
  get = "get",
  post = "post",
  put = "put",
  delete = "delete",
}

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

export function use(middleware: RequestHandler) {
  return function (target: any, key: string ) {
    Reflect.defineMetadata("middleware", middleware, target, key);
  }
}

// * 方法装饰器 工厂函数
function getRequestDecorator(type: string) {
  return function (path: string) {
    return function (target: any, key: string) {
      Reflect.defineMetadata("path", path, target, key);
      Reflect.defineMetadata("method", type, target, key);
    };
  };
}

export const get = getRequestDecorator(Method.get);
export const post = getRequestDecorator(Method.post);
export const put = getRequestDecorator(Method.put);
// export const delete = getRequestDecorator(Method.delete);

/**
 * * @target 类的构造函数
 *  */
export function controller(target: any) {
  for (let key in target.prototype) {
    console.log(target.prototype);
    const path = Reflect.getMetadata("path", target.prototype, key); // * 类的target.prototype等于方法的target
    const method: Method = Reflect.getMetadata("method", target.prototype, key);
    const handler = target.prototype[key];
    const middleware = Reflect.getMetadata("middleware", target.prototype, key);
    if (path && method && handler) {
      // console.log(method);
      router[method](path, handler);
      //   router.get(path, handler);
      if (middleware) {
        router[method](path, middleware, handler);
      } else {
        router[method](path, handler);
      }
    }
    console.log();
  }
}
