import React, { useState, useContext, useEffect, useRef } from "react";
import { MyContext } from "../../providers/postProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "../../theme/create.css";
import { IonContent, IonPage } from "@ionic/react";
import Profiles from "../../components/searchOptions/profiles";
import Saved from "../../components/searchOptions/saved";
import Posts from "../../components/searchOptions/posts";
import SwiperCore from "swiper";

const Search: React.FC = () => {
  const categories = ["Profile", "Post", "Saved"];
  const [currentCategory, setCurrentCategory] = useState<string>(categories[0]);
  const [searchInput, setSearchInput] = useState<string>("");
  const { myInfo } = useContext<any>(MyContext);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const indicatorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    const activeIndex = categories.indexOf(currentCategory);
    const activeElement = indicatorRefs.current[activeIndex];

    if (activeElement) {
      const { left, width } = activeElement.getBoundingClientRect();
      const parentLeft =
        activeElement.parentElement?.getBoundingClientRect().left || 0;
      setIndicatorStyle({ left: left - parentLeft, width });
    }

    const index = categories.indexOf(currentCategory);
    if (swiperRef.current && swiperRef.current.activeIndex !== index) {
      swiperRef.current.slideTo(index);
    }
  }, [currentCategory]);

  const blurhash = myInfo?.blurhash || "U~I#+9xuRjj[_4t7aej[xvjYoej[WCWAkCoe";

  return (
    <IonPage className="fullscreen" style={{ paddingTop: "20px" }}>
      <IonContent className="center">
        <div className="brown">
          <input
            className="input"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            placeholder="Search Here..."
          />
        </div>
        <div className="indicator-bar">
          {categories.map((category, index) => (
            <div
              key={category}
              ref={(el) => (indicatorRefs.current[index] = el)}
              className={`indicator-item ${currentCategory === category ? "active" : ""}`}
              onClick={() => setCurrentCategory(category)}
            >
              {category}
            </div>
          ))}
          <div
            className="indicator-slide"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
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
          <SwiperSlide style={{ height: "100%" }} key="profiles">
            <IonContent scrollY={true}>
              <Profiles search={searchInput} />
            </IonContent>
          </SwiperSlide>
          <SwiperSlide style={{ height: "100%" }} key="posts">
            <IonContent style={{ height: "100%" }} scrollY={true}>
              {/* <Posts search={searchInput} /> */}
            </IonContent>
          </SwiperSlide>
          <SwiperSlide style={{ height: "100%" }} key="saved">
            <IonContent scrollY={true}>
              {/* <Saved search={searchInput} /> */}
            </IonContent>
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Search;
