import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { getCookies } from "next-client-cookies/server";
import jwt from "jsonwebtoken";
import { emailpasszod } from "@/app/api/_zod/zoddy";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  {
    try {
      const body: any = await req.json();
      if (!process.env.JWT_SECRET_KEY) {
        console.log(
          "Please define environment variable with name JWT_SECRET_KEY"
        );
        throw new Error(
          "Please define environment variable with name JWT_SECRET_KEY" //why is this needed again?
        );
      }
      const okbody = emailpasszod.safeParse(body);
      console.log(okbody);
      if (!okbody.success) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid credentials", status: "failed" })
        );
      }
      const user = await prisma.emailPassPrisma.findUnique({
        where: {
          email: body.email,
        },
      });
      if (user === null) {
        let promise = new Promise((res) => {
          bcrypt.hash(body.password, 10, (err, response) => {
            if (err) throw new Error(err.toString());
            body.password = response;
            res("");
          });
        });
        await promise;
        await prisma.emailPassPrisma.create({
          data: {
            //do i really have to give this format-> ask user for this pattern
            email: body.email,
            password: body.password,
          },
        });
        const newjwt = jwt.sign(
          {
            email: body.email,
            password: body.password,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "7d" }
        );
        return new NextResponse(JSON.stringify({ newjwt, status: "success" }));
      } else {
        return new NextResponse(
          JSON.stringify({
            message: "User already exists",
            status: "failed",
          })
        );
      }
    } catch (e) {
      return new NextResponse(
        JSON.stringify({
          message: "Something went wrong",
          status: "failed",
        })
      );
    }
  }
}
