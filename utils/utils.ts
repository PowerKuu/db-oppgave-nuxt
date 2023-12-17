import type { FunctionNames, Functions } from "@/server/server"

export type ServerFunctionResult<T extends FunctionNames> = Awaited<ReturnType<Functions[T]>> | number
export type NoServerFunctionErrors<T> = T extends number ? never : T

export async function serverFunction<T extends FunctionNames>(operation: T, data: Parameters<Functions[T]>[0]): Promise<ServerFunctionResult<T>> {
    const returned = await fetch(`/api/function/${operation as string}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(data)
    })

    if (!returned.ok) {
        return returned.status as ServerFunctionResult<T>
    }

    const returnedData = await returned?.json()

    return returnedData as ServerFunctionResult<T>
}

export function isServerError<T>(data: T | number): data is number {
    return typeof data === "number"
}

const recomputer = ref(0)

export function useJsonStorage<T>(key: string, defaultValue: T) {
    console.log(key, defaultValue)

    const newListener = computed<T>({
        get() {
            // Recompute when recomputer changes
            recomputer.value


            const data = localStorage.getItem(key)

            if (!data) {
                localStorage.setItem(key, JSON.stringify(defaultValue))

                return defaultValue
            }

            return JSON.parse(data) as T
        },
        
        set(value: T) {
            localStorage.setItem(key, JSON.stringify(value))

            recomputer.value++
        }
    })


    return newListener
}

export async function logout() {
    useJsonStorage("user", null).value = null

    console.log("logout")

    await navigateTo("/login")
}