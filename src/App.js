import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

import cardBackground from "./images/Background.png";
import cardBack from "./images/Dixit_Back.png";
import refreshIcon from "./images/Shuffle_Button.png";
import logo from "./images/Dixit_Logo.png";

const allFrontImages = Array.from(
  { length: 62 },
  (_, i) => `Dixit_${i + 1}.png`
);

const getRandomImages = async (imageNames, count) => {
  const shuffledImageNames = [...imageNames].sort(() => Math.random() - 0.5);
  const selectedImageNames = shuffledImageNames.slice(0, count);

  const importedImages = await Promise.all(
    selectedImageNames.map((imageName) =>
      import(`./images/front/${imageName}`).then((module) => module.default)
    )
  );

  return importedImages;
};

export default function App() {
  const [cardFronts, setCardFronts] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    getRandomImages(allFrontImages, 3).then((images) => setCardFronts(images));
  }, []);

  const reshuffleCards = async () => {
    setFlippedCard(null);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsShuffling(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsShuffling(false);
    getRandomImages(allFrontImages, 3).then((images) => setCardFronts(images));
  };

  const handleCardClick = (index) => {
    setFlippedCard(flippedCard === index ? null : index);
  };

  const handleAboutClick = () => {
    setShowAbout(!showAbout);
  };

  if (isLoading) {
    return (
      <LoadingScreen>
        <img src={logo} alt="Dixit Logo" />
      </LoadingScreen>
    );
  }

  return (
    <AppContainer>
      <ContentContainer>
        <CardsContainer>
          {cardFronts.map((frontImage, index) => (
            <Card
              key={index}
              frontImage={frontImage}
              isShuffling={isShuffling}
              isFlipped={flippedCard === index}
              onClick={() => handleCardClick(index)}
              position={index === 0 ? "left" : index === 2 ? "right" : "center"}
            >
              <CardBackSide backImage={cardBack} />
              {frontImage && <CardFrontSide frontImage={frontImage} />}
            </Card>
          ))}
        </CardsContainer>
        <ButtonsContainer>
          <RefreshButton onClick={reshuffleCards}>
            <img src={refreshIcon} alt="Refresh" />
          </RefreshButton>
        </ButtonsContainer>
      </ContentContainer>
      <AboutButton onClick={handleAboutClick}>About</AboutButton>
      {showAbout && (
        <AboutPopup>
          <CloseButton onClick={handleAboutClick}>&times;</CloseButton>
          <h2>About</h2>
          <p>
            This app is designed to showcase images from the Dixit game to
            promote new ideas of discussion during a coaching session.
          </p>
          <p>The images were obtained <a href="https://www.libellud.com/ressources/dixit/#https://www.libellud.com/wp-content/uploads/2022/03/Banque-images-Odyssey.zip">here</a>.</p>
          <p> - Made with love by <a href="https://zephirlorne.com">Zéphir</a> :) </p>
          <p>   <a href="https://github.com/zephirl/TaleWeaver">Source Code</a></p>
        </AboutPopup>
      )}
    </AppContainer>
  );
}

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2d2d2d;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${cardBackground});
  background-repeat: no-repeat;
  background-size: cover;
  margin: 0px;
  padding: 0px;
  position: relative;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  padding: 20px;
  transition: transform 0.8s;
`;

const CardBackSide = styled(CardSide)`
  background-image: url(${(props) => props.backImage});
  transform: rotateY(0deg);
`;

const CardFrontSide = styled(CardSide)`
  background-image: url(${(props) => props.frontImage});
  transform: rotateY(180deg);
`;

const Card = styled.div`
  position: relative;
  width: 20%;
  padding-bottom: calc(20% * 1.62);
  background-image: url(${(props) => props.frontImage});
  background-size: cover;
  background-position: center;
  margin: 0 1%;
  box-sizing: border-box;
  float: left;
  border-radius: 10px;
  perspective: 1000px;
  transition: transform 1s;
  animation: ${(props) =>
      props.isShuffling ? shuffleAnimation(props.position) : "none"}
    1s;
  transform-style: preserve-3d;
  transform: ${(props) => (props.isFlipped ? "rotateY(180deg)" : "none")};
  cursor: pointer;
`;

const shuffleAnimation = (position) => keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(${
      position === "left" ? "170%" : position === "right" ? "-170%" : "0"
    });
  }
  100% {
    transform: translateX(0);
  }
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2d2d2d;
  margin: 0px;
  padding: 0px;

  img {
    width: 200px;
    height: auto;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const RefreshButton = styled.button`
  font-size: 18px;
  padding: 10px 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-top: 40px;

  img {
    width: 120px;
    height: 55px;
  }
`;

const AboutButton = styled.button`
  font-size: 18px;
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  position: absolute;
  bottom: 20px;

  &:hover {
    text-decoration: underline;
  }
`;

const AboutPopup = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 28px;
  font-weight: bold;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #999;
  }
`;
