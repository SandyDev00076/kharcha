import styled from "@emotion/styled";
import { Colors, Sizes } from "./variables";

export const Container = styled.section`
  padding: 64px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

export const Form = styled.form`
  padding: 32px;
  width: 100%;
  background-color: ${Colors.bg};
  color: ${Colors.text};
  border-radius: 10px;
`;

export const Input = styled.input`
  padding: 8px 10px;
  width: 100%;
  background: none;
  border: 1px solid ${Colors.bgLight5};
  border-radius: 10px;
  outline: none;
  color: white;
`;

export const Button = styled.button`
  padding: 8px 10px;
  text-transform: uppercase;
  border: none;
  outline: none;
  width: 100%;
  border-radius: 10px;
  background: none;
  font-size: ${Sizes.medium};
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  &:hover {
    filter: brightness(0.9);
  }

  &:disabled {
    filter: brightness(0.5);
    cursor: default;
  }
`;

export const PrimaryButton = styled(Button)`
  background-color: ${Colors.bgLight25};
  color: ${Colors.textInvert};
  & > svg {
    fill: ${Colors.textInvert};
  }
`;

export const SecondaryButton = styled(Button)`
  border: 1px solid ${Colors.actionLight12};
  color: ${Colors.text};
  & > svg {
    fill: ${Colors.text};
  }
`;

export const DangerButton = styled(Button)`
  background-color: ${Colors.danger};
  color: ${Colors.text};
  & > svg {
    fill: ${Colors.text};
  }
`;

export const Greeting = styled.h1`
  font-size: ${Sizes.large};
  color: ${Colors.secondaryText};
  font-weight: normal;
  display: block;
`;

export const Filler = styled.div`
  flex: 1;
`;

export const Tray = styled.footer`
  width: 100vw;
  padding: 32px;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  gap: 16px;
  align-items: flex-end;
  justify-content: space-between;
`;
