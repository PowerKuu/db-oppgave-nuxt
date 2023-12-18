import { Platoon } from "@prisma/client"
import { prisma } from "../server"
import crypto from "crypto"

export async function platoonCreate(data: {
    token: string, 
    companyID: number, 
        
    platoon: {
        name: string
    
        managers: string[]
        users: string[]
    }
}) {
    const user = await prisma.user.findUnique({
        where: {
            token: data.token,
            admin: true
        }
    })

    if (!user) return 401


    const platoon = await prisma.platoon.create({
        data: {
            name: data.platoon.name,
            companyId: data.companyID,

            users: {
                connect: data.platoon.users.map(email => ({ email: email }))
            },

            managers: {
                connect: data.platoon.managers.map(email => ({ email: email }))
            },
        }
    })

    return platoon
}


export async function platoonEdit(data: {
    token: string, 
    platoonID: number, 
    platoon: {
        name: string
    
        managers: string[]
        users: string[]
    }
}) {
    const user = await prisma.user.findUnique({
        where: {
            token: data.token,

            OR: [
                {
                    admin: true
                },
                {
                    managingPlatoons: {
                        some: {
                            id: data.platoonID
                        }
                    }
                }
            ]
        }
    })

    if (!user) return 401

    const company = await prisma.company.findMany({
        where: {
            platoons: {
                some: {
                    id: data.platoonID
                }
            },

            usersHistory: {
                some: {
                    email: {
                        in: data.platoon.managers.concat(data.platoon.users)
                    }
                }
            }
        }
    })

    if (!company) return 404

    const platoon = await prisma.platoon.update({
        where: {
            id: data.platoonID
        },
        data: {
            name: data.platoon.name,

            managers: {
                set: data.platoon.managers.map(email => ({ email: email }))
            },
            
            users: {
                set: data.platoon.users.map(email => ({ email: email }))
            }
        }
    })

    return platoon
}

export async function platoonDelete(data: {
    token: string, 
    platoonID: number
}) {
    const user = await prisma.user.findUnique({
        where: {
            token: data.token,
            admin: true
        }
    })

    if (!user) return 401

    const platoon = await prisma.platoon.delete({
        where: {
            id: data.platoonID
        }
    })

    return platoon
}

export async function platoonRegenerateInvite(data: {
    token: string, 
    platoonID: number
}) {
    const user = await prisma.user.findUnique({
        where: {
            token: data.token,
            OR: [
                {
                    admin: true
                },
                {
                    managingPlatoons: {
                        some: {
                            id: data.platoonID
                        }
                    }
                }
            ]
        }
    })

    if (!user) return 401

    const platoon = await prisma.platoon.update({
        where: {
            id: data.platoonID
        },
        data: {
            inviteCode: crypto.randomUUID()
        }
    })

    return platoon
}

export async function platoonGetCensored(data: {
    token: string, 
    platoonID: number
}) {
    const user = await prisma.user.findUnique({
        where: {
            token: data.token,
            OR: [
                {
                    admin: true
                },
                {
                    platoonId: data.platoonID
                },
                {
                    managingPlatoons: {
                        some: {
                            id: data.platoonID
                        }
                    }
                }
            ]
        }
    })

    if (!user) return 401

    const platoon = await prisma.platoon.findUnique({
        where: {
            id: data.platoonID
        },

        include: {
            company: true,
            
            managers: {
                select: {
                    email: true,
                    name: true,
                    birthdate: true
                }
            },
            users: {
                select: {
                    email: true,
                    name: true,
                    birthdate: true
                }
            }
        }
    })

    if (!platoon) return 404

    platoon.inviteCode = ""

    return platoon
}

export async function platoonsGetMangingOnCompany(data: {
    token: string, 
    companyID: number
}) {
    const user = await prisma.user.findUnique({
        where: {
            token: data.token        
        }
    })

    if (!user) return 401

    const platoons = await prisma.platoon.findMany({
        where: {
            companyId: data.companyID,
            managers: user.admin ? undefined : {
                some: {
                    id: user.id
                }
            }
        },

        include: {
            users: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    birthdate: true
                }
            },

            managers: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    birthdate: true
                }
            },
        }
    })

    return platoons
}

export async function platoonGetAvailible(data: {
    token: string
}) {
    const user = await prisma.user.findUnique({
        where: {
            token: data.token
        },

        include: {
            managingPlatoons: true
        }
    })

    if (!user) return 401

    if (user.platoonId) return user.platoonId

    const firstPlatoon = user.managingPlatoons[0]
    
    if (!firstPlatoon) return 404

    return firstPlatoon.id
}   