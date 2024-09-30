import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { getCookies } from "next-client-cookies/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { emailOtpzod, userpasszod } from "@/app/api/_zod/zoddy";
import bcrypt from "bcrypt";
function generateotp(len: number) {
  const chars = "0123456789";
  let otp = "";
  for (let i = 0; i < len; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
}

async function sendMail(to: string, html: any) {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    },
  });
  await transporter.sendMail({
    to,
    subject: "OTP for verification",
    html,
  });
}

function isJwtExpired(decodedJwt: any) {
  //jwt expiry check
  const expirationTime = decodedJwt.exp * 1000; // Convert to milliseconds
  return Date.now() <= expirationTime; //true if valid jwt, false if invalid
}

export async function POST(req: NextRequest) {
  //res,prisma from user is it needed in params?
  try {
    if (!process.env.JWT_SECRET_KEY) {
      console.log(
        "Please define environment variable with name JWT_SECRET_KEY"
      );
      throw new Error(
        "Please define environment variable with name JWT_SECRET_KEY"
      );
    }
    const cookie = getCookies();
    const jwtToken: any = cookie.get("jwtToken");
    if (jwtToken && process.env.JWT_SECRET) {
      const decodedjwt: any = jwt.verify(jwtToken, process.env.JWT_SECRET);

      if (decodedjwt && isJwtExpired(decodedjwt)) {
        //valid jwt and not expired
        const resData: any = await prisma.emailOtpPrisma.findUnique({
          where: {
            email: decodedjwt.email,
          },
        });
        if (resData.email != null) {
          // const password = await bcrypt.hash(generatePassword(7), 10);
          const email = decodedjwt.email;
          // const jwtdata = { email, password };
          const newjwt = jwt.sign(email, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });
          return new NextResponse(
            JSON.stringify({ newjwt, status: "success" })
          );
        }
      }
    }
    const body: any = await req.json(); //if invalid or expired jwt then user to pass manual data
    const okname = emailOtpzod.safeParse(body);
    console.log(okname);
    console.log(body);
    if (!okname.success) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid credentials", status: "failed" })
      );
    }
    const resData: any = await prisma.emailOtpPrisma.findUnique({
      where: {
        email: body.email,
      },
    });
    console.log(resData);
    if (resData.email != null) {
      const otp = generateotp(5);
      console.log(otp);
      const html = `<p> OTP : ${otp}</p>`; //how to add custom user template otp?

      await sendMail(body.email, html);
      return new NextResponse(
        JSON.stringify({ message: "Verification ok", status: "success" })
      );
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Invalid email", status: "failed" })
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
