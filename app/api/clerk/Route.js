import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("📥 Webhook received");

  const wh = new Webhook(process.env.SIGNING_SECRET)
  const headerPayload = await headers()
  const svixHeaders = {
     "svix-id": headerPayload.get("svix-id"),
     "svix-timestamp": headerPayload.get("svix-timestamp"),
     "svix-signature": headerPayload.get("svix-signature"),
  }
  // Get payload and verify it

  const payload = await req.json();
  console.log("📦 Payload: ", payload);

  const body = JSON.stringify(payload);
  const {data, type} = wh.verify(body, svixHeaders)

  //Prepare the user data to be saved in the database

   const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      name: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
   };

   await connectDB();
   console.log("🧵 Connected to DB");

   switch (type) {
    case 'user.created':
      await User.create(userData)
      console.log("👤 User created");
      break;
    case 'user.updated':
      await User.findByIdAndUpdate(data.id, userData)
      console.log("✏️ User updated");
      break;
    case 'user.deleted':
      await User.findByIdAndDelete(data.id)
      console.log("🗑️ User deleted");
      break;

      
    default:
      console.log("⚠️ Unhandled type", type);
      break;
  }

   return NextResponse.json({message: "Event received"});

}
