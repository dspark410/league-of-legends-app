/** @format */

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import style from "./paginate.module.css";

function Paginate({ paginate, prevNext, firstLast, nextPage, prevPage }) {
  const [begin, setBegin] = useState(0);
  const [end, setEnd] = useState(10);

  const {
    leaderboard: { rank, page, currentPage, postsPerPage, totalPosts },
  } = useSelector((state) => state);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    setBegin(0);
    setEnd(10);
    paginate(1);
    // eslint-disable-next-line
  }, [rank]);

  const next = () => {
    if (pageNumbers.length > end) {
      const start = begin;
      setEnd((prev) => prev + 10);
      setBegin((prev) => prev + 10);
      paginate(start + 11);
    }
  };

  const before = () => {
    if (currentPage === 1 || end <= 10) {
      return;
    }
    if (pageNumbers.length > begin && begin > 10) {
      setEnd((prev) => prev - 10);
      if (begin > 10) {
        const start = begin;
        setBegin((prev) => prev - 10);

        paginate(start - 9);
      }
    } else if (begin <= 10) {
      setBegin(0);
      setEnd(10);
      paginate(1);
    }
  };

  const firstPage = () => {
    if (end <= 10 || currentPage === 1) {
      return;
    }
    setBegin(0);
    setEnd(10);
    paginate(1);
  };

  const lastPage = () => {
    if (end < pageNumbers.length) {
      setEnd(Math.ceil(pageNumbers.length / 10) * 10);
      setBegin(Math.ceil(pageNumbers.length / 10) * 10 - 10);
      paginate(Math.ceil(pageNumbers.length / 10) * 10 - 9);
    }
  };

  const nextPaginate = () => {
    nextPage();
    paginate(1);
  };

  const prevPaginate = () => {
    prevPage();
    paginate(1);
  };

  return (
    <div>
      <ul className={style.ul}>
        {prevNext ? (
          <li
            onClick={firstPage}
            className={begin === 0 ? style.liNone : style.li}
          >
            &#60;&#60;
          </li>
        ) : null}
        {firstLast ? (
          <li
            onClick={before}
            className={begin === 0 ? style.liNone : style.li}
          >
            &#60;
          </li>
        ) : (
          <li
            onClick={page > 1 ? prevPaginate : null}
            className={page > 1 ? style.li : style.liNone}
          >
            &#60;
          </li>
        )}

        {pageNumbers.slice(begin, end).map((number, i) => (
          <li
            onClick={() => paginate(number)}
            className={`${style.li} ${currentPage === number && style.color} `}
            key={i}
          >
            {page ? (page === 1 ? number : number + (page - 1) * 5) : number}
          </li>
        ))}
        {firstLast ? (
          <li
            onClick={next}
            className={
              end === Math.ceil(pageNumbers.length / 10) * 10
                ? style.liNone
                : style.li
            }
          >
            &#62;
          </li>
        ) : (
          <li
            onClick={totalPosts < 205 ? null : nextPaginate}
            className={totalPosts < 205 ? style.liNone : style.li}
          >
            &#62;
          </li>
        )}
        {prevNext ? (
          <li
            onClick={lastPage}
            className={
              end === Math.ceil(pageNumbers.length / 10) * 10
                ? style.liNone
                : style.li
            }
          >
            &#62;&#62;
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default Paginate;
