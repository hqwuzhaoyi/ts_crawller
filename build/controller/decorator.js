"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = exports.put = exports.post = exports.get = exports.use = exports.router = void 0;
var express_1 = require("express");
exports.router = express_1.Router();
var Method;
(function (Method) {
    Method["get"] = "get";
    Method["post"] = "post";
    Method["put"] = "put";
    Method["delete"] = "delete";
})(Method || (Method = {}));
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
function use(middleware) {
    return function (target, key) {
        Reflect.defineMetadata("middleware", middleware, target, key);
    };
}
exports.use = use;
// * 方法装饰器 工厂函数
function getRequestDecorator(type) {
    return function (path) {
        return function (target, key) {
            Reflect.defineMetadata("path", path, target, key);
            Reflect.defineMetadata("method", type, target, key);
        };
    };
}
exports.get = getRequestDecorator(Method.get);
exports.post = getRequestDecorator(Method.post);
exports.put = getRequestDecorator(Method.put);
// export const delete = getRequestDecorator(Method.delete);
/**
 * * @target 类的构造函数
 *  */
function controller(target) {
    for (var key in target.prototype) {
        console.log(target.prototype);
        var path = Reflect.getMetadata("path", target.prototype, key); // * 类的target.prototype等于方法的target
        var method = Reflect.getMetadata("method", target.prototype, key);
        var handler = target.prototype[key];
        var middleware = Reflect.getMetadata("middleware", target.prototype, key);
        if (path && method && handler) {
            // console.log(method);
            exports.router[method](path, handler);
            //   router.get(path, handler);
            if (middleware) {
                exports.router[method](path, middleware, handler);
            }
            else {
                exports.router[method](path, handler);
            }
        }
        console.log();
    }
}
exports.controller = controller;
//# sourceMappingURL=decorator.js.map