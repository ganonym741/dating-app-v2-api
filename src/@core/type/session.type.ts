import type { ObjectId } from "typeorm";

import type { MEMBERSHIP } from "@model/user.entity";

export interface UserTokenRaw {
    _id?: ObjectId;
    membership?: MEMBERSHIP;
    iat?: number;
    exp?: number;
  }
  
  export interface UserSession {
    _id?: ObjectId;
    membership?: MEMBERSHIP;
    login_at?: Date;
    iat?: number;
  }