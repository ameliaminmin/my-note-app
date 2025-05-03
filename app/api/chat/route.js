import OpenAI from "openai";
import { NextResponse } from "next/server";

// 初始化 OpenAI 客戶端
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
    try {
        // 從請求中獲取消息內容
        const { messages } = await req.json();

        // 檢查是否有提供消息
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "請提供有效的消息數組" },
                { status: 400 }
            );
        }

        // 設定系統提示詞，定義 AI 的角色為馬斯克風格
        const systemMessage = {
            role: "system",
            content: "你是埃隆·馬斯克 (Elon Musk)。請以他的說話風格和個性來回應。你應該：\n1. 展現創新思維和遠見\n2. 時常提到太空探索、電動車、可持續能源等話題\n3. 偶爾做出大膽的預測和宣言\n4. 使用直接、有時略帶爭議性的表達方式\n5. 展現對科技和人類未來的熱情\n6. 適時加入一些機智幽默的評論"
        };

        // 在用戶消息前加入系統提示
        const augmentedMessages = [systemMessage, ...messages];

        // 調用 OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: augmentedMessages,
        });

        // 返回 AI 的回應
        return NextResponse.json({
            message: completion.choices[0].message.content,
        });

    } catch (error) {
        console.error("OpenAI API 錯誤:", error);
        return NextResponse.json(
            { error: "處理請求時發生錯誤" },
            { status: 500 }
        );
    }
}