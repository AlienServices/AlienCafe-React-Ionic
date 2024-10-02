import React, { useState, useRef, useContext } from "react";
import { MyContext } from "../providers/postProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "../theme/create.css";
import {
    IonContent,
    IonInput,
    IonPage,
} from "@ionic/react";
import Profiles from "../components/searchOptions/profiles";
import Saved from "../components/searchOptions/saved";
import Posts from "../components/searchOptions/posts";

const Search = () => {
    const [categories, setCategories] = useState([
        "Profiles",
        "Saved",
        "Posts",
    ]);
    const [currentCategory, setCurrentCategory] = useState(categories[0]);
    const [searchInput, setSearchInput] = useState('');
    const { myInfo } = useContext(MyContext);

    return (
        <IonPage style={{ paddingTop: '20px', padding: "15px" }}>
            <IonContent>
                <IonInput onIonChange={(e: CustomEvent) => { setSearchInput(e.detail.value!) }} placeholder="Search Here"></IonInput>
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={50}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    onSlideChange={(swiper) =>
                        setCurrentCategory(categories[swiper.activeIndex])
                    }
                    style={{ height: "100%" }}
                >
                    <SwiperSlide key="profiles">
                        <Profiles search={searchInput} />
                    </SwiperSlide>
                    <SwiperSlide key="posts">
                        <Posts search={searchInput} />
                    </SwiperSlide>
                    <SwiperSlide key="saved">
                        <Saved search={searchInput} />
                    </SwiperSlide>
                </Swiper>
            </IonContent>
        </IonPage>
    );
};

export default Search;
