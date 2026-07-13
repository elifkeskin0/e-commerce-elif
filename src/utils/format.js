export const currency = (value = 0) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(value);

export const slugify = (value = "") =>
  value
    .toString()
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const gravatarUrl = (email = "") =>
  `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}?d=identicon`;

export const getProductImage = (product) =>
  product?.images?.[0]?.url || "https://placehold.co/720x960/e8edf3/252b42?text=Elif+Commerce";

export const getCategoryGender = (category) => {
  const code = category?.code || "";
  return code.startsWith("k:") ? "kadin" : "erkek";
};

export const getCategoryName = (category) =>
  slugify(category?.title || category?.code?.split(":")[1] || "kategori");
import md5 from "js-md5";
