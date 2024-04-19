import { create } from 'ionicons/icons'
export const useApi = () => {

    const createUser = async (email: string, username: string) => {
        try {
            const test = await fetch('http://localhost:3000/api/createUser', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    username
                })
            })
            console.log(test)
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }
    return {createUser}
}