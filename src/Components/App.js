import React, { useEffect, useState } from "react";
import Home from "./Home";
import LoginRegister from "./LoginRegister";
import { useSelector, useDispatch } from "react-redux";
import { Link, Routes, Route } from "react-router-dom";
import SingleMovie from "./SingleMovie";
import SingleCast from "./SingleCast";
import DegreesOfSeparation from "./DegreesOfSeperation";
import Navbar from "./Navbar";
import About from "./About";
import { PageNotFound } from "./PageNotFound";
import Favorites from "./Favorites";
import Footer from "./Footer";
import { fetchActors, loginWithToken } from "../store";
import EditAccount from "./EditAccount";

const App = () => {
  const { auth, actors } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const backgroundImages = [
    "url('https://e1.pxfuel.com/desktop-wallpaper/353/386/desktop-wallpaper-red-carpet-animation-motion-backgrounds-red-carpet-background.jpg')",
    "url('https://s.yimg.com/ny/api/res/1.2/vYszp9aUDNA3PjiNeesKWw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTYwOTtjZj13ZWJw/https://media.zenfs.com/en/lifestyle_asia_my_409/9a70fe3552d57406984a39fd7e75df5e')",
    "url('https://curiocity.com/wp-content/uploads/2021/03/ohoo-cgv-screenx_key-visual_grand_final_170801_low-2-1265x600.jpg')",
    "url('https://i.pinimg.com/originals/ba/95/f1/ba95f16da373efae78981d304487a08f.jpg')",
    "url('https://static.vecteezy.com/system/resources/previews/014/947/198/large_2x/movie-theater-hall-with-panoramic-screen-free-vector.jpg')",
    "url('https://www.hollywoodreporter.com/wp-content/uploads/2022/06/imax-04-220420.jpg')",
    "url('https://ak5.picdn.net/shutterstock/videos/33621025/thumb/1.jpg')",
    "url('https://static.vecteezy.com/system/resources/previews/015/008/166/non_2x/young-woman-in-cinema-mesmerized-girl-and-pop-corn-free-vector.jpg')",
    "url('https://wallpaperaccess.com/full/1820719.jpg')",
    "url('https://static.vecteezy.com/system/resources/previews/016/265/372/large_2x/movie-theater-with-panoramic-screen-with-galaxy-free-vector.jpg')",
    "url('https://i0.wp.com/codigoespagueti.com/wp-content/uploads/2017/07/imax.jpg')",
    "url('https://www.thespruce.com/thmb/qZuEutzBNf7qRmnkbd10DtE4c6w=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/home-theater-room-getty-vostok-57f55aeb3df78c690f118170.jpg')",
    "url('https://static.vecteezy.com/system/resources/previews/016/263/215/large_2x/movie-theater-cinema-hall-with-wide-screen-seats-free-vector.jpg')",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const backgroundImage = backgroundImages[currentIndex];

  const handleThemeToggle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  };

  useEffect(() => {
    // initial data loading here
    dispatch(loginWithToken());
    dispatch(fetchActors());
    // when loaded then set loading to false
    setLoading(false);
  }, []);

  return (
    <div
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundPosition: "center",
      }}
    >
      <button
        className="theme border rounded text-teal-200 border-white-400 hover:text-white hover:border-teal-400 flex text-md tracking-tight absolute left-6 top-2 mb-4 rounded-md focus:outline-none focus:shadow-outline"
        onClick={handleThemeToggle}
      >
        Theme
      </button>
      <div style={{ paddingTop: "1rem" }}>
        <Navbar />
        <Routes>
          {auth.id ? (
            <Route path="/editAccount" element={<EditAccount />} />
          ) : null}
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<SingleMovie />} />
          <Route path="/casts/:id" element={<SingleCast />} />
          <Route
            path="/degrees-of-separation/:casts1Id/:casts2Id"
            element={<DegreesOfSeparation />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <div className="h-20 bg-transparent" />
      <Footer />
    </div>
  );
};

export default App;
