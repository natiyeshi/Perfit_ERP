import Cookies from "js-cookie";

export const handleLogout = () => {
    Cookies.remove("token");
    if (typeof location !== "undefined") location.href = "/sign-in";
};

