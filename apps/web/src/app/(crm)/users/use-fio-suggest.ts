import { useLazyQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { CLEAN_FIO, FIO_SUGGESTIONS } from "@/shared/api/graphql/dadata";

export const useFioSuggest = (initialValue = "") => {
  const [fetchFio, { data: fioData, loading: fioLoading }] = useLazyQuery(FIO_SUGGESTIONS);
  const [fioInput, setFioInput] = useState(initialValue);
  const [cleanFio, { loading: cleanFioLoading }] = useLazyQuery(CLEAN_FIO);

  const fioOptions =
    fioData?.fioSuggestions.map((item, index) => ({
      ...item,
      key: `${item.value}-${item.surname}-${item.name}-${item.patronymic}-${index}`,
    })) ?? [];

  useEffect(() => {
    const q = fioInput.trim();
    if (q.length < 2) return;

    const id = window.setTimeout(() => {
      void fetchFio({ variables: { query: q, count: 7 } });
    }, 300);

    return () => {
      window.clearTimeout(id);
    };
  }, [fioInput, fetchFio]);

  const runCleanFio = async () => {
    const q = fioInput.trim();
    if (q.length < 2) return null;
    const result = await cleanFio({ variables: { query: q } });
    return result.data?.cleanFio ?? null;
  };

  return { fioOptions, fioInput, setFioInput, fioLoading, runCleanFio, cleanFioLoading };
};
