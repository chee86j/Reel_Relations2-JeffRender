import React from "react";
import Tilt from "react-parallax-tilt";

const Footer = () => {
  return (
    <footer className="flex items-center justify-between p-2 bg-base-200 fixed bottom-0 w-full">
      <div className="flex items-center space-x-4">
        <img
          className="h-12 max-w-sm rounded-lg"
          src="https://media.istockphoto.com/id/1319788168/vector/cat-set-popcorn-fsoda-glass-cute-cartoon-funny-character-kittens-watching-movie-black-white.jpg?s=170667a&w=0&k=20&c=AYpYwT0i76U0R28eCCj46Xg8f6b-sZ5PuYR7qDtOUro="
          alt="logo"
        />
        <p className="text-sm text-white">
          Copyright © 2023 - All Rights Reserved
        </p>
      </div>
      <div className="flex space-x-4">
        <Tilt>
          <a href="https://www.linkedin.com/in/dorjeewangdi/">
            <img
              className="h-12 w-12 rounded-lg opacity-70 hover:opacity-100 hover:scale-110"
              src="https://media.licdn.com/dms/image/D5635AQEh7kL96IDyew/profile-framedphoto-shrink_800_800/0/1691084633767?e=1696377600&v=beta&t=VEXMScZ7pTe1M8T94drXNC6WN1VgTwEolbvZLsWZpwo"
              alt="Dorjee Wangdi"
            />
          </a>
        </Tilt>
        <Tilt>
          <a href="https://www.linkedin.com/in/ellie-tetelboym/">
            <img
              className="h-12 w-12 rounded-lg opacity-70 hover:opacity-100 hover:scale-110"
              src="https://media.licdn.com/dms/image/D4D03AQGTGJGU2EixBg/profile-displayphoto-shrink_800_800/0/1685512899795?e=1698883200&v=beta&t=_V2CdzV1KiJWGnJhsBiNXXEulubpe2qD5dO_y0BfzoM"
              alt="Ellie Tetelboym"
            />
          </a>
        </Tilt>
        <Tilt>
          <a href="https://www.linkedin.com/in/jeffchee86/">
            <img
              className="h-12 w-12 rounded-lg opacity-70 hover:opacity-100 hover:scale-110"
              src="https://media.licdn.com/dms/image/D4E03AQFHhmuzadJ-IA/profile-displayphoto-shrink_800_800/0/1685372958148?e=2147483647&v=beta&t=wSqHGonDBrdK8IEjIp93QI6YETmZLZnm777WJDojiAE"
              alt="Jeffrey Chee"
            />
          </a>
        </Tilt>
        <Tilt>
          <a href="https://www.linkedin.com/in/grant-way/">
            <img
              className="h-12 w-12 rounded-lg opacity-70 hover:opacity-100 hover:scale-110"
              src="https://media.licdn.com/dms/image/D5635AQEkGQEe7UI4Jg/profile-framedphoto-shrink_800_800/0/1690220836570?e=1696377600&v=beta&t=NGfBzkiicfxdVOhTga7vAPEQYDI5x3LIlHdhcLQf0ks"
              alt="Grant Way"
            />
          </a>
        </Tilt>
      </div>
    </footer>
  );
};

export default Footer;
