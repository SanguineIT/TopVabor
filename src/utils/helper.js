import Swal from "sweetalert2";
import { CountryEnum } from "../components/Country";

const onError = (err) => {
  Swal.fire({
    icon: "error",
    // title: "Something went wrong.",
    text: err,
  });
};

function isNumber(n) {
  return Number(n) === n;
}

const currencySymbols = {
  [CountryEnum.UZBEKISTAN]: "лв", // Uzbekistani Som
  [CountryEnum.UAE]: "د.إ", // United Arab Emirates Dirham
};

const selectedCountry = localStorage.getItem("country");

export { onError, isNumber, currencySymbols, selectedCountry };
