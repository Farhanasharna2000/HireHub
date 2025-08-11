import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  // console.log('from middleware',req.nextUrl.pathname);
  const token = await getToken({
    req,
    secureCookie: process.env.NODE_ENV === "production" ? true : false,
  }); //from nextauth doc
  if (token) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/login", req.url));
  }
};
export const config = {
  matcher: [
    "/dashboard",
    "/recruiter-dashboard",
    "/post-job",
    "/manage-jobs",
    //  '/checkout/:path*'
  ],
};
