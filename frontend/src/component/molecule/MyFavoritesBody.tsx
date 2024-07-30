import React, { FC, useState } from "react";
import styled from "styled-components";
import FavoriteCard from "./card/FavoritesCard.tsx";
import BasicPagination from "../atom/pagination/Pagination.tsx";

// グリッドコンポーネントの定義
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 250px);
  grid-template-rows: repeat(2, 400px);
  gap: 3rem; // 列間の間隔を設定
  background-color: #292836;
  justify-content: center;
  align-content: start;
  padding: 10px;

  @media screen and (max-width: 450px) {
    grid-template-columns: repeat(1, 250px);
    grid-template-rows: repeat(8, 400px);
  }

  @media screen and (min-width: 501px) and (max-width: 900px) {
    grid-template-columns: repeat(2, 250px);
    grid-template-rows: repeat(4, 400px);
  }

  @media screen and (min-width: 901px) and (max-width: 1300px) {
    grid-template-columns: repeat(3, 250px);
    grid-template-rows: repeat(3, 400px);
  }
`;

const Warp = styled.div`
  background-color: #292836;
  display: flex;
  justify-content: center;
  padding: 30px;
`;

type Props = {
  datas:
    | {
        [key: string]: {
          overview?: string;
          img?: string;
          broadcast?: string;
        };
      }
    | {};
  callBackFnc?: (title: string) => void;
};

const pageSize = 8;

const MyFavoritesBody: FC<Props> = (props) => {
  const { datas, callBackFnc } = props;
  const [currentPage, setCurrentPage] = useState(1);

  // 現在のページのデータを計算
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // 総ページ数を計算
  const totalItems = Object.keys(datas).length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // ページが変更されたときの処理
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Grid>
        {Object.keys(datas)
          .slice(startIndex, endIndex)
          .map((title) => (
            <FavoriteCard
              key={title}
              title={title}
              callBackFnc={callBackFnc}
              {...datas[title]}
            />
          ))}
      </Grid>
      <Warp>
        <BasicPagination count={totalPages} callbackFnc={handlePageChange} />
      </Warp>
    </>
  );
};

export default MyFavoritesBody;
