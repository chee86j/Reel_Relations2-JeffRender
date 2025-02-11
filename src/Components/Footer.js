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
              src="https://media.licdn.com/dms/image/D5635AQEh7kL96IDyew/profile-framedphoto-shrink_800_800/0/1691084634206?e=1705604400&v=beta&t=KC91DT_Rp165LENcDInmJxj2mzZGsi5Wk7OhMOuafh4"
              alt="Dorjee Wangdi"
            />
          </a>
        </Tilt>
        <Tilt>
          <a href="https://www.linkedin.com/in/ellie-tetelboym/">
            <img
              className="h-12 w-12 rounded-lg opacity-70 hover:opacity-100 hover:scale-110"
              src="https://media.licdn.com/dms/image/D4D03AQGTGJGU2EixBg/profile-displayphoto-shrink_800_800/0/1685512900275?e=1710374400&v=beta&t=RaQsaooZgX98MraHZzISnZZHhIllh2s5T4Ti531aUow"
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
              src="https://media.licdn.com/dms/image/D5635AQEkGQEe7UI4Jg/profile-framedphoto-shrink_800_800/0/1690220836905?e=1705604400&v=beta&t=4S-7sf0oOiCyL4WjRIpcWjRaOE2NlnS9u17K0YrTcss"
              alt="Grant Way"
            />
          </a>
        </Tilt>
      </div>
    </footer>
  );
};

export default Footer;
