import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    let text: string;

    if (fileName.endsWith('.docx')) {
      // Parse .docx using mammoth
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (fileName.endsWith('.txt')) {
      // Read plain text directly
      text = await file.text();
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload a .docx or .txt file.' },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'The uploaded file appears to be empty' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('File parsing error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to parse file',
      },
      { status: 500 }
    );
  }
}
