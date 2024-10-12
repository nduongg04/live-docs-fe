import { auth } from "@/auth";

export default auth((req) => {
    console.log(req.auth);
    if (!req.auth || req.auth.error === "RefreshTokenError") {
        const newUrl = new URL("/sign-in", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
});

export const config = {
    matcher: ["/"],
};
