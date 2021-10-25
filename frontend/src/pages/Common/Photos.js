import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";

import Footer from "../../components/footer/Footer";
import Modal from '../../components/Modal/Modal'

import { getSessionInfo } from "../../variable";
import { WS_LINK } from "../../globals";
import { checkFontFamily } from '../../functions'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./IndustryKpp.css";
import './NewsDetails.css'

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};



export default function News(props) {

    const sliderRef = useRef('')

    const [PAGEDATA, setPageData] = useState({});
    const [imageSlider, setImageSlider] = useState({
        open: false,
        slideIndex: 0
    });

    const toggleImageSlider = (index) => {

        setImageSlider(p => ({
            open: !p.open,
            slideIndex: index || 0
        }));

    };

    useEffect(() => {

        setTimeout(() => {
            imageSlider.open && sliderRef.current.slickGoTo(imageSlider.slideIndex)
        }, 0);

    }, [imageSlider])




    useEffect(() => {
        props.setPageTitle('Photos & Videos', 'صور و فيديو')
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();

        const postedData = {
            page_id: 6,
        };

        props.toggleSpinner(true);

        axios({
            method: "post",
            url: `${WS_LINK}get_page_component`,
            data: postedData,
            cancelToken: source.token,
        })
            .then((res) => {
                setPageData({ ...res.data });
                props.toggleSpinner(false);
            })
            .catch((err) => {
                props.toggleSpinner(false);
                if (axios.isCancel(err)) {
                    console.log("request canceled");
                } else {
                    console.log("request failed");
                }
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);




    const modalBody = (
        <div className="images-slider">
            <Slider {...settings} ref={sliderRef}>
                {PAGEDATA.photo && PAGEDATA.photo.map(item =>
                    <img src={item.image} className="slider-img" alt="slide" />
                )}
            </Slider>
        </div>
    );





    return (
        <div>

            {PAGEDATA.photo && PAGEDATA.video && (
                <>
                    <Modal name="loginModal" modalBody={modalBody} modalState={imageSlider.open} changeModalState={() => toggleImageSlider(0)} size='lg' />
                    {getSessionInfo("language") === "english" ? (
                        <>
                            <div className="pagesHeaderTitle" style={{ backgroundColor: "#4CC9B7", padding: "30px", paddingLeft: "10%", fontFamily: checkFontFamily() }}>
                                <div className="row justify-content-start px-3 px-lg-0">
                                    <div className="text-white col-lg-5" style={{ fontSize: "28px", fontFamily: "cnam-bold" }}>
                                        Photos & Videos
                                    </div>
                                    <div className="col-lg-5"></div>
                                </div>
                            </div>
                            <div className="pagesHeaderTitle" style={{ paddingLeft: "10%" }}>
                                <div className="row justify-content-start bg-white hide_scrollbar px-3 px-lg-0 homePageBigContainer mt-5" style={{}}>


                                    <h3 className="mb-3 mt-3" style={{ fontFamily: checkFontFamily(true) }}>Photos:</h3>
                                    <div className="row">

                                        {PAGEDATA.photo.map((item, index) =>
                                            <div key={item.media_id} className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-2">
                                                <img src={item.image} alt={item.slug} className="w-100 pointer photoPageImage" onClick={() => toggleImageSlider(index)} />
                                                <p className="photosVideosText" style={{ fontFamily: checkFontFamily() }}>{item.title_e}</p>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="mb-3 mt-3" style={{ fontFamily: checkFontFamily(true) }}>Videos:</h3>
                                    <div className="row">
                                        {PAGEDATA.video.map(item =>
                                            <div key={item.media_id} className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-2 VideosPage">
                                                <div dangerouslySetInnerHTML={{ __html: item.image }} />
                                                <p className="photosVideosText" style={{ fontFamily: checkFontFamily() }}>{item.title_e}</p>
                                            </div>
                                        )}
                                    </div>


                                </div>
                            </div>
                            <div className="bg-white hide_scrollbar largeScreen px-3 px-lg-0 homePageBigContainer">
                                <Footer data={PAGEDATA.footer} socials={PAGEDATA.social} />
                            </div>
                        </>
                    ) : (
                        //---------ARABIC----------
                        <>
                            <div className="pagesHeaderTitle-ar" style={{ backgroundColor: "#4CC9B7", padding: "30px", paddingRight: "10%", fontFamily: checkFontFamily() }}>
                                <div className="row justify-content-start px-3 px-lg-0">
                                    <div className="text-white col-lg-5" style={{ fontSize: "28px", fontFamily: "cnam-bold-ar" }}>
                                        صور و فيديو
                                    </div>
                                    <div className="col-lg-5"></div>
                                </div>
                            </div>
                            <div className="pagesHeaderTitle-ar" style={{ paddingRight: "10%" }}>
                                <div className="row justify-content-start bg-white hide_scrollbar px-3 px-lg-0 homePageBigContainer mt-5" style={{}}>
                                    <h3 className="mb-3 mt-3" style={{ fontFamily: checkFontFamily(true) }}>:الصور</h3>
                                    <div className="row">
                                        {PAGEDATA.photo.map((item, index) =>
                                            <div key={item.media_id} className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-2">
                                                <img src={item.image} alt={item.slug} className="w-100 pointer photoPageImage" onClick={() => toggleImageSlider(index)} />
                                                <p className="photosVideosText" style={{ fontFamily: checkFontFamily() }}>{item.title_a}</p>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="mb-3 mt-3" style={{ fontFamily: checkFontFamily(true) }}>:أشرطة فيديو</h3>
                                    <div className="row">
                                        {PAGEDATA.video.map(item =>
                                            <div key={item.media_id} className="col-12 col-sm-6 col-lg-3 mb-3 mb-lg-2 VideosPage">
                                                <div dangerouslySetInnerHTML={{ __html: item.image }} />
                                                <p className="photosVideosText" style={{ fontFamily: checkFontFamily() }}>{item.title_a}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white hide_scrollbar largeScreen px-3 px-lg-0 homePageBigContainer">
                                <Footer data={PAGEDATA.footer} socials={PAGEDATA.social} footer3class="pr-3" />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
