import { createReactQueryHooks } from "@trpc/react"

import type { AuthRouter } from "../../server/routers/auth"

export const trpc = createReactQueryHooks<AuthRouter>()