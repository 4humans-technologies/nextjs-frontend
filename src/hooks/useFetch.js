import React, { useState } from "react";

function useFetch({ url, option }) {
  const [response, setReponse] = useState(null);
  const fetchData = async () => {
    const resp = await fetch(url, { option });
    const json = await resp.json();
    return json;
  };
  fetchData().then((data) => {
    return data;
  });
  fetchData().catch((err) => {
    err.message;
  });
}

export default useFetch;
