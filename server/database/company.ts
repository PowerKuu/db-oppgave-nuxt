import { prisma } from "../server"

export async function companyGet(data: {token: string, companyID: number}) {
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
                            companyId: data.companyID
                        }
                    }
                }
            ]
        }
    })

    if (!user) return 401

    const company = await prisma.company.findUnique({
        where: {
            id: data.companyID
        },

        include: {
            usersHistory: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    birthdate: true
                }
            }
        }
    })

    if (!company) return 404

    return company
}

export async function companyCreate(data: {
    token: string, 
    company: {
        name: string
    }
}) {
    const user = await prisma.user.findUnique({
        where: {
            token: data.token,
            admin: true
        }
    })

    if (!user) return 401

    const company = await prisma.company.create({
        data: {
            name: data.company.name
        }
    })

    return company
}

export async function companyEdit(data: {
    token: string, 
    companyID: number, 
    company: {
        name: string
    }
}) {
    const user = await prisma.user.findUnique({
        where: {
            token: data.token,
            admin: true
        }
    })

    if (!user) return 401

    const company = await prisma.company.update({
        where: {
            id: data.companyID
        },
        data: {
            name: data.company.name
        }
    })

    return company
}

export async function companyDelete(data: {
    token: string, 
    companyID: number
}) {
    const user = await prisma.user.findUnique({
        where: {
            token: data.token,
            admin: true
        }
    })

    if (!user) return 401

    const company = await prisma.company.delete({
        where: {
            id: data.companyID
        }
    })

    return company
}

export async function companiesGetManaging(data: {token: string}) {
    const user = await prisma.user.findUnique({
        where: {
            token: data.token
        }
    })

    if (!user) return 401

    const companies = await prisma.company.findMany({
        where: {
            platoons: user.admin ? {} : {
                some: {
                    managers: {
                        some: {
                            id: user.id
                        }
                    }
                }
            }
        },

        include: {
            platoons: true
        }
    })

    return companies
}