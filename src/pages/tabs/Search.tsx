import React, { useState, useContext, useEffect, useRef } from "react";
import { MyContext } from "../../providers/postProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "../../theme/create.css";
import { IonContent, IonPage } from "@ionic/react";
import Profiles from "../../components/searchOptions/profiles";
import Saved from "../../components/searchOptions/saved";
import Posts from "../../components/searchOptions/posts";

const Search = () => {
    const categories = ["Profiles", "Posts", "Saved"];
    const [currentCategory, setCurrentCategory] = useState(categories[0]);
    const [searchInput, setSearchInput] = useState('');
    const { myInfo } = useContext(MyContext);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const indicatorRefs = useRef<(HTMLDivElement | null)[]>([]);
    const swiperRef = useRef(null);

    // Update indicator position
    useEffect(() => {
        const activeIndex = categories.indexOf(currentCategory);
        const activeElement = indicatorRefs.current[activeIndex];

        if (activeElement) {
            const { left, width } = activeElement.getBoundingClientRect();
            const parentLeft = activeElement.parentElement?.getBoundingClientRect().left || 0;
            setIndicatorStyle({ left: left - parentLeft, width });
        }

        // Programmatically navigate Swiper to the active category
        const index = categories.indexOf(currentCategory);
        if (swiperRef.current && swiperRef.current.activeIndex !== index) {
            swiperRef.current.slideTo(index);
        }
    }, [currentCategory]);

    const blurhash = myInfo?.blurhash || 'U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe'

    return (
        <IonPage style={{ paddingTop: '20px', padding: "15px" }}>
            <IonContent scrollY={false}>
                <input
                    className='input'
                    onChange={(e) => { setSearchInput(e.target.value) }}
                    placeholder="Search Here"
                />
                <div className="indicator-bar">
                    {categories.map((category, index) => (
                        <div
                            key={category}
                            ref={(el) => (indicatorRefs.current[index] = el)}
                            className={`indicator-item ${currentCategory === category ? 'active' : ''}`}
                            onClick={() => setCurrentCategory(category)}
                        >
                            {category}
                        </div>
                    ))}
                    <div
                        className="indicator-slide"
                        style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` }}
                    />
                </div>
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={50}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    onSlideChange={(swiper) =>
                        setCurrentCategory(categories[swiper.activeIndex])
                    }
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
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
