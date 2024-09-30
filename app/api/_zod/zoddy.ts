import z from "zod";

export const userpasszod = z.object({
  username: z.string(),
  // password: z.string().regex(
  //   //8digits
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  // ),
  password: z.string().min(4),
});

export const emailpasszod = z.object({
  email: z.string().email(),
  // password: z
  //   .string()
  //   .regex(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  //   ),
  password: z.string().min(4),
});

export const mobilepasszod = z.object({
  mobile: z.string(),
  password: z.string(),
});

export const emailOtpzod = z.object({
  // otpLength: z.number(),
  // senderEmail: z.string().email(),
  // senderPass: z.string(),
  email: z.string().email(),
  // subject: z.string(),
  //html
});
