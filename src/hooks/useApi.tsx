import { PrismaClient } from '@prisma/client'
import { create } from 'ionicons/icons'
const prisma = new PrismaClient()
export const useApi = () => {

    const createUser = async (data: {email: string, username: string}) => {
        try {
            const test = await prisma.users.create({
                data: {
                    email: data.email,
                    username: data.username
                }
            })
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }
    return createUser
}