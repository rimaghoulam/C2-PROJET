import React from "react";
import Slider from "react-slick";

import Quote from "../quotes_testimonials/Quote";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../../App.css'
import './TestimonialSlider.css'

import { getSessionInfo } from "../../variable";
// import { QuestionAnswerSharp } from "@material-ui/icons";

export default function TestimonialSlider({ data, img_data }) {


  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: data.length > 1 ? 2 : 1,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    initialSlide: getSessionInfo('language') === 'english' ? 0 : 1,
    rtl: getSessionInfo('language') === 'english' ? '' : 'true',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          initialSlide: 1,
          rtl: getSessionInfo('language') === 'english' ? '' : 'true',
          dots: true
        }
      },
    ]
  }

  let quotes = []
  if (getSessionInfo('language') === 'arabic') {
    quotes = data.map((item, index) =>
      <Quote
        key={ `testimonial-${index}` }
        language="arabic"
        body={item.text_a}
        author={item.name_a}
        role={item.position_a}
        profile_pic={img_data ? img_data[index].image : ''}
      />
    )
  }
  else {
    quotes = data.map((item, index) =>
      <Quote
        key={ `testimonial-${index}` }
        language="english"
        body={item.text_e}
        author={item.name_e}
        role={item.position_e}
        profile_pic={img_data ? img_data[index].image : ''}
      />
    )
  }


  return (
    <>
      {getSessionInfo('language') === 'english' ?
        (

          <div
            className="quote-body-container"
            style={{ backgroundColor: "#FAF8F6", padding: "0 14%" }}
          >
            <Slider {...settings}>
              {quotes}
            </Slider>
          </div>
        )

        : // ARABIC

        (

          <div
            className="quote-body-container"
            style={{ backgroundColor: "#FAF8F6", padding: "0 14%" }}
          >
            <Slider {...settings}>
              {quotes}
            </Slider>
          </div>
        )
      }
    </>
  );
}