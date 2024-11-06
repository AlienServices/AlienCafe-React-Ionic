import React, { useEffect, useState, useContext } from "react";
import {
    IonIcon,
    IonModal,
    IonAvatar,
    IonCard,
    IonNavLink,
    IonList,
    IonButton,
} from "@ionic/react";
import {
    arrowUpCircleOutline,
    arrowUpCircle,
    arrowDownCircleOutline,
    arrowDownCircle,
    chatbubbleOutline,
    bookmarkOutline,
    shareOutline,
    checkmarkCircleOutline,
} from "ionicons/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../theme/Tab3.css";
import Profile from "../../pages/Profile/[id]";
import { MyContext } from "../../providers/postProvider";
import { UserContext } from "../../providers/userProvider";
import { useHistory } from "react-router";

interface PostProps {
    post: {
        id: string;
        email: string;
        title: string;
        content: string;
        likes: string[];
        dislikes: string[];
        comments: any[];
    };
}

const Post: React.FC<PostProps> = ({ post }) => {
    const history = useHistory();
    const {        
        addLike,
        addDislike,    
        getUserPosts,
    } = useContext(MyContext);
    const {
        myInfo,
        updateUser,
    } = useContext(UserContext);

    const [user, setUser] = useState({
        bio: "",
        email: "",
        followers: [],
        following: [],
        id: "",
        username: "",
    });
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        getUser();
    }, []);


    const getUser = async () => {
        try {
            const result = await fetch(
                `http://localhost:3000/api/myInfo?email=${localStorage.getItem("user")}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const userInfo = await result.json();
            setUser(userInfo.Hello);
            console.log(userInfo, "this is user result");
        } catch (error) {
            console.log(error, "this is the create user error");
        }
    };

    const transformTitleToH1 = (title: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(title, "text/html");
        const pTag = doc.querySelector("p");

        if (pTag) {
            const h1Tag = document.createElement("h1");
            h1Tag.innerHTML = pTag.innerHTML;
            h1Tag.classList.add('quillH1')
            pTag.parentNode?.replaceChild(h1Tag, pTag);
        }

        return doc.body.innerHTML;
    };

    const truncateContent = (content: string, length: number = 170) => {
        const doc = new DOMParser().parseFromString(content, "text/html");
        let text = doc.body.textContent || "";
        return text.length > length ? text.slice(0, length) + "..." : text;
    };

    const gotoTopic = (id: string) => {
        history.push(`/view/${id}`);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const isLikedByUser = (likes: string[]): boolean => likes.includes(myInfo?.id ?? '');
    const isDislikedByUser = (dislikes: string[]): boolean => dislikes.includes(myInfo?.id ?? '');
    const calculateNetScore = (likes: string[], dislikes: string[]): number => likes.length - dislikes.length;

    const transformedTitle = transformTitleToH1(post.title);
    const truncatedContent = truncateContent(post.content, 400);

    // const profileImage = (id: string) => {
    //     if (id) {
    //         const newProfileImageUri = `${import.meta.env.VITE_APP_SUPABASE_URL
    //             }/storage/v1/object/public/ProfilePhotos/${id}.jpg`;
    //         return newProfileImageUri;
    //     }
    // };

    return (
        <>
            <IonList>
                <div className="shadow" key={post.id}>
                    <IonCard
                        style={{ boxShadow: "none", paddingBottom: "10px" }}
                        className="card"
                    >
                        <div className="space">
                            <div className="around">
                                <div className="emailContainer">
                                    <IonAvatar
                                        style={{
                                            height: "35px",
                                            width: "35px",
                                        }}
                                    >
                                        <img
                                            alt="Silhouette of a person's head"
                                            src={'data:image/jpeg;base64,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'}
                                        />
                                    </IonAvatar>
                                    <IonNavLink
                                        onClick={() => {
                                            getUserPosts(post.email);
                                        }}
                                        routerDirection="forward"
                                        component={() => <Profile id={post.email} />}
                                    >
                                        <div className="usernameColumn">
                                            <div className="username">{post.email}</div>
                                            <div className="tag">{post.email}</div>
                                        </div>
                                    </IonNavLink>
                                </div>
                                <div>
                                    {myInfo?.email !== post?.email ? (
                                        <>
                                            {myInfo?.following?.indexOf(post.email) !== -1 ? (
                                                <IonIcon icon={checkmarkCircleOutline}></IonIcon>
                                            ) : (
                                                <button
                                                    className="button"
                                                    onClick={() => {
                                                        updateUser(myInfo?.email, post?.email, "");
                                                    }}
                                                >
                                                    Follow
                                                </button>
                                            )}
                                        </>
                                    ) : null}
                                </div>
                            </div>
                            <div onClick={() => gotoTopic(post.id)}>
                                <ReactQuill

                                    style={{ color: "black" }}
                                    readOnly={true}
                                    theme="bubble"
                                    value={transformedTitle}
                                />
                                <ReactQuill
                                    className="small"
                                    style={{ color: "black" }}
                                    readOnly={true}
                                    theme="bubble"
                                    value={truncatedContent}
                                />
                            </div>                            
                        </div>
                        <div className="smallRow">
                            <div className="tinyRow">
                                <div className="voteRow">
                                    <IonIcon
                                        onClick={() => addLike(post.id)}
                                        icon={isLikedByUser(post?.likes) ? arrowUpCircle : arrowUpCircleOutline}
                                    ></IonIcon>
                                    <div className="small">{calculateNetScore(post?.likes, post?.dislikes)}</div>
                                    <IonIcon
                                        onClick={() => addDislike(post.id)}
                                        icon={isDislikedByUser(post?.dislikes) ? arrowDownCircle : arrowDownCircleOutline}
                                    ></IonIcon>
                                </div>
                                <IonIcon style={{ paddingRight: "5px" }} icon={chatbubbleOutline}></IonIcon>
                                <div className="small">{post?.comments?.length}</div>
                            </div>
                            <div className="tinyRow">
                                <IonIcon icon={bookmarkOutline}></IonIcon>
                                <IonIcon icon={shareOutline} onClick={openModal}></IonIcon>
                            </div>
                        </div>
                    </IonCard>
                </div>
            </IonList>

            <IonModal isOpen={showModal}>
                <IonButton slot="end">Close</IonButton>
                <IonButton style={{ padding: "10px" }} onClick={closeModal}>
                    close
                </IonButton>
                <input style={{ color: "white" }} type="text" />
                <div>kale</div>
            </IonModal>
        </>
    );
};

export default Post;
