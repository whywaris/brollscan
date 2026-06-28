import Anthropic from '@anthropic-ai/sdk';
import { ClaudeSceneResult } from '@/types';
import { MIN_SCENES, MAX_SCENES } from '@/lib/constants';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are a professional video editor's assistant. Your job is to analyze a video script and break it into distinct visual scenes.

Rules:
- Break the script into ${MIN_SCENES} to ${MAX_SCENES} scenes based on visual or narrative shifts
- Group sentences that describe the same visual scene together — do NOT split mid-scene
- For each scene, provide 3-5 concrete, visual, stock-footage-searchable keywords
- Keywords must be specific and visual (e.g. "aerial view of cityscape at sunset" not "atmosphere")
- Keywords should work well as search queries on stock footage sites like Pexels or Pixabay
- Return ONLY valid JSON, no preamble, no markdown fences, no explanation

Output schema (JSON array):
[
  {
    "scene_order": 1,
    "scene_title": "Short descriptive title",
    "text_content": "The exact script text for this scene",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
]

IMPORTANT: Return ONLY the JSON array. No other text.`;

export async function analyzeScript(scriptText: string): Promise<ClaudeSceneResult[]> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Analyze the following video script and break it into visual scenes with stock footage search keywords:\n\n${scriptText}`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Try to parse JSON, handling potential markdown fences
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    const scenes: ClaudeSceneResult[] = JSON.parse(cleanedText);
    
    // Validate structure
    if (!Array.isArray(scenes) || scenes.length === 0) {
      throw new Error('Invalid response: expected non-empty array of scenes');
    }

    // Validate each scene
    for (const scene of scenes) {
      if (!scene.scene_order || !scene.text_content || !scene.keywords || !Array.isArray(scene.keywords)) {
        throw new Error('Invalid scene structure: missing required fields');
      }
    }

    return scenes;
  } catch (error) {
    console.warn('Anthropic API call or parsing failed, using local script segmenter:', error);

    // Local fallback segmenter
    const paragraphs = scriptText
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 10);

    let segments = paragraphs;
    if (segments.length === 0) {
      segments = scriptText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 5);
    }

    if (segments.length === 0) {
      segments = [scriptText.trim()];
    }

    // Determine target scene count (3 to 10)
    const numScenes = Math.min(Math.max(segments.length, 3), 10);
    const sceneLength = Math.max(1, Math.floor(segments.length / numScenes));
    
    const scenes: ClaudeSceneResult[] = [];
    for (let i = 0; i < numScenes; i++) {
      const startIdx = i * sceneLength;
      const endIdx = i === numScenes - 1 ? segments.length : (i + 1) * sceneLength;
      const sceneText = segments.slice(startIdx, endIdx).join(' ');
      
      if (!sceneText.trim()) continue;

      // Extract alphanumeric words longer than 4 chars
      const words = sceneText
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 4 && !['about', 'there', 'their', 'would', 'could', 'should', 'these', 'those', 'where', 'which', 'under', 'beautiful', 'golden'].includes(w));

      const uniqueWords = Array.from(new Set(words)).slice(0, 4);
      const keywords = uniqueWords.length > 0 ? uniqueWords : ['nature', 'cinematic', 'video'];

      scenes.push({
        scene_order: i + 1,
        scene_title: `Scene ${i + 1}: ${keywords[0].toUpperCase()}`,
        text_content: sceneText,
        keywords: keywords,
      });
    }

    return scenes;
  }
}
