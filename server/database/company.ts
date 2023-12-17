import { prisma } from "../server"

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


    console.log(user)

    const companies = await prisma.company.findMany({
        where: {
            platoons: user.admin ? {} : {
                some: {
                    managers: {
                        some: {
                            id: user.id
                        }
                    },

                    users: {
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

    console.log(companies)

    return companies
}