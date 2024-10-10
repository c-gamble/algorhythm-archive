import React from "react";
import styled, { keyframes } from "styled-components";

const quiet = keyframes`
  25% { transform: scaleY(.6); }
  50% { transform: scaleY(.4); }
  75% { transform: scaleY(.8); }
`;

const normal = keyframes`
  25% { transform: scaleY(1); }
  50% { transform: scaleY(.4); }
  75% { transform: scaleY(.6); }
`;

const loud = keyframes`
  25% { transform: scaleY(1); }
  50% { transform: scaleY(.4); }
  75% { transform: scaleY(1.2); }
`;

const BoxContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Box = styled.div<{ animationType: "quiet" | "normal" | "loud" }>`
    transform: scaleY(0.4);
    height: 64px;
    width: 8px;
    background: black;
    animation-duration: 1.2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    border-radius: 8px;
    margin: 0 4px;
    animation-name: ${(props) =>
        props.animationType === "quiet"
            ? quiet
            : props.animationType === "normal"
            ? normal
            : loud};
`;

export const LoadingWave: React.FC = () => {
    return (
        <BoxContainer>
            <Box animationType="quiet" />
            <Box animationType="normal" />
            <Box animationType="quiet" />
            <Box animationType="loud" />
            <Box animationType="quiet" />
            <Box animationType="normal" />
            <Box animationType="loud" />
            <Box animationType="quiet" />
        </BoxContainer>
    );
};
