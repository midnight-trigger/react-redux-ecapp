import React, {useState} from 'react';
import Swiper from 'react-id-swiper';
import NoImage from '../../assets/img/src/no_image.png';
import 'swiper/css/swiper.css';

const ImageSwiper = props => {
  const [params] = useState({
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
      dynamicBullets: true
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    loop: true
  });

  return (
    <Swiper {...params}>
      {props.images.length === 0 ? (
        <div className="p-media__thumb">
          <img src={NoImage} alt="no image" />
        </div>
      ) : (
        props.images.map(image => (
          <div className="p-media__thumb">
            <img src={image.path} alt="商品画像" />
          </div>
        ))
      )}
    </Swiper>
  )
}

export default ImageSwiper;
