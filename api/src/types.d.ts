// import { Request } from "express";

// declare module "express-serve-static-core" {
//   interface Request {
//     user?: {
//       userId: any;
//       username: any;
//     };
//   }
// }
declare namespace Express {
  export interface Request {
    user: any;
  }
  export interface Response {
    user: any;
  }
}
