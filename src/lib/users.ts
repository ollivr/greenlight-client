import {storage, USER}           from "~/lib/store";
import {action, query, redirect} from "@solidjs/router";

export const getStorageUsers = query(async () => {
    "use server";
    console.log("getStorageUsers was called")
    return ((await storage.getItem("users:data")) as USER[]).reverse();
}, "users")

export const getStorageUser = query(async (id: number) => {
    "use server";
    console.log("getStorageUser was called")
    return ((await storage.getItem("users:data")) as USER[]).find(
        user => user.id === id
    );
}, "user")

export type userInput = Pick<USER, "firstName" | "lastName" | "age">

export const addStorageUser = action(async (data: FormData) => {
    "use server";
    
    const userInput = {
        firstName: String(data.get("firstName")),
        lastName: String(data.get("lastName")),
        age: Number(data.get("age")),
    }
    
    let [{value: users}, {value: index}] = await storage.getItems([
        "users:data",
        "users:counter"
    ])

    let user;
    await Promise.all([
        storage.setItem("users:data", [
            ...(users as USER[]),
            (user = {
                ...userInput,
                id: index as number,
            }),
            storage.setItem("users:counter", (index as number) + 1)
        ])
    ])
    throw redirect("/")
})

const redirectTo = (path?: string) => {
    let urlPath = `/${path ?? ``}`
    throw redirect(urlPath) 
}

export const registerUserHandler = action(async (data: FormData) => {
    "use server";

    const userInput = {
        name: String(data.get("firstName")) + " " + String(data.get("lastName")),
        email: String(data.get("email")),
        password: String(data.get("password")),
    }

    const response = await fetch(`http://localhost:${import.meta.env.VITE_SERVER_PORT}/${import.meta.env.VITE_API_VERSION}/users`, {
        method: "POST",
        headers: {},
        body: JSON.stringify(userInput)
    })
    const res: any = await response.json();
    console.log(res);

    if (!res?.error) {
        redirectTo()    
    }
    return res;
})


export const loginUserHandler = action(async (data: FormData) => {
    "use server";

    const userInput = {
        email: String(data.get("email")),
        password: String(data.get("password")),
    }

    const response = await fetch(`http://localhost:${import.meta.env.VITE_SERVER_PORT}/${import.meta.env.VITE_API_VERSION}/tokens/authentication`, {
        method: "POST",
        headers: {},
        body: JSON.stringify(userInput)
    })
    const res: any = await response.json();
    console.log(res);

    if (!res?.error) {
        redirectTo()
    }
    return res;
})