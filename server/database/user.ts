import crypto from "crypto"
import { prisma } from "../server"

export async function userLogin(user: {
    email: string,
    password: string
}) {
    const sha256 = crypto.createHash("sha256")

    const passwordHash = sha256.update(user.password).digest("hex")

    const loginUser = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    })

    if (!loginUser) return 404
    else if (loginUser.password !== passwordHash) return 401

    return loginUser
}

export async function userVerify(token: string) {
    const user = await prisma.user.findUnique({
        where: {
            token: token
        }
    })

    if (!user) return 404

    return user
}

export async function userCreate(user: {
    password: string,
    email: string

    name: string,
    birthdate: string

    phone: string
}) {
    const sha256 = crypto.createHash("sha256")

    return await prisma.user.create({
        data: {
            password: sha256.update(user.password).digest("hex"),
            email: user.email,

            name: user.name,
            birthdate: user.birthdate,
            phone: user.phone
        }
    })
}


export async function userEdit(data: {
    token: string, 
    
    user: {
        name: string,
        birthdate: string
        phone: string
    }
}) {
    return await prisma.user.update({
        where: {
            token: data.token
        },

        data: {
            name: data.user.name,
            birthdate: data.user.birthdate,
            phone: data.user.phone
        }
    })
}

export async function userJoinPlatoon(data:{
    token: string, 
    inviteCode: string
}) {
    const user = await prisma.user.update({
        where: {
            token: data.token
        },

        data: {
            platoon: {
                connect: {
                    inviteCode: data.inviteCode
                }
            }
        },

        include: {
            platoon: {
                include: {
                    company: true
                }
            }
        }
    })

    if (!user) return 404
    if (!user.platoon) return 404

    await prisma.company.update({
        where: {
            id: user.platoon.companyId
        },

        data: {
            usersHistory: {
                connect: {
                    id: user.id
                }
            }
        }
    })

    return user
}