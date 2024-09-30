import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { getCookies } from "next-client-cookies/server";
import jwt from "jsonwebtoken";
import { emailpasszod } from "@/app/api/_zod/zoddy";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const cookie = getCookies();
  function isJwtExpired(decodedJwt: any) {
    //jwt expiry check
    const expirationTime = decodedJwt.exp * 1000;
    return Date.now() <= expirationTime; //true if valid jwt, false if invalid
  }
  try {
    if (!process.env.JWT_SECRET_KEY) {
      console.log(
        "Please define environment variable with name JWT_SECRET_KEY"
      );
      throw new Error(
        "Please define environment variable with name JWT_SECRET_KEY" //why is this needed again?
      );
    }
    const jwtToken: any = cookie.get("jwtToken");
    console.log(jwtToken);

    if (jwtToken && process.env.JWT_SECRET_KEY) {
      const decodedjwt: any = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

      if (isJwtExpired(decodedjwt)) {
        //valid jwt and not expired
        const resData: any = await prisma.emailPassPrisma.findUnique({
          where: {
            email: decodedjwt.email,
          },
        });
        if (resData.username != null) {
          const isCorrect = await bcrypt.compare(
            decodedjwt.password,
            resData.password
          );
          if (isCorrect) {
            console.log("Valid jwt");
            const email = decodedjwt.email;
            const password = decodedjwt.password;
            const jwtdata = { email, password };
            const newjwt = jwt.sign(jwtdata, process.env.JWT_SECRET_KEY, {
              expiresIn: "7d",
            });
            return new NextResponse(
              JSON.stringify({ newjwt, status: "success" })
            );
          }
        }
      }
    }

    const body = await req.json();
    console.log(body); //if invalid or expired jwt then user to pass manual data
    const okname = emailpasszod.safeParse(body);
    console.log(okname);
    if (!okname.success) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid credentials", status: "failed" })
      );
    }
    const resData: any = await prisma.emailPassPrisma.findUnique({
      where: {
        email: body.email,
      },
    });
    console.log(resData);
    if (resData.email != null) {
      const hashedPass = await bcrypt.hash(body.password, 10);
      const hashedDBPass = await bcrypt.hash(resData.password, 10);

      console.log(hashedDBPass);
      const isCorrect = await bcrypt.compare(body.password, hashedDBPass);
      if (isCorrect) {
        let newjwt = jwt.sign(
          {
            email: resData.email,
            password: hashedPass,
          },
          process.env.JWT_SECRET_KEY
        );
        return new NextResponse(JSON.stringify({ newjwt, status: "success" }));
      } else {
        return new NextResponse(
          JSON.stringify({ message: "Invalid password", status: "failed" })
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Invalid username", status: "failed" })
      );
    }
  } catch (e) {
    console.log(e);
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong",
        status: "failed",
        error: e,
      })
    );
  }
}
