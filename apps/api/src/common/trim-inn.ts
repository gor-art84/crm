export function trimInn(inn: string) {
  const trimmedInn = inn.replace(/[^0-9]/g, "");
  return trimmedInn.length === 10 ? trimmedInn : trimmedInn.length === 12 ? trimmedInn : null;
}
