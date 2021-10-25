import React, {useState} from 'react'

import PlayIcon from '../../assets/images_png/icon-play.png'

import classes from './TmpVideo.module.css'

const TmpVideo = (props) => {

    const [videoClicked, setVideoClicked] = useState(false);

  return (
    <div className={`${classes.videoContainer} ${props.className || ''}`}>
      {videoClicked ? (
        <div className="h-100">
          {props.video ? <div dangerouslySetInnerHTML={{ __html: props.video }} className={classes.videoAfterClick}/>
          :
          <div className={classes.videoAfterClick}>
                        <video controls >
              <source src="/Video/This is cnam_1080p.mp4" type="video/mp4" />
            </video>
          </div>
          }
        </div>
      ) : (
        <div
          style={{ backgroundImage: `url('${props.image}')` }} //* image: string
          onClick={() => setVideoClicked(true)}
          className={classes.videoBeforeClick}
        >
          <div style={{ backgroundImage: `url('${PlayIcon}')` }} className={classes.videoIcon}/>
        </div>
      )}
    </div>
    )
}

export default TmpVideo
