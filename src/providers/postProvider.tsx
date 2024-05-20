import { createContext, useState, ReactNode, useEffect } from 'react';
import { post } from '../utils/fetch';

interface Post {
    email: string;
    content: string
    likes: string[]
    id: string
}

interface PostContext {
    posts: Post[];
    myPosts: Post[];
    setPosts: (post: Post[]) => void
    setMyPosts: (post: Post[]) => void
    updatePost: (post: Post) => void
    deletePost: (id: string) => void
    createPost: (value: string) => void

}

// const MyContext = createContext({ values: [], setValues: (posts) => { } });
const MyContext = createContext<PostContext>({ posts: [], myPosts: [], setPosts: (posts) => { }, setMyPosts: (posts) => { }, updatePost: (post) => { }, deletePost: (id) => { }, createPost: (value, email) => { } });

const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [content, setContent] = useState<{ id: string, content: string, likes: string[], email: string }[]>([]);
    let realContent = content
    const [myPosts, setMyPosts] = useState<{ id: string, content: string, likes: string[], email: string }[]>([]);


    useEffect(() => {
        getAllPosts()
    }, [myPosts])


    useEffect(() => {
        getMyPosts()
    }, [])


    const getAllPosts = async () => {
        try {
            const result = await fetch(`http://localhost:3000/api/getPosts`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            // console.log(await result.json(), 'this is the result')
            const posts = await result.json()
            setContent(posts.Posts)
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }



    const updatePost = async ({ id, likes, content, email }: Post) => {
        console.log(likes, 'these are the likes I need')
        const updatedPost = await post({
            url: `http://localhost:3000/api/addLike?id=${id}`, body: {
                likes: likes,
                content: content
            }
        })
        getMyPosts()
        setContent(realContent.map((post) => post.id === updatedPost.update.id ? updatedPost.update : post))
    }
    const deletePost = async (id: string) => {
        const updatedPost = await post({
            url: `http://localhost:3000/api/updatePosts?id=${id}`, body: {
                content: content
            }
        })
        getMyPosts()
        setContent(realContent.map((post) => post.id === updatedPost.update.id ? updatedPost.update : post))
    }

    const getMyPosts = async () => {
        try {
            const result = await fetch(`http://localhost:3000/api/getMyPosts?email=${localStorage.getItem('user')}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const posts = await result.json()
            setMyPosts(posts.Posts)
            getAllPosts()
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }

    const createPost = async (value: string) => {
        try {
            const test = await fetch('http://localhost:3000/api/createPost', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: value,
                    email: localStorage.getItem('user') || ''
                })
            })
            getAllPosts()
            getMyPosts()
        } catch (error) {
            console.log(error, "this is the create user error")
        }
    }


    console.log(content, 'this is the content i need')
    return (
        <MyContext.Provider value={{ posts: content, myPosts: myPosts, setPosts: setContent, setMyPosts: setMyPosts, updatePost: updatePost, deletePost, createPost }}>
            {children}
        </MyContext.Provider>
    );
};

export { ContextProvider, MyContext };