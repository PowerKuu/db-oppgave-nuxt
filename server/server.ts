import { PrismaClient } from "@prisma/client"

import * as company_ from "./database/company"
import * as platoon_ from "./database/platoon"
import * as user_ from "./database/user"

export const prisma = new PrismaClient()

export const functions = { ...company_, ...platoon_, ...user_  }

export type Functions = typeof functions
export type FunctionNames = keyof Functions
