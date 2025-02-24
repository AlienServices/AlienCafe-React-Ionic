import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { UserContext } from "./userProvider";
import { MyContext } from "./postProvider";

interface Post {
  email: string;
  content: string;
  likes: string[];
  id: string;
  date: Date;
}

interface PostContext {
}

const bookmarkContext = createContext<PostContext>({
});

const ContextProvider = ({ children }: { children: ReactNode }) => {

  const { getBaseUrl } = useContext(MyContext)
  const { myInfo, setMyInfo } = useContext(UserContext);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    if(myInfo) {
      getAllBookmarks(myInfo.id)
    }
  }, [])


  const addBookmark = async (userId: string, postId: string) => {
    try {
      const result = await fetch(`${getBaseUrl()}/api/posts/addBookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          postId,
        }),
      });
      const posts = await result.json();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };


  const getAllBookmarks = async (userId: string) => {
    try {
      // 1️⃣ Fetch Bookmarked Post IDs First
      const response = await fetch(`${getBaseUrl()}/api/posts/getBookmark?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookmarks: ${response.status} ${response.statusText}`);
      }

      const bookmarkedIds = await response.json();      
      const allBookmarks = [];
      const bookmarkDetails = await Promise.all(
        bookmarkedIds.bookmarks?.map(async (post: any) => {
          const bookmarkData = await getBookmarkData(post.postId);
          allBookmarks.push(bookmarkData.Posts);
          return bookmarkData;
        })
      );      
      // setBookmarkedPosts(bookmarkDetails);
      // console.log(allBookmarks, '📚 All Bookmark Details');
    } catch (error) {
      console.error("❌ Error fetching bookmarks:", error);
    }
  };

  
  const getBookmarkData = async (userId: string) => {
    try {
      const response = await fetch(`${getBaseUrl()}/api/posts/getSpecificPost?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookmarks: ${response.status} ${response.statusText}`); ``
      }

      const posts = await response.json();      
      return posts
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };



  return (
    <bookmarkContext.Provider
      value={{

      }}
    >
      {children}
    </bookmarkContext.Provider>
  );
};

export { ContextProvider, bookmarkContext };
