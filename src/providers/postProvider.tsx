import { createContext, useState, ReactNode } from 'react';

interface Post {
    email: string;
    content: string
}

interface PostContext {
    values: Post[];
    setValues: (posts: Post[]) => void    
}

const MyContext = createContext<PostContext>({ values: [], setValues: (posts) => { } });

const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [posts, setPosts] = useState<Post[]>([])
    const [toggle, setToggle] = useState<boolean>(true)
    return (
        <MyContext.Provider value={{ values: posts, setValues: setPosts }}>
            {children}
        </MyContext.Provider>
    );
};

export { ContextProvider, MyContext };