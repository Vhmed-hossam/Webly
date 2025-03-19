const formatDateOnly = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
export default formatDateOnly;
