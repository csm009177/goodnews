import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/r2/presigned";
import { canRecordAudio } from "@/lib/utils/roles";

/**
 * 합창 녹음 파일용 R2 presigned URL 발급 API
 * POST /api/choir/recording/upload-url
 * 
 * Body: { fileName: string, contentType: string }
 * Response: { uploadUrl: string, fileKey: string }
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: 실제 인증 연동 시 요청 헤더에서 사용자 역할 확인
    // const { user } = await getSession(request);
    // if (!canRecordAudio(user.role)) {
    //   return NextResponse.json(
    //     { error: "녹음 권한이 없습니다." },
    //     { status: 403 }
    //   );
    // }

    const body = await request.json();
    const { fileName, contentType = "audio/webm" } = body;

    if (!fileName) {
      return NextResponse.json(
        { error: "파일 이름이 필요합니다." },
        { status: 400 }
      );
    }

    // R2 키 생성: choir/recordings/{date}/{timestamp}-{fileName}
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const timestamp = Date.now();
    const fileKey = `choir/recordings/${date}/${timestamp}-${fileName}`;

    const uploadUrl = await getPresignedUploadUrl(fileKey, contentType, 3600);

    return NextResponse.json({
      uploadUrl,
      fileKey,
    });
  } catch (error) {
    console.error("Failed to generate upload URL:", error);
    return NextResponse.json(
      { error: "업로드 URL 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}