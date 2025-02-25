import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { UserContext } from "./userProvider";
import { MyContext } from "./postProvider";

interface BookmarkContext {
  bookmarkedPosts: any[];
  addBookmark: (userId: string, postId: string) => void;
  getAllBookmarks: (userId: string) => void;
}

const bookmarkContext = createContext<BookmarkContext>({
  bookmarkedPosts: [],
  addBookmark: () => { },
  getAllBookmarks: () => { },
});

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const { getBaseUrl } = useContext(MyContext);
  const { myInfo } = useContext(UserContext);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);

  useEffect(() => {
    if (myInfo?.id) {
      getAllBookmarks(myInfo.id);
    }
  }, [myInfo]);

  const addBookmark = async (userId: string, postId: string) => {
    try {
      await fetch(`${getBaseUrl()}/api/posts/addBookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, postId }),
      });
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const getAllBookmarks = async (userId: string) => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/posts/getBookmark?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookmarks: ${response.statusText}`);
      }

      const bookmarkedIds = await response.json();
      const bookmarkDetails = await Promise.all(
        bookmarkedIds.bookmarks?.map(async (bookmark: any) => {
          const bookmarkData = await getBookmarkData(bookmark.postId);
          return bookmarkData.Posts;
        })
      );

      setBookmarkedPosts(bookmarkDetails.flat()); // Flatten the array of arrays
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const getBookmarkData = async (postId: string) => {
    try {
      const response = await fetch(
        `${getBaseUrl()}/api/posts/getSpecificPost?postId=${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookmark data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching bookmark data:", error);
      throw error;
    }
  };

  return (
    <bookmarkContext.Provider value={{ bookmarkedPosts, addBookmark, getAllBookmarks }}>
      {children}
    </bookmarkContext.Provider>
  );
};

export { ContextProvider, bookmarkContext };