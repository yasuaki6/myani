import React, { FC } from "react";
import styled from "styled-components";

type Props = {
  broadcast?: string;
  overview: string;
};

const STextArea = styled.div`
  position: relative;
  top: 2.5rem;
  font-size: 1rem;
  color: #f1f1f1;
  letter-spacing: 0.1rem;
  background-color: rgba(43, 43, 43);
`;

const SBroadcast = styled.span`
  font-size: 1rem;
  display: block;
  padding: 5px 15px;
`;

const STitle = styled.span`
  font-size: 2rem;
  display: block;
  padding: 5px;
`;

const SoverView = styled.div`
  margin: 0px 7px;
`;

const OverviewCard: FC<Props> = (props) => {
  const { broadcast, overview } = props;
  return (
    <STextArea>
      <STitle>概要</STitle>
      {broadcast && <SBroadcast>放送日 {broadcast}</SBroadcast>}
      <SoverView>{overview}</SoverView>
      <br />
      引用元:{" "}
      <a href="https://lineup.toei-anim.co.jp/ja/" style={{ color: "#D3DEF1" }}>
        東宝アニメーション作品ラインナップより
      </a>
    </STextArea>
  );
};

export default OverviewCard;
