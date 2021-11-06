import React, { useState } from "react";
import Deck from "./components/Deck";
import "./styles/Deck.css";
import FacebookLogin from "react-facebook-login";
import axios from "axios";

const PAGE_ID = "1138910426262414";
const ALBUM_ID = "1138914316262025";

const App = () => {
  const [login, setLogin] = useState(false);
  const [done, setDone] = useState(false);
  const memes = [];

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      setLogin(true);
      fetchMemes(response.accessToken);
    } else {
      setLogin(false);
    }
  };

  const fetchMemes = async (accessToken) => {
    const pageAccessToken = await getPageAccessToken(accessToken);
    const photos = await fetchPhotos(pageAccessToken);
    for (let index in photos) {
      const photo = photos[index];
      const imageUrl = await getPictureUrl(photo.id, pageAccessToken);
      const meme = {
        id: photo.id,
        imageUrl,
        content: photo.name,
      };
      memes.push(meme);
    }
    setDone(true);
  };

  const getPageAccessToken = async (accessToken) => {
    try {
      const res = await axios.get(
        `https://graph.facebook.com/${PAGE_ID}?fields=access_token&access_token=${accessToken}`
      );
      const pageAccessToken = res.data.access_token;
      return pageAccessToken;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPhotos = async (pageAccessToken) => {
    try {
      const res = await axios.get(
        `https://graph.facebook.com/${ALBUM_ID}/photos?limit=8&access_token=${pageAccessToken}`
      );
      const photos = res.data.data;
      return photos;
    } catch (e) {
      console.log({ e });
    }
  };

  const getPictureUrl = async (id, pageAccessToken) => {
    try {
      const res = await axios.get(
        `https://graph.facebook.com/${id}/picture?redirect=0&access_token=${pageAccessToken}`
      );
      console.log({ res });
      const url = res.data.data.url;
      console.log({ url });
      return url;
    } catch (e) {
      console.log({ e });
    }
  };

  return (
    <>
      {!login && (
        <FacebookLogin
          appId="4479213725501570"
          autoLoad={true}
          fields="name,email,picture"
          scope="public_profile,user_friends"
          callback={responseFacebook}
          icon="fa-facebook"
        />
      )}
      {done && (
        <>
          <h1>
            Meme Tinder{" "}
            <span role="img" aria-label="heart emoji">
              🖤
            </span>
          </h1>
          <Deck memes={memes} />
        </>
      )}
    </>
  );
};

export default App;
