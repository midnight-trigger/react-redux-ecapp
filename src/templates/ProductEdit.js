import React, {useState, useEffect, useCallback} from 'react';
import {TextInput, SelectBox, PrimaryButton} from '../components/UIkit';
import {ImageArea, SetSizeArea} from '../components/Products';
import {useDispatch} from 'react-redux';
import {saveProduct} from '../reducks/products/operations';
import {db} from '../firebase';

const ProductEdit = () => {
  const dispatch = useDispatch();
  let id = window.location.pathname.split("/product/edit")[1];
  id = (id !== "") ? id.split("/")[1] : "";

  const [images, setImages] = useState([]),
        [name, setName] = useState(""),
        [description, setDescription] = useState(""),
        [category, setCategory] = useState(""),
        [gender, setGender] = useState(""),
        [price, setPrice] = useState(""),
        [sizes, setSizes] = useState([]);

  const inputName = useCallback(event => {
    setName(event.target.value);
  }, [setName]);

  const inputDescription = useCallback(event => {
    setDescription(event.target.value);
  }, [setDescription]);

  const inputPrice = useCallback(event => {
    setPrice(event.target.value);
  }, [setPrice]);

  const categories = [
    {id: "tops", name: "トップス"},
    {id: "shirts", name: "シャツ"},
    {id: "pants", name: "パンツ"}
  ];

  const genders = [
    {id: "all", name: "全て"},
    {id: "male", name: "メンズ"},
    {id: "female", name: "レディース"}
  ];

  useEffect(() => {
    if (id !== "") {
      db.collection("products").doc(id).get().then(snapshot => {
        // setImages(snapshot.data().images);
        setName(snapshot.data().name);
        setDescription(snapshot.data().description);
        setCategory(snapshot.data().category);
        setGender(snapshot.data().gender);
        setPrice(snapshot.data().price);
        setSizes(snapshot.data().sizes);
      });
    }
  }, [id])

  return (
    <section>
      <h2 className="u-text__headline u-text-center">商品の登録・編集</h2>
      <div className="c-section-container">
        <ImageArea images={images} setImages={setImages} />
        <TextInput
          fullWidth={true}
          label={"商品名"}
          multiline={false}
          required={true}
          rows={1}
          value={name}
          type={"text"}
          onChange={inputName}
        />
        <TextInput
          fullWidth={true}
          label={"商品説明"}
          multiline={true}
          required={true}
          rows={5}
          value={description}
          type={"text"}
          onChange={inputDescription}
        />
        <SelectBox
          label={"カテゴリー"}
          required={true}
          value={category}
          select={setCategory}
          options={categories}
        />
        <SelectBox
          label={"性別"}
          required={true}
          value={gender}
          select={setGender}
          options={genders}
        />
        <TextInput
          fullWidth={true}
          label={"価格"}
          multiline={false}
          required={true}
          rows={1}
          value={price}
          type={"number"}
          onChange={inputPrice}
        />
      <div className="module-spacer--small"></div>
      <SetSizeArea sizes={sizes} setSizes={setSizes} />
      <div className="module-spacer--small"></div>
      <div className="center">
        <PrimaryButton label={"商品情報を保存"} onClick={() => dispatch(saveProduct(id, images, name, description, category, gender, price, sizes))} />
      </div>
      </div>
    </section>
  )
}

export default ProductEdit;
