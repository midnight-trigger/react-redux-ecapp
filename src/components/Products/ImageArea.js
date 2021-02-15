import React, {useCallback} from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import {makeStyles} from '@material-ui/styles';
import {storage} from '../../firebase';
import ImagePreview from './ImagePreview';

const useStyles = makeStyles({
  icon: {
    height: 48,
    width: 48
  }
})

const ImageArea = props => {
  const classes = useStyles();

  const deleteImage = useCallback(async id => {
    if (!window.confirm("この画像を削除しますか？")) {
      return false;
    }
    const newImages = props.images.filter(image => image.id !== id)
    props.setImages(newImages);
    return storage.ref("images").child(id).delete();
  }, [props.images]);

  const uploadImage = useCallback(event => {
    let blob =new Blob(event.target.files, {type: "image/jpeg"});

    // ランダムな16文字を生成
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n)=>S[n%S.length]).join("");
    const uploadTask = storage.ref("images").child(fileName).put(blob);

    uploadTask.then(() => {
      uploadTask.snapshot.ref.getDownloadURL().then(getDownloadURL => {
        const newImage = {id: fileName, path: getDownloadURL};
        props.setImages(prevState => [...prevState, newImage]);
      });
    })
  }, [props.setImages]);

  return (
    <div>
      <div className="p-grid__list-images">
        {props.images.length > 0 && (
          props.images.map(image => <ImagePreview id={image.id} path={image.path} key={image.id} delete={deleteImage} />)
        )}
      </div>
      <div className="u-text-right">
        <span>商品画像を登録する</span>
        <IconButton className={classes.icon}>
          <label>
            <AddPhotoAlternateIcon />
            <input className="u-display-none" type="file" id="iage" onChange={event => uploadImage(event)} />
          </label>
        </IconButton>
      </div>
    </div>
  )
}

export default ImageArea;
