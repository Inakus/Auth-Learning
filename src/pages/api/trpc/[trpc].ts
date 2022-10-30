import * as trpcNext from "@trpc/server/adapters/next"

import { userRouter } from "../../../server/routers/auth"
import { createContext } from "../../../server/context"

export default trpcNext.createNextApiHandler({
    router: userRouter,
    createContext
})