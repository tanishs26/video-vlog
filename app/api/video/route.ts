import { authOptions } from "@/lib/auth";
import connectToDB from "@/lib/db";
import { IVideo, Video } from "@/models/video.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (videos.length === 0 || !videos) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch videos" },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "No user session find " },
        { status: 401 }
      );
    }
    await connectToDB();

    const body: IVideo = await request.json();
    if (
      !body.title ||
      !body.description ||
      !body.thumbnailUrl ||
      !body.videoUrl
    ) {
      return NextResponse.json(
        { error: "All fields required " },
        { status: 401 }
      );
    }
    const videoData = {
      ...body,
      controls: body?.controls || true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };
    const newVideo = await Video.create(videoData);

    return NextResponse.json(
      { data: newVideo, message: "Video created!" },
      { status: 200 }
    );
  } catch (error) {
    NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
