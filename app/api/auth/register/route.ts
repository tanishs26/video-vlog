import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/users.model";
import connectToDB from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // get data from frontend
    const { email, password } = await request.json();
    // check validation
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Please enter both email and password correctly!",
        },
        { status: 400 }
      );
    }
    // check if the database is connected
    await connectToDB();
    // check if the user already exits in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already registered!",
        },
        { status: 400 }
      );
    }
    // if not create the new user
    const newUser = await User.create({
      email,
      password,
    });
    // send the resposne of the user
    return NextResponse.json(
      { data: newUser, message: "User created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Registration error ", error);
    return NextResponse.json({ error });
  }
}
